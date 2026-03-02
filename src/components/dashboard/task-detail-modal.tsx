"use client";

import { format, isPast, formatDistanceToNow, isToday, isTomorrow } from "date-fns";
import { vi } from "date-fns/locale";
import { Task } from "@/lib/mock-data";

type TaskDetailModalProps = {
    task: Task;
    subjectName: string;
    onClose: () => void;
};

export function TaskDetailModal({ task, subjectName, onClose }: TaskDetailModalProps) {
    const formatDeadline = (date: Date) => {
        if (isToday(date)) return `Hôm nay, ${format(date, "HH:mm")}`;
        if (isTomorrow(date)) return `Ngày mai, ${format(date, "HH:mm")}`;
        return format(date, "dd/MM, HH:mm");
    };

    const formatTimeLeft = (date: Date) => {
        if (task.status === "Done") return "Đã nộp";
        if (isPast(date)) return "Quá hạn";
        return formatDistanceToNow(date, { addSuffix: true, locale: vi }).replace('khoảng ', '');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-2xl">assignment</span>
                        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Chi tiết công việc</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{task.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">school</span> {subjectName}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${task.priority === 'High' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : task.priority === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600' : 'bg-green-100 dark:bg-green-900/30 text-green-600'}`}>
                                <span className="material-symbols-outlined text-[14px]">flag</span> Priority: {task.priority}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${task.status === 'Done' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : task.status === 'InProgress' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                                <span className="material-symbols-outlined text-[14px]">{task.status === 'Done' ? 'check_circle' : task.status === 'InProgress' ? 'pending' : 'radio_button_unchecked'}</span>
                                Status: {task.status === 'Todo' ? 'Chưa bắt đầu' : task.status === 'InProgress' ? 'Đang làm' : 'Hoàn thành'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">event</span> Deadline
                            </h4>
                            <p className="font-semibold text-gray-900 dark:text-white">{formatDeadline(task.deadline)}</p>
                            <p className={`text-sm font-bold mt-1 ${isPast(task.deadline) && task.status !== "Done" ? 'text-danger' : 'text-primary'}`}>{formatTimeLeft(task.deadline)}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">source</span> Nguồn
                            </h4>
                            <p className="font-semibold text-gray-900 dark:text-white">{task.source}</p>
                        </div>
                    </div>

                    {task.description && (
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">description</span> Mô tả
                            </h4>
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                {task.description}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        Đóng
                    </button>
                    <button className="px-5 py-2 rounded-xl font-bold text-white bg-primary hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition-transform transform hover:-translate-y-0.5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">edit</span> Sửa
                    </button>
                </div>
            </div>
        </div>
    );
}
