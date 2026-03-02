"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { StatCard } from "@/components/dashboard/stat-card";
import { AcademicAddNewLessonModal } from "@/components/dashboard/academic-add-new-lesson-modal";
import { SubjectAddModal } from "@/components/dashboard/subject-add-modal";
import { CommunityAddPostModal } from "@/components/dashboard/community-add-post-modal";
import { useAcademic } from "@/contexts/AcademicContext";
import { useTasks } from "@/contexts/TasksContext";
import { useCommunity } from "@/contexts/CommunityContext";

export default function AcademicSection() {
    const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
    const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
    const [isAddPostOpen, setIsAddPostOpen] = useState(false);
    const { subjects, addLesson } = useAcademic();
    const { tasks } = useTasks();
    const { posts, addComment } = useCommunity();
    const [expandedPostIds, setExpandedPostIds] = useState<Record<string, boolean>>({});
    const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});

    const toggleComments = (postId: string) => {
        setExpandedPostIds(prev => ({ ...prev, [postId]: !prev[postId] }));
    };

    const handleAddComment = (postId: string) => {
        const text = commentTexts[postId]?.trim();
        if (text) {
            addComment(postId, text);
            setCommentTexts(prev => ({ ...prev, [postId]: "" }));
            if (!expandedPostIds[postId]) {
                setExpandedPostIds(prev => ({ ...prev, [postId]: true }));
            }
        }
    };

    const stats = useMemo(() => {
        let averageProgress = 0;
        if (subjects.length > 0) {
            averageProgress = Math.round(subjects.reduce((acc, sub) => acc + sub.progress, 0) / subjects.length);
        }

        const gpaValue = (averageProgress / 10).toFixed(1);

        let completedTasks = 0;
        if (tasks.length > 0) {
            completedTasks = tasks.filter(t => t.status === "Done").length;
        }

        return {
            averageProgress,
            items: [
                { title: "GPA Hiện tại", value: gpaValue, bottomText: "Hệ số 10", ringColorClass: "border-primary" },
                { title: "Môn học", value: subjects.length.toString(), bottomText: "Đang học", ringColorClass: "border-blue-500" },
                { title: "Bài tập nộp", value: completedTasks.toString(), bottomText: `Trên tổng ${tasks.length}`, ringColorClass: "border-purple-500" },
                { title: "Mục tiêu", value: averageProgress >= 80 ? "Giỏi" : "Khá", bottomText: "Tiếp tục cố gắng", ringColorClass: "border-green-500" },
            ]
        };
    }, [subjects, tasks]);

    return (
        <>
            <section id="academic" className="dashboard-section fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Tiến độ & Cộng đồng</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Theo dõi GPA và kết nối với sinh viên FPT</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Column: Academic Progress */}
                    <div className="xl:col-span-1 space-y-8">
                        {/* Overall Progress */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center relative z-10">
                                <span className="material-symbols-outlined text-primary mr-2">school</span> Tiến độ học kỳ
                            </h3>
                            <div className="flex justify-center mb-6 relative z-10">
                                <div className="w-40 h-40 relative flex items-center justify-center group cursor-pointer">
                                    <svg className="w-full h-full transform -rotate-90 drop-shadow-md" viewBox="0 0 36 36">
                                        <path className="text-gray-100 dark:text-gray-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                        <path className="text-primary transition-all duration-1000 ease-out" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${stats.averageProgress}, 100`} strokeWidth="3" strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute text-center transform group-hover:scale-110 transition-transform">
                                        <span className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{stats.averageProgress}<span className="text-xl text-gray-400 font-bold">%</span></span>
                                        <p className="text-xs font-bold uppercase text-primary mt-1 tracking-wider">Hoàn thành</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                {stats.items.map((stat, i) => (
                                    <StatCard
                                        key={i}
                                        title={stat.title}
                                        value={stat.value}
                                        bottomText={stat.bottomText || ""}
                                        ringColorClass={stat.ringColorClass}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Subject Breakdown */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
                                <span className="flex items-center"><span className="material-symbols-outlined text-blue-500 mr-2">analytics</span> Điểm thành phần</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsAddSubjectOpen(true)}
                                        className="flex items-center gap-1 text-xs font-bold text-primary hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 px-2 py-1 rounded-lg transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">add</span>
                                        Thêm môn
                                    </button>
                                    <button
                                        onClick={() => setIsAddLessonOpen(true)}
                                        className="flex items-center gap-1 text-xs font-bold text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded-lg transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">add</span>
                                        Thêm bài
                                    </button>
                                </div>
                            </h3>
                            <div className="space-y-5">
                                {subjects.length === 0 ? (
                                    <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">menu_book</span>
                                        <p className="text-sm font-semibold">Chưa có môn học nào</p>
                                        <p className="text-xs mt-1 mb-4">Thêm môn học để theo dõi tiến độ</p>
                                        <button
                                            onClick={() => setIsAddSubjectOpen(true)}
                                            className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md transition-colors"
                                        >
                                            + Tạo môn học đầu tiên
                                        </button>
                                    </div>
                                ) : (
                                    subjects.map((subject) => (
                                        <div key={subject.id} className="group cursor-pointer">
                                            <div className="flex justify-between text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                                <span>{subject.name}</span>
                                                <span className={`${subject.text} font-extrabold flex items-center bg-transparent px-0`}><span className="material-symbols-outlined text-[10px] mr-1">{subject.progress >= 80 ? 'arrow_upward' : 'remove'}</span> {subject.progress / 10}</span>

                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`${subject.bg} h-2 rounded-full transition-all duration-700 ease-out`}

                                                    style={{ width: `${subject.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Trending Topics */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                <span className="material-symbols-outlined text-primary mr-2">local_fire_department</span> Trending
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300 cursor-pointer transition-colors">#JavaSpring</span>
                                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300 cursor-pointer transition-colors">#Calculus</span>
                                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300 cursor-pointer transition-colors">#ExamPrep</span>
                                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300 cursor-pointer transition-colors">#Internship</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Community Feed */}
                    <div className="xl:col-span-2 flex flex-col h-full">
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center">
                                    <span className="material-symbols-outlined text-orange-500 mr-2">forum</span> Cộng đồng học tập
                                </h3>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <div className="relative flex-1 sm:w-48">
                                        <input type="text" placeholder="Tìm chủ đề..." className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl py-2 pl-3 pr-8 text-sm focus:ring-2 focus:ring-primary dark:text-white" />
                                        <span className="material-symbols-outlined absolute right-2 top-2 text-gray-400 text-sm">search</span>
                                    </div>
                                    <button
                                        onClick={() => setIsAddPostOpen(true)}
                                        className="bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded-xl font-bold text-sm shadow-md transition-colors whitespace-nowrap"
                                    >
                                        + Bài mới
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                                {posts.length === 0 ? (
                                    <div className="text-center py-10 text-gray-500">
                                        <span className="material-symbols-outlined text-4xl mb-2 opacity-30">forum</span>
                                        <p>Chưa có bài viết nào.</p>
                                    </div>
                                ) : (
                                    posts.map(post => (
                                        <div key={post.id} className="border-b border-gray-100 dark:border-gray-700 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                                            <div className="flex items-start gap-4">
                                                <Image src={post.authorAvatar} alt={post.authorName} width={48} height={48} className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700 shadow-sm" unoptimized />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-bold text-gray-900 dark:text-white text-lg">{post.content.split('\n')[0].substring(0, 50)}{post.content.length > 50 ? '...' : ''}</h4>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-0.5">
                                                                {post.authorName} • {post.timePosted}
                                                                {post.tags.map(tag => (
                                                                    <span key={tag} className="ml-1.5 inline-block text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded before:content-['•'] before:mr-1.5 before:text-gray-400">
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </p>
                                                        </div>
                                                        <button className="text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined">more_horiz</span></button>
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-300 mt-3 text-sm leading-relaxed whitespace-pre-wrap">
                                                        {post.content}
                                                    </p>

                                                    {post.id === "post-1" && (
                                                        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-2">
                                                            <Image src="https://via.placeholder.com/150x100?text=Error.png" alt="Error snippet" width={150} height={100} className="h-20 w-auto rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-80 transition-opacity" unoptimized />
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-6 mt-4">
                                                        <button className="flex items-center text-gray-500 hover:text-primary transition-colors text-sm font-semibold group">
                                                            <span className="material-symbols-outlined mr-1 group-hover:scale-110 transition-transform">thumb_up_off_alt</span> {post.likes}
                                                        </button>
                                                        <button
                                                            onClick={() => toggleComments(post.id)}
                                                            className="flex items-center text-gray-500 hover:text-blue-500 transition-colors text-sm font-semibold group"
                                                        >
                                                            <span className="material-symbols-outlined mr-1 group-hover:scale-110 transition-transform">chat_bubble_outline</span> {post.comments.length} Bình luận
                                                        </button>
                                                        <button className="flex items-center text-gray-500 hover:text-gray-700 transition-colors text-sm font-semibold ml-auto">
                                                            <span className="material-symbols-outlined mr-1">share</span> Chia sẻ
                                                        </button>
                                                    </div>

                                                    {/* Comments Section */}
                                                    {expandedPostIds[post.id] && (
                                                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-4">
                                                            {post.comments.length > 0 ? (
                                                                post.comments.map(comment => (
                                                                    <div key={comment.id} className="flex gap-3">
                                                                        <Image src={comment.authorAvatar} alt={comment.authorName} width={32} height={32} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700" unoptimized />
                                                                        <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                                                                            <div className="flex justify-between items-baseline mb-1">
                                                                                <span className="font-bold text-sm text-gray-900 dark:text-white">{comment.authorName}</span>
                                                                                <span className="text-xs text-gray-500">{comment.timePosted}</span>
                                                                            </div>
                                                                            <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="text-sm text-gray-500 text-center py-2">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                                                            )}

                                                            {/* Add Comment Input */}
                                                            <div className="flex gap-3 mt-4 items-start border-t border-gray-50 dark:border-gray-800 pt-4">
                                                                <Image src="https://i.pravatar.cc/100?img=11" alt="You" width={32} height={32} className="w-8 h-8 rounded-full border border-gray-200" unoptimized />
                                                                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Viết bình luận..."
                                                                        className="flex-1 bg-gray-100 dark:bg-gray-800 border-none rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-primary dark:text-white"
                                                                        value={commentTexts[post.id] || ""}
                                                                        onChange={(e) => setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') handleAddComment(post.id);
                                                                        }}
                                                                    />
                                                                    <button
                                                                        onClick={() => handleAddComment(post.id)}
                                                                        disabled={!commentTexts[post.id]?.trim()}
                                                                        className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap"
                                                                    >
                                                                        Gửi
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            <AcademicAddNewLessonModal
                isOpen={isAddLessonOpen}
                onClose={() => setIsAddLessonOpen(false)}
                onAdd={(lesson) => {
                    addLesson(lesson);
                    setIsAddLessonOpen(false);
                }}
            />

            {isAddSubjectOpen && (
                <SubjectAddModal
                    onClose={() => setIsAddSubjectOpen(false)}
                />
            )}

            <CommunityAddPostModal
                isOpen={isAddPostOpen}
                onClose={() => setIsAddPostOpen(false)}
            />
        </>
    );
}
