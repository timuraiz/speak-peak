interface CircularProgressProps {
    radius: number;
    circumference: number;
    strokeDashoffset: number;
}

export default function CircularProgress({
    radius,
    circumference,
    strokeDashoffset,
}: CircularProgressProps) {
    return (
        <svg className="w-11 h-11" viewBox="0 0 44 44">
            {/* Background circle */}
            <circle
                cx="22"
                cy="22"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                className="text-border"
            />
            {/* Progress circle */}
            <circle
                cx="22"
                cy="22"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                className="text-accent transition-all duration-300"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 22 22)"
            />
            {/* Text inside circle */}
        </svg>
    );
}

