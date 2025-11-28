import Image from "next/image";
import DiamondIcon from "../icons/DiamondIcon";

export default function PracticeContainer() {
  return (
    <div className="flex flex-col gap-4">
      {/* Header with icon and title */}
      <div className="flex items-center gap-2">
        <DiamondIcon className="text-[#9333EA]" />
        <h2 className="text-14-medium text-[#9333EA]">Practice Container</h2>
      </div>

      {/* Main card */}
      <div className="bg-[#F5F5F5] rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* REAL PRACTISE label */}
          <div className="flex items-center justify-between">
            <span className="text-14-medium text-[var(--color-dark)] uppercase tracking-wide">
              REAL PRACTISE
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-3xl font-bold text-[var(--color-dark)]">
            Speak with a real person
          </h1>

          {/* Subtitle */}
          <p className="text-14-regular text-[var(--color-dark-50)]">
            We'll match you instantly with another learner
          </p>          
        </div>
      </div>
    </div>
  );
}

