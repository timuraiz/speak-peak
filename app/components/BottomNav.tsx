"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

const items = [
  { label: "Practice", href: "/", icon: "/iconsax-microphone.svg" },
  {
    label: "Progress",
    href: "/progress",
    icon: "/iconsax-activity.svg",
    soon: true,
  },
  {
    label: "Meetings",
    href: "/meetings",
    icon: "/iconsax-calendar.svg",
    soon: true,
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { profile, user } = useAuth();
  const avatar = profile?.avatar ?? null;
  const displayName = profile?.name ?? user?.email?.split("@")[0] ?? "Account";

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border rounded-t-3xl flex items-center justify-around px-4 py-3 z-40">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.soon ? "#" : item.href}
            className={`flex flex-col items-center gap-1 relative ${item.soon ? "opacity-40 pointer-events-none" : ""}`}
          >
            {item.soon && (
              <span className="absolute -top-1 -right-2 px-1 py-0.5 rounded-full bg-accent-12 text-accent text-[8px] font-medium leading-none">
                soon
              </span>
            )}
            <Image
              src={item.icon}
              alt={item.label}
              width={22}
              height={22}
              className={active ? "" : "opacity-40"}
            />
            <span
              className={`text-[10px] font-medium ${active ? "text-dark" : "text-dark-50"}`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}

      {/* Account avatar */}
      <div className="flex flex-col items-center gap-1">
        <div className="relative w-6 h-6 rounded-full overflow-hidden">
          <Image src={avatar ?? "/1.png"} alt="Account" fill />
        </div>
        <span className="text-[10px] font-medium text-dark-50">
          {displayName}
        </span>
      </div>
    </nav>
  );
}
