'use client';

interface LeaveActivityButtonProps {
    onClick: () => void;
}

export default function LeaveActivityButton({ onClick }: LeaveActivityButtonProps) {
    return (
        <div className="flex justify-start gap-2 cursor-pointer" onClick={onClick}>
            <img src="/Call/ArrowLeft.svg" alt="Leave activity" className="w-5 h-5" />
            <p className="text-sm font-medium text-dark-70">
                Leave activity
            </p>
        </div>
    );
}

