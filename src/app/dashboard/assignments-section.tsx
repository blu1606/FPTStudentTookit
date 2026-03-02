"use client";

import { useState, useEffect, useMemo } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { format, isPast, formatDistanceToNow, isToday, isTomorrow } from "date-fns";
import { vi } from "date-fns/locale";
import { Task } from "@/lib/mock-data";
import { useTasks } from "@/contexts/TasksContext";
import { useAcademic } from "@/contexts/AcademicContext";
import { KanbanColumn } from "@/components/dashboard/kanban-column";
import { TaskCard } from "@/components/dashboard/task-card";
import { TaskDetailModal } from "@/components/dashboard/task-detail-modal";
import { TaskEditModal } from "@/components/dashboard/task-edit-modal";

type AssignmentsSectionProps = {
    pendingAction?: string | null;
    clearAction?: () => void;
};

export default function AssignmentsSection({ pendingAction, clearAction }: AssignmentsSectionProps = {}) {
    const [view, setView] = useState<"kanban" | "list">("kanban");
    const { tasks, setTasks } = useTasks();
    const { subjects } = useAcademic();
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [selectedPriorities, setSelectedPriorities] = useState<string[]>(["High", "Medium", "Low"]);
    const [isMounted, setIsMounted] = useState(false);

    // Modal states
    const [selectedDetailTask, setSelectedDetailTask] = useState<Task | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (pendingAction === 'create_task') {
            setEditingTask(undefined);
            setIsEditModalOpen(true);
            clearAction?.();
        }
    }, [pendingAction, clearAction]);

    // Filter logic
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchesSubject = selectedSubjects.length === 0 || selectedSubjects.includes(task.subjectId);
            const matchesPriority = selectedPriorities.includes(task.priority);
            return matchesSubject && matchesPriority;
        });
    }, [tasks, selectedSubjects, selectedPriorities]);

    // Filter tasks by status for Kanban view (using filteredTasks)
    const todoTasks = filteredTasks.filter(t => t.status === "Todo");
    const inProgressTasks = filteredTasks.filter(t => t.status === "InProgress");
    const doneTasks = filteredTasks.filter(t => t.status === "Done");

    const toggleSubject = (subjectId: string) => {
        setSelectedSubjects(prev =>
            prev.includes(subjectId) ? prev.filter(id => id !== subjectId) : [...prev, subjectId]
        );
    };

    const togglePriority = (priority: string) => {
        setSelectedPriorities(prev =>
            prev.includes(priority) ? prev.filter(p => p !== priority) : [...prev, priority]
        );
    };

    const resetFilters = () => {
        setSelectedSubjects([]);
        setSelectedPriorities(["High", "Medium", "Low"]);
    };

    const handleDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        setTasks(prev => {
            const newTasks = [...prev];
            const taskIndex = newTasks.findIndex(t => t.id === draggableId);
            if (taskIndex !== -1) {
                newTasks[taskIndex].status = destination.droppableId as Task["status"];
            }
            return newTasks;
        });
    };

    const handleSaveTask = (updatedData: Partial<Task>) => {
        setTasks(prev => {
            const exists = prev.some(t => t.id === updatedData.id);
            if (exists) {
                return prev.map(t => t.id === updatedData.id ? { ...t, ...updatedData } as Task : t);
            }
            return [...prev, updatedData as Task];
        });
        setIsEditModalOpen(false);
    };

    const formatDeadline = (date: Date) => {
        if (isToday(date)) return `Hôm nay, ${format(date, "HH:mm")}`;
        if (isTomorrow(date)) return `Ngày mai, ${format(date, "HH:mm")}`;
        return format(date, "dd/MM, HH:mm");
    };

    const formatTimeLeft = (task: Task) => {
        if (task.status === "Done") return "Đã nộp";
        if (isPast(task.deadline)) return "Quá hạn";
        return formatDistanceToNow(task.deadline, { addSuffix: true, locale: vi }).replace('khoảng ', '');
    };

    if (!isMounted) return null;

    return (
        <section id="assignments" className="dashboard-section flex flex-col h-[calc(100vh-8rem)] fade-in">
            {/* Header */}
            <div className="flex-shrink-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-10 border-b border-orange-100 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-3xl">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white flex items-center gap-2">
                        <span className="material-icons-round text-primary text-3xl">view_kanban</span>
                        Deadline Board
                    </h2>
                </div>
                <div className="flex items-center gap-4">
                    <div id="deadline-view-toggle" className="hidden sm:flex bg-gray-100 dark:bg-gray-700/50 p-1 rounded-xl border border-gray-200 dark:border-gray-600">
                        <button
                            onClick={() => setView("list")}
                            className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-all ${view === "list" ? "bg-white dark:bg-gray-600 text-primary dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"}`}>
                            <span className="material-icons-round text-lg">format_list_bulleted</span>
                            List
                        </button>
                        <button
                            onClick={() => setView("kanban")}
                            className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-all ${view === "kanban" ? "bg-white dark:bg-gray-600 text-primary dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"}`}>
                            <span className="material-icons-round text-lg">view_kanban</span>
                            Kanban
                        </button>
                    </div>
                    <div className="relative hidden lg:block">
                        <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        <input className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary w-64 text-gray-700 dark:text-gray-200 placeholder-gray-400" placeholder="Search tasks..." type="text" />
                    </div>
                    <button
                        onClick={() => { setEditingTask(undefined); setIsEditModalOpen(true); }}
                        className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-orange-500/30 flex items-center transition-all transform hover:-translate-y-0.5">
                        <span className="material-icons-round mr-2">add</span> New Task
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Filter Sidebar */}
                <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col hidden xl:flex overflow-y-auto z-0 rounded-bl-3xl">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <span className="material-icons-round text-primary">tune</span> Filters
                            </h3>
                            <button onClick={resetFilters} className="text-xs font-bold text-gray-400 hover:text-primary">Reset</button>
                        </div>
                    </div>
                    <div className="p-6 space-y-8">
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <span className="material-icons-round text-sm">school</span> Subject
                            </h4>
                            <div className="space-y-3">
                                {subjects.map((subject) => {
                                    const subjectTaskCount = tasks.filter(t => t.subjectId === subject.id).length;
                                    return (
                                        <label key={subject.id} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                checked={selectedSubjects.length === 0 || selectedSubjects.includes(subject.id)}
                                                onChange={() => toggleSubject(subject.id)}
                                                className="w-4 h-4 rounded text-primary focus:ring-primary border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                                                type="checkbox"
                                            />
                                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors">{subject.name}</span>
                                            <span className="ml-auto text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-400 px-2 py-0.5 rounded-md">{subjectTaskCount}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <span className="material-icons-round text-sm">flag</span> Priority
                            </h4>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        checked={selectedPriorities.includes("High")}
                                        onChange={() => togglePriority("High")}
                                        className="w-4 h-4 rounded text-red-500 focus:ring-red-500 border-gray-300 dark:border-gray-600 dark:bg-gray-800" type="checkbox" />
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Cao (High)</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        checked={selectedPriorities.includes("Medium")}
                                        onChange={() => togglePriority("Medium")}
                                        className="w-4 h-4 rounded text-yellow-500 focus:ring-yellow-500 border-gray-300 dark:border-gray-600 dark:bg-gray-800" type="checkbox" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Trung bình (Med)</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        checked={selectedPriorities.includes("Low")}
                                        onChange={() => togglePriority("Low")}
                                        className="w-4 h-4 rounded text-green-500 focus:ring-green-500 border-gray-300 dark:border-gray-600 dark:bg-gray-800" type="checkbox" />
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Thấp (Low)</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Board Area */}
                <div className="flex-1 overflow-x-auto overflow-y-hidden bg-gray-100 dark:bg-gray-900 p-4 md:p-6 lg:p-8 flex flex-col min-h-0">
                    {/* KANBAN VIEW */}
                    {view === "kanban" && (
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <div id="deadline-kanban-view" className="flex-1 min-h-0 min-w-[1000px] grid grid-cols-3 gap-6 lg:gap-8 overflow-hidden">
                                {/* Column 1: Todo */}
                                <KanbanColumn
                                    id="Todo"
                                    title="Chưa bắt đầu"
                                    count={todoTasks.length}
                                    colorIndicatorClass="bg-gray-400"
                                    headerTextColorClass="text-gray-600 dark:text-gray-200"
                                    badgeTextColorClass="text-gray-600 dark:text-gray-300"
                                    onAdd={() => { setEditingTask(undefined); setIsEditModalOpen(true); }}
                                >
                                    {todoTasks.map((task, index) => (
                                        <TaskCard key={task.id} task={task} index={index} subject={subjects.find(s => s.id === task.subjectId) || { id: task.subjectId, name: 'Loading...', progress: 0, colorClass: '', bgColorClass: '', icon: 'book', count: 0 }} onClick={() => setSelectedDetailTask(task)} />
                                    ))}
                                </KanbanColumn>

                                {/* Column 2: In Progress */}
                                <KanbanColumn
                                    id="InProgress"
                                    title="Đang làm"
                                    count={inProgressTasks.length}
                                    colorIndicatorClass="bg-primary"
                                    pulse
                                    headerTextColorClass="text-gray-700 dark:text-white"
                                    badgeTextColorClass="text-primary dark:text-primary"
                                    onAdd={() => { setEditingTask(undefined); setIsEditModalOpen(true); }}
                                >
                                    {inProgressTasks.map((task, index) => (
                                        <TaskCard key={task.id} task={task} index={index} subject={subjects.find(s => s.id === task.subjectId) || { id: task.subjectId, name: 'Loading...', progress: 0, colorClass: '', bgColorClass: '', icon: 'book', count: 0 }} onClick={() => setSelectedDetailTask(task)} />
                                    ))}
                                </KanbanColumn>

                                {/* Column 3: Done */}
                                <KanbanColumn
                                    id="Done"
                                    title="Hoàn thành"
                                    count={doneTasks.length}
                                    colorIndicatorClass="bg-green-500"
                                    headerTextColorClass="text-gray-600 dark:text-gray-200"
                                    badgeTextColorClass="text-green-600 dark:text-green-400"
                                    onAdd={() => { setEditingTask(undefined); setIsEditModalOpen(true); }}
                                >
                                    {doneTasks.map((task, index) => (
                                        <TaskCard key={task.id} task={task} index={index} subject={subjects.find(s => s.id === task.subjectId) || { id: task.subjectId, name: 'Loading...', progress: 0, colorClass: '', bgColorClass: '', icon: 'book', count: 0 }} onClick={() => setSelectedDetailTask(task)} />
                                    ))}
                                </KanbanColumn>
                            </div>
                        </DragDropContext>
                    )}

                    {/* LIST VIEW */}
                    {view === "list" && (
                        <div id="deadline-list-view" className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden h-full flex flex-col shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left whitespace-nowrap">
                                    <thead className="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700/80">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tên công việc</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Môn học</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Deadline</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ưu tiên</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/80">
                                        {filteredTasks.map(task => {
                                            const subject = subjects.find(s => s.id === task.subjectId) || { id: task.subjectId, name: 'Loading...', progress: 0, colorClass: '', bgColorClass: '', icon: 'book', count: 0 };
                                            return (
                                                <tr key={task.id} onClick={() => setSelectedDetailTask(task)} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 cursor-pointer transition-colors">
                                                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white max-w-[300px] truncate">{task.title}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                                                            <span className="material-icons-round text-[14px]">{subject.icon}</span> {subject.name}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`text-sm font-bold ${task.status === "Done" ? "text-gray-400" : "text-gray-900 dark:text-gray-200"}`}>{formatDeadline(task.deadline)}</span>
                                                        {task.status !== "Done" && <span className={`block text-xs mt-1 font-semibold ${isPast(task.deadline) ? 'text-danger' : 'text-primary'}`}>{formatTimeLeft(task)}</span>}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${task.priority === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30' : 'bg-green-100 text-green-600 dark:bg-green-900/30'}`}>
                                                            {task.priority}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${task.status === 'Done' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : task.status === 'InProgress' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                                                            {task.status === 'Todo' ? 'Chưa bắt đầu' : task.status === 'InProgress' ? 'Đang làm' : 'Hoàn thành'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {filteredTasks.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-semibold">
                                                    Không tìm thấy công việc nào khớp với bộ lọc.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {selectedDetailTask && (
                <TaskDetailModal
                    task={selectedDetailTask}
                    subjectName={subjects.find(s => s.id === selectedDetailTask.subjectId)?.name || "Loading..."}
                    onClose={() => setSelectedDetailTask(null)}
                />
            )}

            {isEditModalOpen && (
                <TaskEditModal
                    task={editingTask}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSaveTask}
                />
            )}
        </section>
    );
}
