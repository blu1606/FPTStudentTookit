export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
            {/* Background Ornaments */}
            <div className="absolute top-0 right-0 -m-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -m-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

            {/* Content wrapper */}
            <div className="w-full max-w-md relative z-10">
                {children}
            </div>
        </div>
    );
}
