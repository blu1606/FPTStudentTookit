"use client";

import { useState } from "react";
import { CalendarEvent, CalendarEventType, EVENT_TYPE_COLORS } from "@/lib/mock-data";
import { format } from "date-fns";

type Props = {
    isOpen: boolean;
    defaultDate?: string; // "YYYY-MM-DD"
    onClose: () => void;
    onAddEvent: (event: CalendarEvent) => void;
};

const EVENT_TYPES: CalendarEventType[] = ["group", "exam", "online", "project", "deadline"];
const DURATION_OPTIONS = [0.5, 1, 1.5, 2, 3];

export function CalendarAddEventModal({ isOpen, defaultDate, onClose, onAddEvent }: Props) {
    const today = format(new Date(), "yyyy-MM-dd");

    const [title, setTitle] = useState("");
    const [date, setDate] = useState(defaultDate ?? today);
    const [startHour, setStartHour] = useState(8);
    const [duration, setDuration] = useState(1);
    const [type, setType] = useState<CalendarEventType>("group");
    const [location, setLocation] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        const newEvent: CalendarEvent = {
            id: `e-${Date.now()}`,
            title: title.trim(),
            date,
            startHour,
            durationHours: duration,
            type,
            location: location.trim() || undefined,
        };
        console.log("[Modal] handleSubmit triggered! Submitting newEvent:", newEvent);
        onAddEvent(newEvent);
        // Reset form
        setTitle("");
        setDate(defaultDate ?? today);
        setStartHour(8);
        setDuration(1);
        setType("group");
        setLocation("");
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
            <div className="w-full sm:max-w-md bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-icons-round text-primary">add_circle</span>
                        Thêm lịch mới
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        aria-label="Đóng"
                    >
                        <span className="material-icons-round">close</span>
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                            Tiêu đề *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="VD: Học nhóm Toán..."
                            required
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    {/* Date + Start Hour row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                Ngày
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                Giờ bắt đầu
                            </label>
                            <select
                                value={startHour}
                                onChange={(e) => setStartHour(Number(e.target.value))}
                                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                {Array.from({ length: 13 }, (_, i) => i + 7).map((h) => (
                                    <option key={h} value={h}>
                                        {String(h).padStart(2, "0")}:00
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                            Thời lượng
                        </label>
                        <div className="flex gap-2 flex-wrap">
                            {DURATION_OPTIONS.map((d) => (
                                <button
                                    key={d}
                                    type="button"
                                    onClick={() => setDuration(d)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors
                                        ${duration === d
                                            ? "bg-primary text-white border-primary"
                                            : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary"
                                        }`}
                                >
                                    {d < 1 ? "30p" : `${d}h`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Event Type */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                            Loại
                        </label>
                        <div className="flex gap-2 flex-wrap">
                            {EVENT_TYPES.map((t) => {
                                const colors = EVENT_TYPE_COLORS[t];
                                return (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setType(t)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all
                                            ${type === t
                                                ? `${colors.bg} ${colors.border} ${colors.text} border-2`
                                                : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-400"
                                            }`}
                                    >
                                        {colors.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Location (optional) */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                            Địa điểm <span className="normal-case font-normal">(tuỳ chọn)</span>
                        </label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="VD: Phòng 204, Zoom..."
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2 relative z-10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors pointer-events-auto"
                        >
                            Huỷ
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-md shadow-primary/30 transition-colors pointer-events-auto"
                        >
                            Thêm lịch
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
