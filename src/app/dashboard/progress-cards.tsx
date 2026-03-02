"use client";

import { useAcademic } from "@/contexts/AcademicContext";
import { useTasks } from "@/contexts/TasksContext";
import { useMemo } from "react";

export default function ProgressCards() {
    const { subjects } = useAcademic();
    const { tasks } = useTasks();

    const stats = useMemo(() => {
        // Calculate average progress (GPA)
        let averageProgress = 0;
        if (subjects.length > 0) {
            averageProgress = subjects.reduce((acc, sub) => acc + sub.progress, 0) / subjects.length;
        }
        const gpaValue = (averageProgress / 10).toFixed(1);
        const gpaClass = averageProgress >= 80 ? "Giỏi" : averageProgress >= 65 ? "Khá" : averageProgress > 0 ? "Trung bình" : "Chưa có";

        // Calculate Task Completion percentage
        let completionRate = 0;
        if (tasks.length > 0) {
            const completed = tasks.filter(t => t.status === "Done").length;
            completionRate = Math.round((completed / tasks.length) * 100);
        }

        return { averageProgress, gpaValue, gpaClass, completionRate };
    }, [subjects, tasks]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                    <span className="w-2 h-6 bg-info rounded-full mr-3"></span>
                    Tiến độ học tập
                </h3>
                <button className="text-primary text-sm font-bold hover:underline transition-all">Chi tiết</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 flex items-center space-x-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm border-4 border-green-400 relative">
                        <svg className="absolute inset-0 w-full h-full -rotate-90 text-green-100 dark:text-green-900" viewBox="0 0 36 36">
                            <path className="text-gray-200 dark:text-gray-600" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" />
                            <path className="text-green-400" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${stats.averageProgress || 0}, 100`} strokeWidth="2" />
                        </svg>
                        <span className="text-xl font-bold text-gray-800 dark:text-white z-10">{stats.gpaValue}</span>
                    </div>
                    <div>
                        <h4 className="text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase">Hiệu suất</h4>
                        <p className="text-lg font-bold text-gray-800 dark:text-white">{stats.gpaClass}</p>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 flex items-center space-x-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm border-4 border-primary relative">
                        <svg className="absolute inset-0 w-full h-full -rotate-90 text-primary/20" viewBox="0 0 36 36">
                            <path className="text-gray-200 dark:text-gray-600" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" />
                            <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${stats.completionRate}, 100`} strokeWidth="2" />
                        </svg>
                        <span className="text-xl font-bold text-gray-800 dark:text-white z-10">{stats.completionRate}%</span>
                    </div>
                    <div>
                        <h4 className="text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase">Bài tập nộp</h4>
                        <p className="text-lg font-bold text-gray-800 dark:text-white">{stats.completionRate === 100 ? "Tuyệt vời" : stats.completionRate >= 50 ? "Khá tốt" : "Cần cố gắng"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
