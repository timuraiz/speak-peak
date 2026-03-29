import Image from "next/image";
import { useCallContext } from "../(call)/layout";

interface MemberProps {
  isCurrentUser?: boolean;
}

export default function Member({ isCurrentUser = false }: MemberProps) {
  const { isLeader, isMuted, partnerMuted, currentUser, partner } =
    useCallContext();
  const person = isCurrentUser ? currentUser : partner;
  return (
    <div className="flex items-center w-full bg-white rounded-2xl p-3 md:p-4 md:pr-5 gap-2 md:gap-3">
      <div className="relative w-7 h-7 md:w-9 md:h-9 rounded-full overflow-hidden shrink-0">
        <Image src={person.avatar ?? "/avatar.png"} alt={person.name} fill />
      </div>
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-sm md:text-base font-medium text-dark truncate">
            {person.name}
          </span>
          {isCurrentUser && (
            <span className="px-1.5 py-0.5 rounded-full bg-accent-12 text-accent text-[10px] md:text-xs font-medium shrink-0">
              You
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {(isCurrentUser ? isMuted : partnerMuted) && (
            <Image src="/Call/muted2.svg" alt="muted" width={14} height={14} />
          )}
          {isCurrentUser === isLeader && (
            <Image src="/Call/crown.svg" alt="Manager" width={14} height={14} />
          )}
        </div>
      </div>
    </div>
  );
}
