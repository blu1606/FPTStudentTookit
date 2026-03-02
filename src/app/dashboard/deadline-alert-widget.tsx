import { useState, useEffect } from "react";
import { format, isPast, formatDistanceToNow, isToday, isTomorrow } from "date-fns";
import { vi } from "date-fns/locale";
import { useTasks } from "@/contexts/TasksContext";

type DeadlineAlertWidgetProps = {
    onNavigate: (sectionId: string) => void;
};

const formatDeadline = (date: Date): string => {
    if (isToday(date)) {
        return `Hôm nay ${format(date, 'HH:mm')}`;
    }
    if (isTomorrow(date)) {
        return `Mai, ${format(date, 'HH:mm')}`;
    }
    return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
};

const formatTimeLeft = (date: Date): string => {
    if (isPast(date)) {
        return "Quá hạn";
    }
    return formatDistanceToNow(date, { addSuffix: true, locale: vi });
};

export default function DeadlineAlertWidget({ onNavigate }: DeadlineAlertWidgetProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    const { tasks } = useTasks();

    const urgentTasks = tasks.filter(task => task.status !== "Done" && !isPast(task.deadline)).sort((a, b) => a.deadline.getTime() - b.deadline.getTime()).slice(0, 3); // top 3

    if (!isMounted) {
        return <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-danger/20 dark:border-danger/30 mt-6 relative group h-80 flex flex-col justify-center items-center text-gray-400">Loading alerts...</div>;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-danger/20 dark:border-danger/30 overflow-hidden mt-6 relative group h-80 flex flex-col">
            <div className="bg-danger/5 dark:bg-danger/10 p-4 border-b border-danger/10 dark:border-danger/20 flex items-center justify-between">
                <h3 className="text-danger dark:text-danger font-bold flex items-center">
                    <span className="material-symbols-outlined mr-2 animate-pulse">campaign</span>
                    DEADLINE ALERT!
                </h3>
                <span className="bg-white dark:bg-gray-800 text-danger text-xs font-bold px-2 py-1 rounded shadow-sm">{urgentTasks.length} Priority</span>
            </div>
            <div className="p-5 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                {urgentTasks.map(task => (
                    <div key={task.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-danger/10 dark:border-danger/20 relative overflow-hidden group hover:shadow-md transition-all cursor-pointer" onClick={() => onNavigate("assignments")}>
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${task.priority === 'High' ? 'bg-danger' : task.priority === 'Medium' ? 'bg-warning' : 'bg-green-500'}`}></div>
                        <div className="flex justify-between items-start mb-2 pl-2">
                            <h4 className="font-bold text-gray-800 dark:text-white leading-tight pr-2 truncate">{task.title}</h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase whitespace-nowrap ${task.priority === 'High' ? 'text-danger bg-danger/10' : task.priority === 'Medium' ? 'text-warning bg-warning/10' : 'text-green-600 bg-green-500/10'}`}>{task.priority}</span>
                        </div>
                        <div className="pl-2 flex justify-between flex-wrap gap-2 text-xs">
                            <span className="text-gray-500 dark:text-gray-400 font-medium">Hạn: {formatDeadline(task.deadline)}</span>
                            <span className="font-bold text-danger flex items-center">
                                <span className="material-symbols-outlined text-[14px] mr-1">timer</span>
                                {formatTimeLeft(task.deadline)}
                            </span>
                        </div>
                    </div>
                ))}
                {urgentTasks.length === 0 && (
                    <div className="text-center text-gray-400 dark:text-gray-500 py-8 font-medium">
                        Tuyệt vời! Bạn không có deadline gấp nào. 🎉
                    </div>
                )}
            </div>
            <div className="bg-danger/5 dark:bg-gray-800/80 p-3 text-center cursor-pointer hover:bg-danger/10 dark:hover:bg-gray-700 transition-colors rounded-b-3xl border-t border-danger/10" onClick={() => onNavigate("assignments")}>
                <button className="text-sm text-danger dark:text-danger font-bold transition-colors w-full">Xem tất cả deadline</button>
            </div>
        </div>
    );
}
