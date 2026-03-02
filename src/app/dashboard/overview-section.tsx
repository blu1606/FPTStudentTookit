"use client";

import Image from "next/image";
import TodaySchedule from "./today-schedule";
import DeadlineAlertWidget from "./deadline-alert-widget";
import MoodMiniWidget from "./mood-mini-widget";
import ProgressCards from "./progress-cards";
import { useAuth } from "@/contexts/AuthContext";

type OverviewSectionProps = {
    onNavigate: (sectionId: string, action?: string) => void;
};

export default function OverviewSection({ onNavigate }: OverviewSectionProps) {
    const { user } = useAuth();
    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Minh Nhật";

    return (
        <section id="overview" className="dashboard-section fade-in">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-primary to-orange-400 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden mb-8 group">
                <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform translate-x-12 transition-transform duration-700 group-hover:translate-x-6">
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-extrabold mb-2">Xin chào, {displayName}! 👋</h2>
                        <p className="text-orange-50 font-medium text-lg">Hôm nay bạn có <span className="font-bold bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-sm">nhiều</span> nhiệm vụ cần hoàn thành.</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <button onClick={() => onNavigate('planner', 'create_event')} className="bg-white/20 text-white border border-white/50 px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-white hover:text-primary transition-colors flex items-center transform hover:scale-105 active:scale-95 duration-200">
                            <span className="material-symbols-outlined mr-2 text-sm">event</span> Tạo lịch học
                        </button>
                        <button onClick={() => onNavigate('assignments', 'create_task')} className="bg-white text-primary px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-gray-50 transition-colors flex items-center transform hover:scale-105 active:scale-95 duration-200">
                            <span className="material-symbols-outlined mr-2 text-sm">add_task</span> Tạo deadline
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Today's Schedule */}
                    <TodaySchedule />

                    {/* Progress Cards */}
                    <ProgressCards />
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Deadlines */}
                    <DeadlineAlertWidget onNavigate={onNavigate} />

                    {/* Mini Chat */}
                    <MoodMiniWidget onNavigate={onNavigate} />
                </div>
            </div>
        </section>
    );
}
