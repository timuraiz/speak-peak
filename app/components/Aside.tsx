import AccountItem from "./AccountItem";
import Menu from "./Menu";

export default function Aside() {
  return (
    <aside className="hidden md:flex w-[246px] shrink-0 px-5 py-8 gap-15 flex-col h-full">
      <h1 className="text-2xl font-semibold text-[#494949]">SpeakPeak</h1>
      <Menu />
      <AccountItem />
    </aside>
  );
}

