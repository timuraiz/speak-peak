export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {children}
    </div>
  );
}

