import Image from "next/image";

interface FireProps {
  streak?: number;
}


export default function Fire({ streak = 0 }: FireProps) {
  const getFireConfig = () => {
    if (streak === 0) {
      return {
        icon: "/fire_0.svg",
        bgClass: "bg-[#FAFAFA]",
        borderClass: "border-[#FAFAFA]"
      };
    } else if (streak >= 1 && streak < 5) {
      return {
        icon: "/fire_1.svg",
        bgClass: "bg-orange-16",
        borderClass: "border-orange-24"
      };
    } else if (streak >= 5 && streak < 11) {
      return {
        icon: "/fire_2.svg",
        bgClass: "bg-orange-24",
        borderClass: "border-orange-52"
      };
    } else {
      return {
        icon: "/fire_3.svg",
        bgClass: "bg-red-24",
        borderClass: "border-red-52"
      };
    }
  };

  const config = getFireConfig();

  return (
    <div className={`${config.bgClass} ${config.borderClass} border p-1.5 pl-3.5 pr-4 flex justify-start items-center rounded-full gap-1`}>
      <img className="w-4 h-4" src={config.icon} alt="Fire" />
      <span className="text-16 font-semibold text-dark">
        {streak}
      </span>
    </div>
  );
}

