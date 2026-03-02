"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatMessage } from "@/app/api/chat/route";
import { useMood } from "@/contexts/MoodContext";
import { isToday, format, isPast } from "date-fns";
import { BreathingModal } from "@/components/dashboard/breathing-modal";

type Message = ChatMessage & { id: string; time: string };

const INITIAL_BOT_MESSAGE: Message = {
    id: "init",
    role: "assistant",
    content: "Chào bạn! 👋 Mình là Trợ lý Cảm xúc AI. Hôm nay bạn cảm thấy thế nào? Có deadline nào đang làm bạn lo lắng không?",
    time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
};

const QUICK_REPLIES = [
    { emoji: "😔", label: "Mình đang stress" },
    { emoji: "💪", label: "Cần lên kế hoạch" },
    { emoji: "😴", label: "Mệt mỏi quá" },
];

function formatTime() {
    return new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

export default function MoodSection() {
    const { moodEntries } = useMood();
    const [messages, setMessages] = useState<Message[]>([INITIAL_BOT_MESSAGE]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isBreathingModalOpen, setIsBreathingModalOpen] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    async function sendMessage(text: string) {
        const trimmed = text.trim();
        if (!trimmed || isLoading) return;

        const userMsg: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: trimmed,
            time: formatTime(),
        };

        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput("");
        setIsLoading(true);

        try {
            const historyForApi: ChatMessage[] = updatedMessages.map(({ role, content }) => ({ role, content }));

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: historyForApi }),
            });

            const data = await res.json();
            const replyText = data.reply ?? data.error ?? "Có lỗi xảy ra, thử lại nhé! 🙏";

            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: replyText,
                    time: formatTime(),
                },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: "Mình không kết nối được. Bạn thử lại sau nhé! 🙏",
                    time: formatTime(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    }

    return (
        <>
            {/* 4. Trợ lý Cảm xúc (2-column layout) */}
            <section id="mood" className="dashboard-section fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-3xl text-primary">sentiment_satisfied</span>
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Trợ lý cảm xúc</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Mood History & Suggestions */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center mb-6">
                                <span className="material-symbols-outlined text-primary mr-2">history</span>
                                Lịch sử cảm xúc
                            </h3>

                            {/* Mood chart */}
                            <div className="h-40 w-full mb-6 relative">
                                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                                    <path
                                        d="M 0,30 L 15,35 L 30,15 L 45,25 L 60,5 L 75,15 L 90,15 L 100,10"
                                        fill="none"
                                        stroke="#A855F7"
                                        strokeWidth="1.5"
                                        className="drop-shadow-md"
                                    />
                                    <path
                                        d="M 0,30 L 15,35 L 30,15 L 45,25 L 60,5 L 75,15 L 90,15 L 100,10 L 100,50 L 0,50 Z"
                                        fill="url(#gradient)"
                                        className="opacity-20"
                                    />
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#A855F7" />
                                            <stop offset="100%" stopColor="transparent" />
                                        </linearGradient>
                                    </defs>
                                    {[
                                        [0, 30], [15, 35], [30, 15], [45, 25],
                                        [60, 5], [75, 15], [90, 15],
                                    ].map(([cx, cy], i) => (
                                        <circle key={i} cx={cx} cy={cy} r="2" fill="white" stroke="#A855F7" strokeWidth="1" />
                                    ))}
                                </svg>
                                <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-medium">
                                    {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
                                        <span key={d}>{d}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Timeline */}
                            <div className="relative pl-4 space-y-6 before:absolute before:inset-y-0 before:left-[7px] before:w-[2px] before:bg-gray-100 before:dark:bg-gray-800">
                                {moodEntries.slice(0, 3).map((entry) => {
                                    const date = new Date(entry.recorded_at);
                                    let dateText = "";
                                    if (isToday(date)) dateText = `Hôm nay, ${format(date, 'HH:mm')}`;
                                    else if (isPast(date)) dateText = format(date, 'dd/MM, HH:mm');

                                    const isGood = entry.score >= 7;
                                    const isBad = entry.score <= 4;
                                    const dotClass = isGood ? 'bg-green-500' : isBad ? 'bg-red-400' : 'bg-primary';
                                    const boxClass = isGood ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-100 dark:border-green-800/30' :
                                        isBad ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-100 dark:border-red-800/30' :
                                            'bg-primary/5 dark:bg-primary/20 text-primary border-primary/10 dark:border-primary/30';

                                    return (
                                        <div key={entry.id} className="relative">
                                            <div className={`absolute -left-[27px] top-1 w-3 h-3 ${dotClass} rounded-full border-2 border-white dark:border-surface-dark z-10`} />
                                            <p className="text-xs text-gray-500 font-semibold mb-2">{dateText}</p>
                                            <div className={`p-3 rounded-xl border ${boxClass}`}>
                                                <p className="font-bold flex items-center">{entry.mood_type}</p>
                                                {entry.note ? <p className="text-xs mt-1 opacity-80">{entry.note}</p> : null}
                                            </div>
                                        </div>
                                    );
                                })}
                                {moodEntries.length === 0 && (
                                    <div className="text-sm text-gray-400 py-4">Chưa có lịch sử cảm xúc.</div>
                                )}
                            </div>

                            {/* Suggestions */}
                            <div className="mt-8">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Gợi ý cho bạn</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="flex flex-col items-center justify-center p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-2xl transition-colors group">
                                        <span className="material-symbols-outlined text-3xl text-purple-500 mb-1 group-hover:scale-110 transition-transform">music_note</span>
                                        <span className="text-xs font-bold text-purple-700 dark:text-purple-300">Lo-fi Chill</span>
                                    </button>
                                    <button
                                        onClick={() => setIsBreathingModalOpen(true)}
                                        className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-2xl transition-colors group"
                                    >
                                        <span className="material-symbols-outlined text-3xl text-green-500 mb-1 group-hover:scale-110 transition-transform">self_improvement</span>
                                        <span className="text-xs font-bold text-green-700 dark:text-green-300">Thở</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Chat Interface */}
                    <div className="lg:col-span-8 h-[calc(100vh-14rem)]">
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col h-full overflow-hidden">
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-800 z-10">
                                <div className="flex items-center gap-3">
                                    <div className="relative px-2">
                                        <span className="material-symbols-outlined text-4xl text-gray-400">smart_toy</span>
                                        <div className="absolute bottom-1 right-2 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white leading-tight">Trợ lý Cảm xúc AI</h3>
                                        <p className="text-xs text-primary font-medium">
                                            {isLoading ? "Đang trả lời..." : "Luôn lắng nghe bạn"}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400 font-medium bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full">
                                    Groq · llama-3.3
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth bg-[#fafafa] dark:bg-background-dark">
                                <div className="flex justify-center">
                                    <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
                                        {new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "numeric" })}
                                    </span>
                                </div>

                                {messages.map((msg) =>
                                    msg.role === "assistant" ? (
                                        <div key={msg.id} className="flex items-end gap-3 max-w-[85%] fade-in">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 shadow-sm border border-white dark:border-gray-600 mb-1">
                                                <span className="material-symbols-outlined text-gray-500 text-[20px]">smart_toy</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700 text-[15px] leading-relaxed whitespace-pre-wrap">
                                                    {msg.content}
                                                </div>
                                                <span className="text-[10px] text-gray-400 ml-1">{msg.time}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div key={msg.id} className="flex items-end justify-end gap-3 fade-in group">
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="bg-primary text-white rounded-2xl rounded-br-md p-4 shadow-md text-[15px] max-w-md whitespace-pre-wrap">
                                                    {msg.content}
                                                </div>
                                                <span className="text-[10px] text-gray-400 mr-1">{msg.time}</span>
                                            </div>
                                        </div>
                                    )
                                )}

                                {/* Typing indicator */}
                                {isLoading && (
                                    <div className="flex items-end gap-3 max-w-[85%] fade-in">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 shadow-sm border border-white dark:border-gray-600 mb-1">
                                            <span className="material-symbols-outlined text-gray-500 text-[20px]">smart_toy</span>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl px-5 py-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-1.5">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                        </div>
                                    </div>
                                )}

                                <div ref={bottomRef} />
                            </div>

                            {/* Chat Input & Quick Actions */}
                            <div className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-800">
                                {/* Quick Replies */}
                                <div className="px-4 pt-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
                                    {QUICK_REPLIES.map((qr) => (
                                        <button
                                            key={qr.label}
                                            onClick={() => sendMessage(qr.label)}
                                            disabled={isLoading}
                                            className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-4 py-1.5 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300 shadow-sm whitespace-nowrap"
                                        >
                                            <span>{qr.emoji}</span> {qr.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Input Field */}
                                <div className="p-4 py-4 flex items-center gap-3">
                                    <div className="flex-1 bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-full flex items-center px-4 py-2 hover:border-primary/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-inner">
                                        <span className="material-symbols-outlined text-gray-400 mr-2 text-xl">sentiment_satisfied</span>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Nhập tin nhắn... (Enter để gửi)"
                                            disabled={isLoading}
                                            className="w-full bg-transparent border-none focus:ring-0 text-gray-700 dark:text-gray-200 placeholder-gray-400 p-0 text-sm h-8 disabled:opacity-60"
                                        />
                                    </div>
                                    <button
                                        onClick={() => sendMessage(input)}
                                        disabled={isLoading || !input.trim()}
                                        className="bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md transform hover:scale-105 active:scale-95 transition-all"
                                    >
                                        <span className="material-symbols-outlined ml-1">send</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <BreathingModal
                isOpen={isBreathingModalOpen}
                onClose={() => setIsBreathingModalOpen(false)}
            />
        </>
    );
}
