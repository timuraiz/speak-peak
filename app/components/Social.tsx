interface SocialProps {
    icon: string;
    text: string;
    onClick: () => void;
}

export default function Social({
    icon,
    text,
    onClick
}: SocialProps) {
    return (
        <div className="flex items-center gap-2 bg-white rounded-2xl px-11.25 py-4.5 border border-border w-full justify-center">
            <img src={icon} alt={text} className="w-4 h-4" />
            <p className="text-sm font-medium text-dark">{text}</p>
        </div>
    );
}
