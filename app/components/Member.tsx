import Image from "next/image";
import { useCallContext } from "../(call)/layout";

interface MemberProps {
    isCurrentUser?: boolean;
}

export default function Member({ isCurrentUser = false }: MemberProps) {
    const { isLeader, isMuted, currentUser, partner } = useCallContext();
    const person = isCurrentUser ? currentUser : partner;
    return (
        <div className="flex justify-between items-center w-full bg-white rounded-2xl p-3 md:p-4 md:pr-5">
            <div className="flex gap-2 md:gap-3 items-center">
                <div className="relative w-7 h-7 md:w-9 md:h-9 rounded-full overflow-hidden shrink-0">
                    <Image src={person.avatar ?? '/avatar.png'} alt={person.name} fill />
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-sm md:text-base font-medium text-dark">{person.name}</span>
                    {isCurrentUser && (
                        <span className="px-1.5 py-0.5 rounded-full bg-accent-12 text-accent text-[10px] md:text-xs font-medium">
                            You
                        </span>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-1.5">
                {isCurrentUser && isMuted && <img src="/Call/muted2.svg" alt="muted" className="w-4 h-4" />}
                {isCurrentUser === isLeader && <img src="/Call/crown.svg" alt="Manager" className="w-4 h-4 md:w-5 md:h-5" />}
            </div>
        </div>
    );
}
