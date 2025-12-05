import Aside from "../components/Aside";


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-screen overflow-hidden p-4 gap-4">
      <Aside />
      <main className="flex-1 min-w-0 overflow-auto bg-white border border-border rounded-3xl">
        {children}
      </main>
    </div>
  );
}

