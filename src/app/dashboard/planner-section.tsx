"use client";

import { useState, useCallback, useEffect } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import {
    format, addWeeks, subWeeks, addMonths, subMonths, addDays,
    startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval,
    isToday, isSameMonth, getDay,
} from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarDay } from "@/components/dashboard/calendar-day";
import { CalendarEventCard } from "@/components/dashboard/calendar-event-card";
import { CalendarAddEventModal } from "@/components/dashboard/calendar-add-event-modal";
import { CalendarEvent, EVENT_TYPE_COLORS } from "@/lib/mock-data";
import { usePlanner } from "@/contexts/PlannerContext";

const PX_PER_HOUR = 80;
const START_HOUR = 7;
const VI_WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

type ViewMode = "day" | "week" | "month";

type PlannerSectionProps = {
    pendingAction?: string | null;
    clearAction?: () => void;
};

export default function PlannerSection({ pendingAction, clearAction }: PlannerSectionProps = {}) {
    const [viewMode, setViewMode] = useState<ViewMode>("week");
    const [currentDate, setCurrentDate] = useState(new Date());
    const { events, addEvent, updateEvent } = usePlanner();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addModalDefaultDate, setAddModalDefaultDate] = useState<string | undefined>();

    useEffect(() => {
        if (pendingAction === 'create_event') {
            setIsAddModalOpen(true);
            clearAction?.();
        }
    }, [pendingAction, clearAction]);

    // Navigation
    const goNext = () => {
        if (viewMode === "week") setCurrentDate((d) => addWeeks(d, 1));
        else if (viewMode === "month") setCurrentDate((d) => addMonths(d, 1));
        else setCurrentDate((d) => addDays(d, 1));
    };
    const goPrev = () => {
        if (viewMode === "week") setCurrentDate((d) => subWeeks(d, 1));
        else if (viewMode === "month") setCurrentDate((d) => subMonths(d, 1));
        else setCurrentDate((d) => addDays(d, -1));
    };

    // Date label for toolbar
    const dateLabel = (() => {
        if (viewMode === "week") {
            const ws = startOfWeek(currentDate, { weekStartsOn: 1 });
            const we = endOfWeek(currentDate, { weekStartsOn: 1 });
            return `${format(ws, "d")} – ${format(we, "d")} Tháng ${format(ws, "M, yyyy")}`;
        }
        if (viewMode === "month") return format(currentDate, "MMMM yyyy", { locale: vi });
        return format(currentDate, "EEEE, d MMMM yyyy", { locale: vi });
    })();

    // 7 days for week view header
    const weekDays = (() => {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 });
        return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    })();

    // All grid days for month view
    const monthDays = (() => {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        return eachDayOfInterval({
            start: startOfWeek(start, { weekStartsOn: 1 }),
            end: endOfWeek(end, { weekStartsOn: 1 }),
        });
    })();

    const timeSlots = Array.from({ length: 13 }, (_, i) => START_HOUR + i);

    const eventsForDate = useCallback(
        (dateStr: string) => events.filter((e) => e.date === dateStr),
        [events]
    );

    // DnD: move event to new date column
    const handleDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;
        if (!destination || destination.droppableId === source.droppableId) return;
        const e = events.find(x => x.id === draggableId);
        if (e) {
            updateEvent({ ...e, date: destination.droppableId });
        }
    };

    const handleAddEvent = (event: CalendarEvent) => {
        console.log("[PlannerSection] handleAddEvent passing to Context wrapper with payload:", event);
        addEvent(event);
    };

    const openAddModal = (date?: string) => {
        setAddModalDefaultDate(date);
        setIsAddModalOpen(true);
    };

    // Time ruler shared element
    const TimeRuler = () => (
        <div className="w-16 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-20">
            <div className="h-14 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
            <div className="flex flex-col text-xs text-gray-400 dark:text-gray-500 font-semibold text-right pr-2 pt-2">
                {timeSlots.map((h) => (
                    <div key={h} style={{ height: PX_PER_HOUR }} className="-mt-2.5">
                        {String(h).padStart(2, "0")}:00
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <section id="planner" className="dashboard-section relative min-h-screen">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Thời gian biểu</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Quản lý lịch học và deadline hiệu quả</p>
                </div>
                <div className="hidden lg:flex items-center gap-3 text-xs font-bold bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex-wrap">
                    {Object.entries(EVENT_TYPE_COLORS).map(([key, val]) => (
                        <div key={key} className="flex items-center gap-1">
                            <span className={`w-3 h-3 rounded-full ${val.border.replace("border-", "bg-")}`} />
                            {val.label}
                        </div>

                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-[820px] mb-20 relative">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-800/50 flex-shrink-0">
                    {/* View Toggle */}
                    <div className="bg-gray-200 dark:bg-gray-700 p-1 rounded-lg flex text-sm font-semibold">
                        {(["day", "week", "month"] as ViewMode[]).map((v) => (
                            <button
                                key={v}
                                onClick={() => setViewMode(v)}
                                className={`px-4 py-2 rounded-md transition-colors ${viewMode === v
                                    ? "bg-white dark:bg-gray-600 text-primary shadow-sm"
                                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                            >
                                {v === "day" ? "Ngày" : v === "week" ? "Tuần" : "Tháng"}
                            </button>
                        ))}
                    </div>

                    {/* Date Navigation */}
                    <div className="flex items-center gap-3">
                        <button onClick={goPrev} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors" aria-label="Trước">
                            <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">chevron_left</span>
                        </button>
                        <div className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 min-w-max">
                            <span className="material-symbols-outlined text-primary text-base">calendar_today</span>
                            <span>{dateLabel}</span>
                        </div>
                        <button onClick={goNext} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors" aria-label="Sau">
                            <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">chevron_right</span>
                        </button>
                        <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 text-xs font-bold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                            Hôm nay
                        </button>
                    </div>

                    <button className="p-2 text-gray-500 hover:text-primary transition-colors" aria-label="Lọc">
                        <span className="material-symbols-outlined">tune</span>
                    </button>
                </div>

                {/* ── Week View ── */}
                {viewMode === "week" && (
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <div className="flex flex-1 overflow-hidden">
                            <TimeRuler />
                            <div className="flex-1 overflow-auto">
                                <div className="min-w-[700px] h-full flex flex-col">
                                    {/* Week Header */}
                                    <div className="grid grid-cols-7 h-14 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 sticky top-0 z-10 shadow-sm">
                                        {weekDays.map((day, i) => {
                                            const todayDay = isToday(day);
                                            const isSun = getDay(day) === 0;
                                            return (
                                                <div key={i} className={`flex flex-col items-center justify-center border-r border-gray-100 dark:border-gray-700 last:border-r-0 ${todayDay ? "bg-orange-50/50 dark:bg-orange-900/10" : ""}`}>
                                                    <span className={`text-xs font-semibold uppercase ${todayDay ? "text-primary" : isSun ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}>
                                                        {VI_WEEKDAYS[i]}
                                                    </span>
                                                    {todayDay ? (
                                                        <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md">
                                                            {format(day, "d")}
                                                        </div>
                                                    ) : (
                                                        <span className={`text-lg font-bold ${isSun ? "text-red-500" : "text-gray-900 dark:text-white"}`}>{format(day, "d")}</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Day Columns with Droppables */}
                                    <div className="relative flex-1 grid grid-cols-7">
                                        {/* Hour lines */}
                                        <div className="absolute inset-0 flex flex-col pointer-events-none" style={{ gridColumn: "1 / -1" }}>
                                            {timeSlots.map((h) => (
                                                <div key={h} style={{ height: PX_PER_HOUR }} className="border-b border-gray-100 dark:border-gray-700 border-dashed w-full" />
                                            ))}
                                        </div>
                                        {weekDays.map((day, colIndex) => {
                                            const dateStr = format(day, "yyyy-MM-dd");
                                            return (
                                                <Droppable droppableId={dateStr} key={dateStr}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.droppableProps}
                                                            onClick={() => openAddModal(dateStr)}
                                                            className={`relative border-r border-gray-100 dark:border-gray-700 last:border-r-0 transition-colors cursor-pointer ${snapshot.isDraggingOver ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-gray-50/50 dark:hover:bg-gray-700/20"}`}
                                                            style={{ minHeight: timeSlots.length * PX_PER_HOUR }}
                                                        >
                                                            {eventsForDate(dateStr).map((evt, idx) => (
                                                                <CalendarEventCard key={evt.id} event={evt} index={idx} pxPerHour={PX_PER_HOUR} />
                                                            ))}
                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                </Droppable>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DragDropContext>
                )}

                {/* ── Day View ── */}
                {viewMode === "day" && (
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <div className="flex flex-1 overflow-hidden">
                            <TimeRuler />
                            <div className="flex-1 overflow-auto">
                                <div className="min-w-[300px] flex flex-col">
                                    <div className="h-14 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 sticky top-0 z-10 flex items-center justify-center">
                                        <span className="text-base font-bold text-gray-800 dark:text-white capitalize">
                                            {format(currentDate, "EEEE, d MMMM", { locale: vi })}
                                        </span>
                                    </div>
                                    <Droppable droppableId={format(currentDate, "yyyy-MM-dd")}>
                                        {(provided, snapshot) => {
                                            const dateStr = format(currentDate, "yyyy-MM-dd");
                                            return (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.droppableProps}
                                                    onClick={() => openAddModal(dateStr)}
                                                    className={`relative cursor-pointer transition-colors ${snapshot.isDraggingOver ? "bg-primary/5" : ""}`}
                                                    style={{ minHeight: timeSlots.length * PX_PER_HOUR }}
                                                >
                                                    <div className="absolute inset-0 flex flex-col pointer-events-none">
                                                        {timeSlots.map((h) => (
                                                            <div key={h} style={{ height: PX_PER_HOUR }} className="border-b border-gray-100 dark:border-gray-700 border-dashed w-full" />
                                                        ))}
                                                    </div>
                                                    {eventsForDate(dateStr).map((evt, idx) => (
                                                        <CalendarEventCard key={evt.id} event={evt} index={idx} pxPerHour={PX_PER_HOUR} />
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            );
                                        }}
                                    </Droppable>
                                </div>
                            </div>
                        </div>
                    </DragDropContext>
                )}

                {/* ── Month View ── */}
                {viewMode === "month" && (
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50">
                        <div className="grid grid-cols-7 mb-2">
                            {VI_WEEKDAYS.map((d, i) => (
                                <div key={d} className={`text-center text-xs font-bold py-1 ${i === 6 ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}>
                                    {d}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {monthDays.map((day, index) => {
                                const dateStr = format(day, "yyyy-MM-dd");
                                const calDayEvents = eventsForDate(dateStr).map((e) => ({
                                    title: e.title,
                                    duration: `${e.durationHours}h`,
                                    colorClass: `${EVENT_TYPE_COLORS[e.type].bg} ${EVENT_TYPE_COLORS[e.type].text}`,
                                }));

                                return (
                                    <div key={index} onClick={() => openAddModal(dateStr)} className="cursor-pointer">
                                        <CalendarDay
                                            dateNum={Number(format(day, "d"))}
                                            isCurrentMonth={isSameMonth(day, currentDate)}
                                            isSunday={getDay(day) === 0}
                                            isToday={isToday(day)}
                                            events={calDayEvents}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* FAB: Quick Add */}
            <button
                onClick={() => openAddModal()}
                className="absolute bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-xl hover:bg-orange-600 transition-transform hover:scale-110 active:scale-95 flex items-center justify-center z-50 group"
                aria-label="Thêm lịch mới"
            >
                <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-300">add</span>
                <div className="absolute right-full mr-4 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Thêm lịch
                </div>
            </button>

            {/* Add Event Modal */}
            <CalendarAddEventModal
                isOpen={isAddModalOpen}
                defaultDate={addModalDefaultDate}
                onClose={() => setIsAddModalOpen(false)}
                onAddEvent={handleAddEvent}
            />
        </section>
    );
}
