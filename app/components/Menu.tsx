import Image from "next/image";
import MenuItem from "./MenuItem";

export default function Menu() {
  return (
    <nav className="flex-1">
      <ul className="flex flex-col gap-8">
        <MenuItem label="Practice" icon={<Image src="/iconsax-microphone.svg" alt="Practice" width={20} height={20} color="dark"/>} />
        <MenuItem label="Progress" icon={<span className="opacity-50"><Image src="/iconsax-activity.svg" alt="Progress" width={20} height={20} /></span>} soon={true}/>
        <MenuItem label="Meetings" icon={<span className="opacity-50"><Image src="/iconsax-calendar.svg" alt="Meetings" width={20} height={20} /></span>} soon={true}/>
      </ul>
    </nav>
  );
}

