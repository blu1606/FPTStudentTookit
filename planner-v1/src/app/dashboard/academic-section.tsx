import Image from "next/image";
import { StatCard } from "@/components/dashboard/stat-card";
import { MOCK_STATS, MOCK_SUBJECTS } from "@/lib/mock-data";

export default function AcademicSection() {
    return (
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
                            <span className="material-icons-round text-primary mr-2">school</span> Tiến độ học kỳ
                        </h3>
                        <div className="flex justify-center mb-6 relative z-10">
                            <div className="w-40 h-40 relative flex items-center justify-center group cursor-pointer">
                                <svg className="w-full h-full transform -rotate-90 drop-shadow-md" viewBox="0 0 36 36">
                                    <path className="text-gray-100 dark:text-gray-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                    <path className="text-primary transition-all duration-1000 ease-out" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="75, 100" strokeWidth="3" strokeLinecap="round" />
                                </svg>
                                <div className="absolute text-center transform group-hover:scale-110 transition-transform">
                                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">75<span className="text-xl text-gray-400 font-bold">%</span></span>
                                    <p className="text-xs font-bold uppercase text-primary mt-1 tracking-wider">Hoàn thành</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            {MOCK_STATS.map((stat, i) => (
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
                            <span className="flex items-center"><span className="material-icons-round text-blue-500 mr-2">analytics</span> Điểm thành phần</span>
                            <button className="text-gray-400 hover:text-primary transition-colors text-sm"><span className="material-icons-round">more_horiz</span></button>
                        </h3>
                        <div className="space-y-5">
                            {MOCK_SUBJECTS.map((subject) => (
                                <div key={subject.id} className="group cursor-pointer">
                                    <div className="flex justify-between text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        <span>{subject.name}</span>
                                        <span className={`${subject.colorClass} font-extrabold flex items-center bg-transparent px-0`}><span className="material-icons-round text-[10px] mr-1">{subject.progress >= 80 ? 'arrow_upward' : 'remove'}</span> {subject.progress / 10}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`${subject.bgColorClass} h-2 rounded-full transition-all duration-700 ease-out`}
                                            style={{ width: `${subject.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Trending Topics */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                            <span className="material-icons-round text-primary mr-2">local_fire_department</span> Trending
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
                                <span className="material-icons-round text-orange-500 mr-2">forum</span> Cộng đồng học tập
                            </h3>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <div className="relative flex-1 sm:w-48">
                                    <input type="text" placeholder="Tìm chủ đề..." className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl py-2 pl-3 pr-8 text-sm focus:ring-2 focus:ring-primary dark:text-white" />
                                    <span className="material-icons-round absolute right-2 top-2 text-gray-400 text-sm">search</span>
                                </div>
                                <button className="bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded-xl font-bold text-sm shadow-md transition-colors whitespace-nowrap">
                                    + Bài mới
                                </button>
                            </div>
                        </div>

                        {/* Post 1 */}
                        <div className="border-b border-gray-100 dark:border-gray-700 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                            <div className="flex items-start gap-4">
                                <Image src="https://i.pravatar.cc/100?img=3" alt="User 3" width={48} height={48} className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700 shadow-sm" unoptimized />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white text-lg">Hỏi về bài tập ASM Java</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-0.5">Trần Văn A • 2 giờ trước • <span className="text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">Java</span></p>
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-600"><span className="material-icons-round">more_horiz</span></button>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 mt-3 text-sm leading-relaxed">
                                        Mọi người cho mình hỏi phần kết nối Database trong bài Assignment 1 với ạ. Mình bị lỗi connection timeout mãi mà không fix được. Có ai gặp lỗi tương tự không? 😢
                                    </p>
                                    <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-2">
                                        <Image src="https://via.placeholder.com/150x100?text=Error.png" alt="Error snippet" width={150} height={100} className="h-20 w-auto rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-80 transition-opacity" unoptimized />
                                    </div>
                                    <div className="flex items-center gap-6 mt-4">
                                        <button className="flex items-center text-gray-500 hover:text-primary transition-colors text-sm font-semibold group">
                                            <span className="material-icons-round mr-1 group-hover:scale-110 transition-transform">thumb_up_off_alt</span> 12
                                        </button>
                                        <button className="flex items-center text-gray-500 hover:text-blue-500 transition-colors text-sm font-semibold group">
                                            <span className="material-icons-round mr-1 group-hover:scale-110 transition-transform">chat_bubble_outline</span> 5 Bình luận
                                        </button>
                                        <button className="flex items-center text-gray-500 hover:text-gray-700 transition-colors text-sm font-semibold ml-auto">
                                            <span className="material-icons-round mr-1">share</span> Chia sẻ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Post 2 */}
                        <div className="border-b border-gray-100 dark:border-gray-700 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                            <div className="flex items-start gap-4">
                                <Image src="https://i.pravatar.cc/100?img=5" alt="User 5" width={48} height={48} className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700 shadow-sm" unoptimized />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white text-lg">Chia sẻ tài liệu ôn thi MAD</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-0.5">Nguyễn Thị B • 5 giờ trước • <span className="text-purple-500 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded">Discrete Math</span></p>
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-600"><span className="material-icons-round">more_horiz</span></button>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 mt-3 text-sm leading-relaxed">
                                        Mình vừa tổng hợp được bộ đề ôn thi môn Toán rời rạc (MAD101) từ các kỳ trước. Ai cần thì comment email mình gửi nhé! Chúc mọi người thi tốt 💯
                                    </p>
                                    <div className="flex items-center gap-6 mt-4">
                                        <button className="flex items-center text-gray-500 hover:text-primary transition-colors text-sm font-semibold group">
                                            <span className="material-icons-round mr-1 group-hover:scale-110 transition-transform">thumb_up_off_alt</span> 45
                                        </button>
                                        <button className="flex items-center text-gray-500 hover:text-blue-500 transition-colors text-sm font-semibold group">
                                            <span className="material-icons-round mr-1 group-hover:scale-110 transition-transform">chat_bubble_outline</span> 20 Bình luận
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
}
