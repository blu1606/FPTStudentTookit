"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className={`size-10 rounded-lg border border-[#eadbcd] dark:border-white/10 flex items-center justify-center hover:bg-white dark:hover:bg-white/5 transition-colors ${className || ''}`}>
                <span className="material-icons-round text-primary">dark_mode</span>
            </button>
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`size-10 rounded-lg border border-[#eadbcd] dark:border-white/10 flex items-center justify-center hover:bg-white dark:hover:bg-white/5 transition-colors ${className || ''}`}
        >
            {theme === "dark" ? (
                <span className="material-icons-round text-primary block">light_mode</span>
            ) : (
                <span className="material-icons-round text-primary block">dark_mode</span>
            )}
        </button>
    );
}
