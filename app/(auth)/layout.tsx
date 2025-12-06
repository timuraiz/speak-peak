export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="h-screen bg-background p-4">
            {children}
        </div>
    )
}

