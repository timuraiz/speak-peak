interface WordCardProps {
    word: string;
    pronunciation: string;
    tags: string[];
}

export default function WordCard({ word, pronunciation, tags }: WordCardProps) {
    return (
        <div className="flex-shrink-0 bg-white border border-border rounded-2xl p-4 min-w-[200px] flex flex-col gap-3">
            <div className="flex flex-col gap-1">
                <h4 className="text-base font-semibold text-dark">{word}</h4>
                <p className="text-xs text-dark-50">{pronunciation}</p>
            </div>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-accent-12 rounded-full text-xs font-medium text-accent">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}

