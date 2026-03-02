"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import PlannerSection from "./planner-section";
import dynamic from "next/dynamic";
const AssignmentsSection = dynamic(() => import("./assignments-section"), { ssr: false });
import MoodSection from "./mood-section";
import AcademicSection from "./academic-section";
import OverviewSection from "./overview-section";
import UserProfileCard from "./user-profile-card";
import ProfileSettingsModal from "@/components/dashboard/profile-settings-modal";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [activeSection, setActiveSection] = useState("overview");
    const [pendingAction, setPendingAction] = useState<string | null>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/auth/login");
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        // Initial mobile overlay logic can still exist if needed
        const mobileMenuBtn = document.getElementById("mobile-menu-btn");
        const mobileOverlay = document.getElementById("mobile-overlay");
        // const sidebar = document.querySelector("aside"); // Can use a ref instead

        const setupMobileMenu = () => {
            // simplified for react
        }
        setupMobileMenu();
    }, []);

    // Show nothing while checking auth or if not logged in
    if (isLoading || !user) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-bold">Đang xác thực...</p>
                </div>
            </div>
        );
    }

    const handleNavClick = (sectionId: string, action?: string) => {
        setActiveSection(sectionId);
        setPendingAction(action || null);
    };

    const navItems = [
        { id: "overview", icon: "dashboard", label: "Tổng quan" },
        { id: "planner", icon: "calendar_month", label: "Kế hoạch Planner" },
        { id: "assignments", icon: "assignment", label: "Deadline & Bài tập" },
        { id: "mood", icon: "mood", label: "Theo dõi cảm xúc" },
        { id: "academic", icon: "school", label: "Học tập & Tiến độ" },
    ];

    return (
        <div className="bg-gray-50 dark:bg-gray-900 font-display text-text-light dark:text-text-dark transition-colors duration-200 antialiased h-screen overflow-hidden flex">
            {/* Mobile Overlay */}
            <div id="mobile-overlay" className="fixed inset-0 bg-black/50 z-20 hidden md:hidden glass"></div>

            {/* Sidebar */}
            <aside className="w-72 bg-white dark:bg-gray-800 shadow-xl flex flex-col z-30 fixed inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition-transform duration-300 border-r border-gray-200 dark:border-gray-700">
                <Link href="/" className="p-6 flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Image src="/logo.png" alt="Logo" width={40} height={40} className="w-10 h-10 object-contain" />
                    <div className="flex flex-col">
                        <span className="font-bold text-lg leading-tight text-gray-800 dark:text-white">Smart Time Management</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">FPT University</span>
                    </div>
                </Link>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all duration-200 group ${activeSection === item.id
                                ? "bg-primary text-white shadow-md shadow-primary/30 transform scale-105"
                                : "text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary"
                                }`}
                            onClick={() => handleNavClick(item.id)}
                        >
                            <span className={`material-icons-round mr-3 transition-transform duration-200 ${activeSection === item.id ? "scale-110" : "group-hover:scale-110"}`}>
                                {item.icon}
                            </span>
                            <span className="font-bold">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <UserProfileCard
                    userName={user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Nguyễn Minh Nhật"}
                    studentId={user?.user_metadata?.student_id || "SS171234"}
                    avatarUrl={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Minh Nhat')}&background=FF8A00&color=fff`}
                    onSettingsClick={() => setIsProfileModalOpen(true)}
                />
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50 dark:bg-gray-900 relative">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 z-10 glass sticky top-0">
                    <div className="flex items-center">
                        <button id="mobile-menu-btn" className="md:hidden mr-4 text-gray-500 hover:text-primary transition-colors">
                            <span className="material-icons-round">menu</span>
                        </button>
                        <h1 id="page-title" className="text-xl font-extrabold text-gray-800 dark:text-white flex items-center">
                            {activeSection === "overview" && "Dashboard"}
                            {activeSection === "planner" && "Lịch học tập"}
                            {activeSection === "assignments" && "Deadline & Assignment"}
                            {activeSection === "mood" && "Trợ lý cảm xúc"}
                            {activeSection === "academic" && "Tiến độ & Cộng đồng"}
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="relative p-2 text-gray-400 hover:text-primary transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                            <span className="material-icons-round">notifications</span>
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-danger rounded-full border-2 border-surface-light dark:border-surface-dark animate-pulse"></span>
                        </button>
                        <ThemeToggle className="theme-toggle p-2 text-gray-400 hover:text-warning transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" />
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto space-y-6">

                        {/* 1. Dashboard Overview */}
                        {activeSection === "overview" && <OverviewSection onNavigate={handleNavClick} />}

                        {activeSection === "planner" && <PlannerSection pendingAction={pendingAction} clearAction={() => setPendingAction(null)} />}
                        {activeSection === "assignments" && <AssignmentsSection pendingAction={pendingAction} clearAction={() => setPendingAction(null)} />}
                        {activeSection === "mood" && <MoodSection />}
                        {activeSection === "academic" && <AcademicSection />}

                    </div>
                </div>
            </main>

            {/* Modals */}
            <ProfileSettingsModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </div>
    );
}
