"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showEmailLogin, setShowEmailLogin] = useState(false);
    const router = useRouter();

    const handleGuestLogin = () => {
        document.cookie = "guest_mode=true; path=/; max-age=86400"; // Expires in 1 day
        router.push("/dashboard");
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const supabase = createClient();

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                setIsLoading(false);
                return;
            }

            // Clear ghost guest_mode cookie
            if (typeof document !== 'undefined') {
                document.cookie = "guest_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }

            // Redirect to dashboard on success
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
                    <span className="material-symbols-outlined text-primary text-3xl">task_alt</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Smart Time
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">Học ít hơn, hiểu nhiều hơn.</p>
            </div>

            <div className="space-y-4">
                <button
                    onClick={handleGuestLogin}
                    type="button"
                    className="w-full py-4 px-4 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold rounded-xl shadow-sm hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors flex flex-col items-center justify-center gap-1"
                >
                    <span className="flex items-center gap-2 text-lg"><span className="material-symbols-outlined">explore</span> Tiếp tục như Khách</span>
                    <span className="text-xs font-normal opacity-80">(* Khám phá các tính năng với dữ liệu mock)</span>
                </button>

                <div className="relative flex items-center justify-center py-4">
                    <span className="absolute bg-gray-200 dark:bg-gray-700 h-px w-full"></span>
                    <span className="relative bg-white dark:bg-gray-800 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Hoặc</span>
                </div>

                {!showEmailLogin ? (
                    <button
                        onClick={() => setShowEmailLogin(true)}
                        type="button"
                        className="w-full py-3 px-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl shadow-sm hover:shadow transition-shadow flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-primary text-xl">mail</span>
                        Đăng nhập bằng Email
                    </button>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-5 animate-in slide-in-from-top-4 duration-300">
                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl border border-red-200 dark:border-red-800 text-center">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email của bạn</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <span className="material-symbols-outlined text-[18px]">email</span>
                                </span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl pl-11 pr-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-shadow"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Mật khẩu</label>
                                <Link href="#" className="text-xs font-bold text-primary hover:text-orange-600 transition-colors">Quên mật khẩu?</Link>
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <span className="material-symbols-outlined text-[18px]">lock</span>
                                </span>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl pl-11 pr-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-shadow"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3 px-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-600 hover:-translate-y-0.5'}`}
                            >
                                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
                Chưa có tài khoản?{" "}
                <Link href="/auth/register" className="font-bold text-primary hover:text-orange-600 transition-colors">
                    Đăng ký ngay
                </Link>
            </p>
        </div>
    );
}
