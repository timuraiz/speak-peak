'use client'

import { useRouter } from 'next/navigation'

export default function AccountItem() {
  const router = useRouter()

  const handleSignOut = () => {
    // TODO: Implement sign out logic
    router.push('/login')
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <img
          className="w-6 h-6 rounded-full"
          src="/avatar.png"
          alt="User"
        />
        <span className="text-14 font-light text-dark">
          User
        </span>
      </div>
      <button onClick={handleSignOut} className="hover:opacity-70 transition-opacity">
        <img
          src="/iconsax-logout-02.svg"
          alt="Logout"
          className="opacity-50 ml-auto w-4 h-4"
        />
      </button>
    </div>
  )
}
