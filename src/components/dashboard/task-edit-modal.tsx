"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Task } from "@/lib/mock-data";
import { useAcademic } from "@/contexts/AcademicContext";
import { SubjectAddModal } from "./subject-add-modal";

type TaskEditModalProps = {
    task?: Task; // If provided, we are editing. If not, we are adding new.
    onClose: () => void;
    onSave: (task: Partial<Task>) => void;
};

export function TaskEditModal({ task, onClose, onSave }: TaskEditModalProps) {
    const { subjects } = useAcademic();
    const [title, setTitle] = useState(task?.title || "");
    const [subjectId, setSubjectId] = useState(task?.subjectId || (subjects.length > 0 ? subjects[0].id : ""));
    const [priority, setPriority] = useState(task?.priority || "Medium");
    const [status, setStatus] = useState(task?.status || "Todo");
    const [deadlineStr, setDeadlineStr] = useState(task?.deadline ? format(task.deadline, "yyyy-MM-dd'T'HH:mm") : "");
    const [source, setSource] = useState(task?.source || "Tự học");
    const [description, setDescription] = useState(task?.description || "");

    const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: task?.id || `t-${Date.now()}`,
            title,
            subjectId,
            priority: priority as Task["priority"],
            status: status as Task["status"],
            deadline: deadlineStr ? new Date(deadlineStr) : new Date(),
            source: source as Task["source"],
            description,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                        {task ? "Chỉnh sửa công việc" : "Thêm công việc mới"}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <span className="material-icons-round">close</span>
                    </button>
                </div>

                {/* Body Form */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Tên công việc <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-shadow"
                                placeholder="Nhập tên..."
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Môn học</label>
                                <select
                                    value={subjectId}
                                    onChange={e => {
                                        if (e.target.value === "add_new") {
                                            setIsAddSubjectModalOpen(true);
                                        } else {
                                            setSubjectId(e.target.value);
                                        }
                                    }}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-shadow"
                                >
                                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    {subjects.length === 0 && <option value="" disabled>Chưa có môn học nào</option>}
                                    <option value="add_new" className="font-semibold text-primary">
                                        + Thêm môn học mới...
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Trạng thái</label>
                                <select
                                    value={status}
                                    onChange={e => setStatus(e.target.value as Task["status"])}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-shadow"
                                >
                                    <option value="Todo">Chưa bắt đầu</option>
                                    <option value="InProgress">Đang làm</option>
                                    <option value="Done">Hoàn thành</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Độ ưu tiên</label>
                                <select
                                    value={priority}
                                    onChange={e => setPriority(e.target.value as Task["priority"])}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-shadow"
                                >
                                    <option value="High">Cao (High)</option>
                                    <option value="Medium">Trung bình (Medium)</option>
                                    <option value="Low">Thấp (Low)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nguồn</label>
                                <select
                                    value={source}
                                    onChange={e => setSource(e.target.value as Task["source"])}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-shadow"
                                >
                                    <option value="Tự học">Tự học</option>
                                    <option value="Coursera">Coursera</option>
                                    <option value="Edunext">Edunext</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Deadline <span className="text-red-500">*</span></label>
                            <input
                                type="datetime-local"
                                required
                                value={deadlineStr}
                                onChange={e => setDeadlineStr(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-shadow"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Mô tả (Tùy chọn)</label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows={3}
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-shadow custom-scrollbar"
                                placeholder="Ghi chú thêm..."
                            ></textarea>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        Hủy
                    </button>
                    <button type="submit" form="task-form" className="px-5 py-2 rounded-xl font-bold text-white bg-primary hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition-transform transform hover:-translate-y-0.5 flex items-center gap-2">
                        <span className="material-icons-round text-sm">save</span> Lưu
                    </button>
                </div>
            </div>

            {isAddSubjectModalOpen && (
                <SubjectAddModal
                    onClose={() => setIsAddSubjectModalOpen(false)}
                    onSuccess={(newId) => {
                        setSubjectId(newId);
                        setIsAddSubjectModalOpen(false);
                    }}
                />
            )}
        </div>
    );
}
