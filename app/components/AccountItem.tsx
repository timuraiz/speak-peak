"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/contexts/AuthContext";

export default function AccountItem() {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const displayName = profile?.name ?? user?.email?.split("@")[0] ?? "User";

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
          <Image src={profile?.avatar ?? "/avatar.png"} alt="User" fill />
        </div>
        <span className="text-14 font-light text-dark">{displayName}</span>
      </div>
      <button
        onClick={handleSignOut}
        className="hover:opacity-70 transition-opacity"
      >
        <img
          src="/iconsax-logout-02.svg"
          alt="Logout"
          className="opacity-50 ml-auto w-4 h-4"
        />
      </button>
    </div>
  );
}
