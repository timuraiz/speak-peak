import Image from "next/image";
import { useCallContext } from "../(call)/layout";

interface MemberProps {
    isCurrentUser?: boolean;
}

export default function Member({ isCurrentUser = false }: MemberProps) {
    const { isLeader, isMuted, currentUser, partner } = useCallContext();
    const person = isCurrentUser ? currentUser : partner;
    return (
        <div className="flex justify-between items-center w-full bg-white rounded-2xl p-4 pr-5">
            <div className="flex gap-3 items-center">
                <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
                    <Image src={person.avatar ?? '/avatar.png'} alt={person.name} fill />
                </div>
                <div className="flex flex gap-1.5">
                    <span className="text-base font-medium text-dark">{person.name}</span>
                    {isCurrentUser && (
                        <span className="px-2 py-1 rounded-full bg-accent-12 text-accent text-xs font-medium">
                            You
                        </span>
                    )}
                    {isCurrentUser && isMuted && <img src="/Call/muted2.svg" alt="muted" />}
                </div>
            </div>
            {isCurrentUser === isLeader && <img src="/Call/crown.svg" alt="Manager" className="w-5 h-5" />}
        </div>
    );
}
