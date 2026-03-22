import Aside from "../components/Aside";
import BottomNav from "../components/BottomNav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-screen overflow-hidden md:p-4 md:gap-4">
      <Aside />
      <main className="flex-1 min-w-0 overflow-auto bg-white md:border md:border-border md:rounded-3xl pb-20 md:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
