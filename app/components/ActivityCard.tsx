'use client';

interface ActivityCardProps {
    icon: string;
    title: string;
    description: string;
    alt?: string;
    isPressed?: boolean;
    topic?: boolean;
    object?: boolean;
    onClick?: () => void;
}

export default function ActivityCard({ icon, title, description, alt = "activity icon", isPressed = false, topic = false, object = false, onClick }: ActivityCardProps) {
    const getBorderClass = () => {
        if (!isPressed) {
            return "border-border";
        }
        if (topic) {
            return "border-[var(--color-orange)]";
        }
        if (object) {
            return "border-[var(--color-accent)]";
        }
        return "border-border";
    };

    return (
        <button
            onClick={onClick}
            className={`flex flex-col gap-5 w-full border ${getBorderClass()} p-5 pr-10 rounded-2xl cursor-pointer hover:bg-hover transition-colors duration-150 text-left`}
        >
            <img src={icon} alt={alt} className="w-5 h-5" />
            <div className="flex flex-col gap-2 ">
                <h2 className="text-base font-semibold text-dark">{title}</h2>
                <p className="text-dark-70 font-light text-xs">{description}</p>
            </div>
        </button>
    );
}
