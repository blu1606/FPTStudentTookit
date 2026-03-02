"use client";

import { useState } from "react";
import { useAcademic } from "@/contexts/AcademicContext";

type SubjectAddModalProps = {
    onClose: () => void;
    onSuccess?: (subjectId: string) => void;
};

export function SubjectAddModal({ onClose, onSuccess }: SubjectAddModalProps) {
    const { addSubject } = useAcademic();
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !code.trim()) return;

        setIsSubmitting(true);
        const newSubject = await addSubject(name, code);
        setIsSubmitting(false);

        if (newSubject) {
            if (onSuccess) onSuccess(newSubject.id);
            onClose();
        } else {
            alert("Có lỗi xảy ra khi thêm môn học. Vui lòng thử lại.");
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                        Thêm môn học mới
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <span className="material-icons-round">close</span>
                    </button>
                </div>

                {/* Body Form */}
                <div className="p-6">
                    <form id="subject-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Mã môn học <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-shadow"
                                placeholder="VD: SWE201c"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Tên môn học <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-shadow"
                                placeholder="VD: Software Engineering..."
                            />
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end gap-3">
                    <button onClick={onClose} disabled={isSubmitting} className="px-5 py-2 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
                        Hủy
                    </button>
                    <button type="submit" form="subject-form" disabled={isSubmitting} className="px-5 py-2 rounded-xl font-bold text-white bg-primary hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition-transform transform hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0">
                        {isSubmitting ? (
                            <>
                                <span className="material-icons-round text-sm animate-spin">refresh</span> Đang lưu...
                            </>
                        ) : (
                            <>
                                <span className="material-icons-round text-sm">save</span> Lưu
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
