interface TimeSpentCardProps {
    time?: string;
    dailyGoal?: number; // in minutes
    dailyData?: number[]; // array of 36 values representing time spent each day in minutes
}

function getHeatMapColor(timeSpent: number, dailyGoal: number): string {
    if (dailyGoal === 0) return "bg-dark-8";

    const percentage = (timeSpent / dailyGoal) * 100;

    if (percentage >= 100) return "bg-accent";
    if (percentage >= 70) return "bg-accent-70";
    if (percentage >= 50) return "bg-accent-50";
    if (percentage >= 25) return "bg-accent-25";
    return "bg-dark-8";
}

export default function TimeSpentCard({
    time = "4h 23 min",
    dailyGoal = 60, // default 60 minutes
    dailyData = [
        // Row 1: Mix of all levels
        0, 10, 20, 35, 45, 60, 75, 90, 0,
        // Row 2: More variety
        15, 30, 50, 65, 80, 0, 25, 55, 70,
        // Row 3: Pattern showing progression
        5, 20, 40, 60, 85, 10, 30, 50, 70,
        // Row 4: Final row with mix
        0, 25, 45, 60, 75, 15, 35, 55, 0
    ]
}: TimeSpentCardProps) {
    return (
        <div className="border border-border p-8 rounded-[20px] md:rounded-[24px] lg:rounded-[28px]">
            <h2 className="text-[28px] md:text-[30px] lg:text-[32px] font-semibold text-dark">
                {time}
            </h2>
            <p className="text-sm font-normal text-dark-50">
                Total time spent on calls
            </p>
            <div className="grid grid-cols-9 grid-rows-4 gap-1 mt-5">
                {dailyData.map((timeSpent, i) => (
                    <div
                        key={i}
                        className={`w-4 h-4 rounded-full ${getHeatMapColor(timeSpent, dailyGoal)}`}
                    />
                ))}
            </div>
        </div>
    );
}

