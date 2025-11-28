export default function AccountItem() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <img className="w-6 h-6" src="/avatar.png" alt="Alex Smith" />
        <span className="text-14 font-light text-dark">Alex Smith</span>
      </div>
      <a href="#">
        <img
          src="/iconsax-logout-02.svg"
          alt="Logout"
          className="opacity-50 ml-auto w-4 h-4"
        />
      </a>
    </div>
  );
} 
