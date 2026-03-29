import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const QUEUE_KEY = 'speak:queue';
const TTL = 7200; // 2 hours

interface QueueEntry {
  userId: string;
  name: string;
  avatar: string | null;
  joinedAt: number;
}

interface Room {
  roomId: string;
  user1Id: string;
  user1Name: string;
  user1Avatar: string | null;
  user2Id: string;
  user2Name: string;
  user2Avatar: string | null;
  createdAt: number;
}

export async function joinQueue(
  userId: string,
  name: string,
  avatar: string | null = null,
): Promise<{ matched: boolean; roomId?: string; isLeader?: boolean }> {
  // Clean up any stale room from a previous session
  await leaveRoom(userId);

  // Atomically pop a waiting user from the queue
  const raw = await redis.rpop<string>(QUEUE_KEY);

  if (raw) {
    const match: QueueEntry = typeof raw === 'string' ? JSON.parse(raw) : raw;

    // Edge case: matched ourselves (shouldn't happen, but just in case)
    if (match.userId === userId) {
      await redis.lpush(QUEUE_KEY, JSON.stringify(match));
      await redis.lpush(QUEUE_KEY, JSON.stringify({ userId, name, avatar, joinedAt: Date.now() }));
      return { matched: false };
    }

    const roomId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const room: Room = {
      roomId,
      user1Id: match.userId, // user1 = leader (was waiting)
      user1Name: match.name,
      user1Avatar: match.avatar,
      user2Id: userId,
      user2Name: name,
      user2Avatar: avatar,
      createdAt: Date.now(),
    };

    await Promise.all([
      redis.set(`speak:room:${roomId}`, JSON.stringify(room), { ex: TTL }),
      redis.set(`speak:userToRoom:${match.userId}`, roomId, { ex: TTL }),
      redis.set(`speak:userToRoom:${userId}`, roomId, { ex: TTL }),
    ]);

    return { matched: true, roomId, isLeader: false };
  }

  // No match — add to queue
  await redis.lpush(QUEUE_KEY, JSON.stringify({ userId, name, avatar, joinedAt: Date.now() }));
  return { matched: false };
}

export async function getMatchStatus(
  userId: string,
): Promise<{ matched: boolean; roomId?: string; isLeader?: boolean }> {
  const roomId = await redis.get<string>(`speak:userToRoom:${userId}`);
  if (roomId) {
    const raw = await redis.get<string>(`speak:room:${roomId}`);
    if (raw) {
      const room: Room = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return { matched: true, roomId, isLeader: room.user1Id === userId };
    }
  }
  return { matched: false };
}

export async function getPartner(
  roomId: string,
  userId: string,
): Promise<{ id: string; name: string; avatar: string | null } | null> {
  const raw = await redis.get<string>(`speak:room:${roomId}`);
  if (!raw) return null;
  const room: Room = typeof raw === 'string' ? JSON.parse(raw) : raw;
  if (room.user1Id === userId) return { id: room.user2Id, name: room.user2Name, avatar: room.user2Avatar };
  if (room.user2Id === userId) return { id: room.user1Id, name: room.user1Name, avatar: room.user1Avatar };
  return null;
}

export async function leaveQueue(userId: string): Promise<void> {
  // Remove all entries for this userId from the queue
  const items = await redis.lrange<string>(QUEUE_KEY, 0, -1);
  for (const item of items) {
    const entry: QueueEntry = typeof item === 'string' ? JSON.parse(item) : item;
    if (entry.userId === userId) {
      await redis.lrem(QUEUE_KEY, 1, item);
    }
  }
}

export async function leaveRoom(userId: string): Promise<void> {
  const roomId = await redis.get<string>(`speak:userToRoom:${userId}`);
  if (!roomId) return;

  const raw = await redis.get<string>(`speak:room:${roomId}`);
  if (raw) {
    const room: Room = typeof raw === 'string' ? JSON.parse(raw) : raw;
    await Promise.all([
      redis.del(`speak:userToRoom:${room.user1Id}`),
      redis.del(`speak:userToRoom:${room.user2Id}`),
      redis.del(`speak:room:${roomId}`),
      redis.del(`speak:roomActivity:${roomId}`),
    ]);
  } else {
    await redis.del(`speak:userToRoom:${userId}`);
  }
}

export async function getQueueStats(): Promise<{ count: number; avatars: (string | null)[] }> {
  const items = await redis.lrange<string>(QUEUE_KEY, 0, -1);
  const entries: QueueEntry[] = items.map((item) =>
    typeof item === 'string' ? JSON.parse(item) : item
  );
  const avatars = entries.slice(0, 3).map((e) => e.avatar);
  return { count: entries.length, avatars };
}

export async function setRoomActivity(roomId: string, activity: string | null): Promise<void> {
  if (activity === null) {
    await redis.del(`speak:roomActivity:${roomId}`);
  } else {
    await redis.set(`speak:roomActivity:${roomId}`, activity, { ex: TTL });
  }
}

export async function getRoomActivity(roomId: string): Promise<string | null> {
  return await redis.get<string>(`speak:roomActivity:${roomId}`);
}
