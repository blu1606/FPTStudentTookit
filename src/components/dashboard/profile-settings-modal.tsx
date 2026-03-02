"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import { useState } from "react";

type ProfileSettingsModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function ProfileSettingsModal({ isOpen, onClose }: ProfileSettingsModalProps) {
    const { user, signOut } = useAuth();
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    const handleSave = () => {
        setIsSaving(true);
        // Simulate save
        setTimeout(() => {
            setIsSaving(false);
            onClose();
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-icons-round text-primary">manage_accounts</span>
                        Cài đặt tài khoản
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <span className="material-icons-round">close</span>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">

                    {/* Profile Section */}
                    <div className="flex items-center bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <Image
                            src={user?.user_metadata?.avatar_url || "https://ui-avatars.com/api/?name=User&background=FF8A00&color=fff"}
                            alt="Profile"
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-full border-2 border-primary object-cover mr-4 shadow-sm"
                        />
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                {user?.user_metadata?.full_name || "Nguyễn Văn A"}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || "student@fpt.edu.vn"}</p>
                            <button className="mt-2 text-xs font-bold text-primary hover:text-orange-600 transition-colors uppercase tracking-wide">
                                Thay đổi ảnh đại diện
                            </button>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Tuỳ chỉnh giao diện</h4>
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                            <div>
                                <p className="font-bold text-gray-800 dark:text-gray-200">Chế độ tối (Dark Mode)</p>
                                <p className="text-xs text-gray-500">Giảm mỏi mắt khi học đêm</p>
                            </div>
                            <ThemeToggle className="theme-toggle" />
                        </div>
                    </div>

                    {/* Notifications */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Thông báo</h4>
                        <div className="space-y-2">
                            <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 cursor-pointer">
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200">Báo trước Deadline 24h</p>
                                    <p className="text-xs text-gray-500">Nhận cảnh báo email khi có deadline khẩn cấp</p>
                                </div>
                                <div className="relative inline-block w-12 h-6 rounded-full bg-primary/20 shadow-inner">
                                    <span className="absolute block w-4 h-4 mt-1 ml-1 rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out bg-primary transform translate-x-6"></span>
                                    <input type="checkbox" className="opacity-0 w-0 h-0" defaultChecked />
                                </div>
                            </label>

                            <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 cursor-pointer">
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200">Nhắc nhở học tập hàng ngày</p>
                                    <p className="text-xs text-gray-500">Nhận thông báo lịch học vào 7h sáng</p>
                                </div>
                                <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 shadow-inner">
                                    <span className="absolute block w-4 h-4 mt-1 ml-1 rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out bg-white"></span>
                                    <input type="checkbox" className="opacity-0 w-0 h-0" />
                                </div>
                            </label>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
                    <button
                        onClick={signOut}
                        className="flex items-center gap-2 text-danger hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-bold transition-colors px-3 py-2 rounded-lg hover:bg-danger/10"
                    >
                        <span className="material-icons-round text-[18px]">logout</span>
                        Đăng xuất
                    </button>

                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-5 py-2 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            Hủy
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`px-5 py-2 rounded-xl font-bold text-white shadow-lg transition-transform transform flex items-center gap-2 ${isSaving ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-orange-600 shadow-primary/30 hover:-translate-y-0.5'}`}
                        >
                            <span className="material-icons-round text-sm">{isSaving ? 'sync' : 'save'}</span>
                            {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
