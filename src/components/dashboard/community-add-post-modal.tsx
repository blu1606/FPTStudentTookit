"use client";

import { useState } from "react";
import { useCommunity } from "@/contexts/CommunityContext";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function CommunityAddPostModal({ isOpen, onClose }: ModalProps) {
    const { addPost } = useCommunity();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tagsInput, setTagsInput] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || !title.trim()) return;

        const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

        addPost({
            content,
            tags: tags.length > 0 ? tags : ["General"],
        });

        // Reset form
        setTitle("");
        setContent("");
        setTagsInput("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity fade-in">
            <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col slide-up">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                        <span className="material-symbols-outlined text-primary mr-2">edit_document</span>
                        Tạo bài viết mới
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-auto space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                            Tiêu đề <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-sm">short_text</span>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary dark:text-white transition-all shadow-inner"
                                placeholder="VD: Hỏi bài tập ASM Java..."
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                            Nhãn (Tags)
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-sm">sell</span>
                            <input
                                type="text"
                                value={tagsInput}
                                onChange={(e) => setTagsInput(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary dark:text-white transition-all shadow-inner"
                                placeholder="Phân tách bằng dấu phẩy (VD: Java, ASM, Lỗi)"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                            Nội dung <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <textarea
                                required
                                rows={5}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary dark:text-white transition-all resize-none shadow-inner custom-scrollbar"
                                placeholder="Bạn muốn chia sẻ hay hỏi điều gì?..."
                            />
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!title.trim() || !content.trim()}
                        className="px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-orange-600 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span>Đăng bài</span>
                        <span className="material-symbols-outlined text-[18px]">send</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
