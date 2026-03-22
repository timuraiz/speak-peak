interface QueueEntry {
  userId: string;
  name: string;
  joinedAt: number;
}

interface Room {
  roomId: string;
  user1Id: string;
  user1Name: string;
  user2Id: string;
  user2Name: string;
  createdAt: number;
}

// Use globalThis so state survives HMR module reloads in Next.js dev mode
const g = globalThis as typeof globalThis & {
  _queue: Map<string, QueueEntry>;
  _rooms: Map<string, Room>;
  _userToRoom: Map<string, string>;
  _roomActivity: Map<string, string | null>;
};

if (!g._queue) g._queue = new Map();
if (!g._rooms) g._rooms = new Map();
if (!g._userToRoom) g._userToRoom = new Map();
if (!g._roomActivity) g._roomActivity = new Map();

const queue = g._queue;
const rooms = g._rooms;
const userToRoom = g._userToRoom;
const roomActivity = g._roomActivity;

export function joinQueue(
  userId: string,
  name: string,
): { matched: boolean; roomId?: string; isLeader?: boolean } {
  // Clean up any stale room from a previous session
  if (userToRoom.has(userId)) {
    leaveRoom(userId);
  }

  // Find first waiting user that isn't us
  let match: QueueEntry | null = null;
  for (const [id, entry] of queue.entries()) {
    if (id !== userId) {
      match = entry;
      queue.delete(id);
      break;
    }
  }

  if (match) {
    const roomId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const room: Room = {
      roomId,
      user1Id: match.userId, // user1 = leader
      user1Name: match.name,
      user2Id: userId,
      user2Name: name,
      createdAt: Date.now(),
    };
    rooms.set(roomId, room);
    userToRoom.set(match.userId, roomId);
    userToRoom.set(userId, roomId);
    // joining user is user2, so not the leader
    return { matched: true, roomId, isLeader: false };
  }

  // No match — add to queue
  queue.set(userId, { userId, name, joinedAt: Date.now() });
  return { matched: false };
}

export function getMatchStatus(
  userId: string,
): { matched: boolean; roomId?: string; isLeader?: boolean } {
  const roomId = userToRoom.get(userId);
  if (roomId) {
    const room = rooms.get(roomId);
    return { matched: true, roomId, isLeader: room?.user1Id === userId };
  }
  return { matched: false };
}

export function getRoom(roomId: string): Room | undefined {
  return rooms.get(roomId);
}

export function getPartner(roomId: string, userId: string): { id: string; name: string } | null {
  const room = rooms.get(roomId);
  if (!room) return null;
  if (room.user1Id === userId) return { id: room.user2Id, name: room.user2Name };
  if (room.user2Id === userId) return { id: room.user1Id, name: room.user1Name };
  return null;
}

export function leaveQueue(userId: string): void {
  queue.delete(userId);
}

export function leaveRoom(userId: string): void {
  const roomId = userToRoom.get(userId);
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (room) {
    userToRoom.delete(room.user1Id);
    userToRoom.delete(room.user2Id);
    rooms.delete(roomId);
    roomActivity.delete(roomId);
  }
}

export function setRoomActivity(roomId: string, activity: string | null): void {
  roomActivity.set(roomId, activity);
}

export function getRoomActivity(roomId: string): string | null {
  return roomActivity.get(roomId) ?? null;
}
