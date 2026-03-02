import { useState, useEffect } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { format, isPast, formatDistanceToNow, isToday, isTomorrow } from "date-fns";
import { vi } from "date-fns/locale";
import { Task, Subject } from "@/lib/mock-data";

type TaskCardProps = {
    task: Task;
    subject: Subject;
    index: number;
    onClick?: () => void;
};

export function TaskCard({ task, subject, index, onClick }: TaskCardProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const isUrgent = task.isUrgent || (task.deadline && task.deadline.getTime() - new Date().getTime() < 24 * 60 * 60 * 1000 && !isPast(task.deadline));
    const isOverdue = isPast(task.deadline) && task.status !== "Done";

    const formatDeadline = (date: Date) => {
        if (isToday(date)) return `Hôm nay, ${format(date, "HH:mm")}`;
        if (isTomorrow(date)) return `Ngày mai, ${format(date, "HH:mm")}`;
        return format(date, "dd/MM, HH:mm");
    };

    const formatTimeLeft = (date: Date) => {
        if (task.status === "Done") return "Đã nộp";
        if (isOverdue) return "Quá hạn";
        return formatDistanceToNow(date, { addSuffix: true, locale: vi }).replace('khoảng ', '');
    };

    const isPriorityHigh = task.priority === "High";
    const isPriorityMedium = task.priority === "Medium";

    // Dynamic styles based on priority and status
    const borderClass = isPriorityHigh ? "border-red-500" : isPriorityMedium ? "border-yellow-400" : "border-gray-200 dark:border-gray-700/50";
    const shadowClass = isPriorityHigh && task.status === "InProgress" ? "shadow-md shadow-red-100 dark:shadow-none hover:shadow-xl" : "shadow-sm hover:shadow-lg";

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={onClick}
                    style={provided.draggableProps.style}
                    className={`bg-white dark:bg-gray-800 p-4 rounded-xl border-l-4 ${borderClass} cursor-grab active:cursor-grabbing group relative overflow-hidden ${task.status === "Done" ? "opacity-75 hover:opacity-100" : ""} ${snapshot.isDragging ? "shadow-2xl z-50 ring-2 ring-primary/50 opacity-90" : `transition-all hover:shadow-lg hover:-translate-y-1 ${shadowClass}`}`}
                >

                    {/* Urgent glow effect for high priority in-progress tasks */}
                    {isPriorityHigh && task.status === "InProgress" && (
                        <div className="absolute right-0 top-0 w-16 h-16 bg-red-50 dark:bg-red-900/10 rounded-bl-full -z-0"></div>
                    )}

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                {task.status === "Done" ? (
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-400 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-lg">check_circle</span>
                                    </div>
                                ) : (
                                    <div className={`w-8 h-8 rounded-lg ${subject.bg} ${subject.text} flex items-center justify-center`}>
                                        <span className="material-symbols-outlined text-lg">{subject.icon}</span>
                                    </div>

                                )}
                                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {subject.name}
                                </span>
                            </div>

                            {/* Right corner indicators */}
                            {task.status === "Done" ? (
                                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-sm">done</span>
                                </div>
                            ) : isPriorityHigh ? (
                                <div className="bg-red-100 dark:bg-red-900/40 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded">CAO</div>
                            ) : (
                                <button className="text-gray-300 hover:text-gray-500"><span className="material-symbols-outlined text-lg">more_horiz</span></button>
                            )}
                        </div>

                        <h4 className={`font-bold text-gray-800 dark:text-white mb-3 text-sm leading-snug transition-colors ${task.status === "Done" ? "text-gray-600 dark:text-gray-400 line-through" : isPriorityHigh && task.status === "InProgress" ? "group-hover:text-red-600" : "group-hover:text-primary"}`}>
                            {task.title}
                        </h4>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 dark:border-gray-700">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400 font-semibold uppercase">{task.status === "Done" ? "Submitted" : "Deadline"}</span>
                                <span className={`text-xs font-bold ${isPriorityHigh && task.status === "InProgress" ? "text-red-600" : "text-gray-600 dark:text-gray-400"}`}>
                                    {isMounted ? (task.status === "Done" ? task.submittedOn : formatDeadline(task.deadline)) : "..."}
                                </span>
                            </div>

                            {task.status === "Done" ? (
                                <div className="bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded text-right">
                                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Done</span>
                                </div>
                            ) : (
                                <div className={`${isPriorityHigh && task.status === "InProgress" ? "bg-red-50 dark:bg-red-900/20" : "bg-gray-100 dark:bg-gray-700"} px-2 py-1 rounded text-right`}>
                                    <span className={`block text-[9px] ${isPriorityHigh && task.status === "InProgress" ? "text-red-600/70" : "text-gray-400"} font-bold uppercase`}>
                                        {isPriorityHigh && task.status === "InProgress" ? "GẤP" : "Time left"}
                                    </span>
                                    <span className={`text-sm font-bold ${isPriorityHigh && task.status === "InProgress" ? "text-red-600 font-black animate-pulse" : "text-gray-600 dark:text-gray-300"} font-mono`}>
                                        {isMounted ? formatTimeLeft(task.deadline) : "..."}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}
