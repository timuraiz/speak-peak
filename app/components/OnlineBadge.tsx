import React from 'react';

interface OnlineBadgeProps {
    count: number;
    className?: string;
}

export default function OnlineBadge({
    count,
    className = '',
}: OnlineBadgeProps) {
    return (
        <div className={`flex items-center gap-1.5 ${className} border border-border rounded-full py-2 px-2.5`}>
            <span className="w-1 h-1 rounded-full bg-green" aria-hidden="true" />
            <span className="text-xs font-light text-dark-50">
                <span className="text-xs font-medium text-dark">{count}</span> online
            </span>
        </div>
    );
}

