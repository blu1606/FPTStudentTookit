"use client";

import { useState, useEffect } from "react";
import { LessonType } from "@/lib/mock-data";
import { useAcademic } from "@/contexts/AcademicContext";
import { SubjectAddModal } from "./subject-add-modal";

export type NewLesson = {
    subjectId: string;
    title: string;
    type: LessonType;
    score?: number;
    notes?: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (lesson: NewLesson) => void;
};

const LESSON_TYPES: { value: LessonType; label: string; icon: string }[] = [
    { value: "video", label: "Video bài giảng", icon: "play_circle" },
    { value: "reading", label: "Đọc tài liệu", icon: "menu_book" },
    { value: "exercise", label: "Bài tập", icon: "edit_note" },
    { value: "exam-prep", label: "Ôn thi", icon: "quiz" },
    { value: "project", label: "Dự án", icon: "folder_special" },
];

export function AcademicAddNewLessonModal({ isOpen, onClose, onAdd }: Props) {
    const { subjects } = useAcademic();
    const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
    const [title, setTitle] = useState("");
    const [type, setType] = useState<LessonType>("video");
    const [score, setScore] = useState<string>("");
    const [notes, setNotes] = useState("");

    const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);

    useEffect(() => {
        if (!subjectId && subjects.length > 0) {
            setSubjectId(subjects[0].id);
        }
    }, [subjects, subjectId]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAdd({
            subjectId,
            title: title.trim(),
            type,
            score: score ? Number(score) : undefined,
            notes: notes.trim() || undefined,
        });
        // Reset
        setTitle("");
        setType("video");
        setScore("");
        setNotes("");
        onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div className="w-full sm:max-w-lg bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-icons-round text-blue-500">add_circle</span>
                        Thêm bài học mới
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Đóng"
                    >
                        <span className="material-icons-round">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Subject */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                            Môn học *
                        </label>
                        <select
                            value={subjectId}
                            onChange={(e) => {
                                if (e.target.value === "add_new") {
                                    setIsAddSubjectModalOpen(true);
                                } else {
                                    setSubjectId(e.target.value);
                                }
                            }}
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                        >
                            {subjects.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                            {subjects.length === 0 && <option value="" disabled>Chưa có môn học nào</option>}
                            <option value="add_new" className="font-semibold text-blue-500">
                                + Thêm môn học mới...
                            </option>
                        </select>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                            Tên bài học *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="VD: Chương 4 – Đạo hàm và vi phân..."
                            required
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                        />
                    </div>

                    {/* Lesson Type */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Loại bài học
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {LESSON_TYPES.map((lt) => (
                                <button
                                    key={lt.value}
                                    type="button"
                                    onClick={() => setType(lt.value)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold transition-all
                                        ${type === lt.value
                                            ? "bg-blue-50 dark:bg-blue-900/30 border-blue-400 text-blue-600 dark:text-blue-400"
                                            : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-blue-300"
                                        }`}
                                >
                                    <span className="material-icons-round text-base">{lt.icon}</span>
                                    <span className="truncate">{lt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Score (optional) */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                            Điểm <span className="normal-case font-normal">(0 – 10, tuỳ chọn)</span>
                        </label>
                        <input
                            type="number"
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                            placeholder="VD: 8.5"
                            min={0}
                            max={10}
                            step={0.1}
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                        />
                    </div>

                    {/* Notes (optional) */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                            Ghi chú <span className="normal-case font-normal">(tuỳ chọn)</span>
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Ghi chú thêm về bài học..."
                            rows={2}
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Huỷ
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold shadow-md shadow-blue-500/30 transition-colors"
                        >
                            Thêm bài học
                        </button>
                    </div>
                </form>
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
