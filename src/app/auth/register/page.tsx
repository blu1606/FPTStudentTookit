"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const router = useRouter();

    // Handlers for cooldown timer
    useEffect(() => {
        if (cooldown <= 0) return;

        const interval = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [cooldown]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }



        if (cooldown > 0) {
            setError(`Vui lòng đợi ${cooldown} giây trước khi thử lại.`);
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        const supabase = createClient();

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    }
                }
            });

            if (signUpError) {
                if (signUpError.message.toLowerCase().includes("rate limit")) {
                    setError("Giới hạn đăng ký đã đạt mức tối đa (3-4 người/giờ). Vui lòng thử lại sau 1 giờ hoặc liên hệ admin để cấu hình SMTP.");
                    setCooldown(60);
                } else {
                    setError(signUpError.message);
                }
                setIsLoading(false);
                return;
            }

            // If session exists, confirmation is likely OFF in dashboard
            if (data?.session) {
                setSuccessMessage("Đăng ký thành công! Đang chuyển hướng...");
                setTimeout(() => {
                    router.push("/dashboard");
                }, 1500);
                return;
            }

            setSuccessMessage("Đăng ký thành công! Vui lòng kiểm tra email của bạn để xác thực tài khoản.");
            setCooldown(60);


            // Optionally redirect after a short delay
            setTimeout(() => {
                router.push("/auth/login");
            }, 3000);

        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
                    <span className="material-symbols-outlined text-primary text-3xl">person_add</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Tạo tài khoản
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">Tham gia để bắt đầu quản lý thời gian.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl border border-red-200 dark:border-red-800 text-center">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-bold rounded-xl border border-green-200 dark:border-green-800 text-center">
                        {successMessage}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Họ và tên</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <span className="material-symbols-outlined text-[18px]">badge</span>
                        </span>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl pl-11 pr-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-shadow"
                            placeholder="Nguyễn Văn A"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email</label>
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
                            placeholder="example@email.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Mật khẩu</label>
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
                            minLength={6}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Xác nhận mật khẩu</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <span className="material-symbols-outlined text-[18px]">lock_clock</span>
                        </span>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl pl-11 pr-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-shadow"
                            placeholder="••••••••"
                            minLength={6}
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading || !!successMessage || cooldown > 0}
                        className={`w-full py-3 px-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all ${(isLoading || !!successMessage || cooldown > 0) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-600 hover:-translate-y-0.5'}`}
                    >
                        {isLoading ? 'Đang đăng ký...' : cooldown > 0 ? `Vui lòng đợi ${cooldown}s` : 'Đăng ký'}
                    </button>
                </div>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
                Đã có tài khoản?{" "}
                <Link href="/auth/login" className="font-bold text-primary hover:text-orange-600 transition-colors">
                    Đăng nhập
                </Link>
            </p>
        </div>
    );
}
