import { useCallContext } from "../(call)/layout";

interface MemberProps {
    isCurrentUser?: boolean;
}

export default function Member({ isCurrentUser = false }: MemberProps) {
    const { isLeader, isMuted } = useCallContext();
    return (
        <div className="flex justify-between items-center w-full bg-white rounded-2xl p-4 pr-5">
            <div className="flex gap-3 items-center">
                <img className="w-8 h-8" src="/avatar.png" alt="Alex Smith" />
                <div className="flex flex gap-1.5">
                    <span className="text-base font-medium text-dark">John Doe</span>
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
