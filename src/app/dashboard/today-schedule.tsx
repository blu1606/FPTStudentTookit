"use client";

import { usePlanner } from "@/contexts/PlannerContext";
import { isToday, format, isFuture, isPast } from "date-fns";
import { EVENT_TYPE_COLORS } from "@/lib/mock-data";

export default function TodaySchedule() {
    const { events } = usePlanner();
    const todayEvents = events
        .filter(e => isToday(e.startTime))
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                    <span className="w-2 h-6 bg-secondary rounded-full mr-3"></span>
                    Lịch học hôm nay
                </h3>
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    <button className="px-3 py-1 bg-white dark:bg-gray-700 shadow-sm rounded-md text-xs font-bold text-gray-800 dark:text-white transition-all">Ngày</button>
                    <button className="px-3 py-1 text-gray-600 dark:text-gray-400 text-xs font-bold hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Tuần</button>
                </div>
            </div>
            <div className="space-y-4">
                {todayEvents.length > 0 ? todayEvents.map(event => {
                    const colorData = EVENT_TYPE_COLORS[event.type];
                    const isNow = isPast(event.startTime) && isFuture(event.endTime);
                    const statusText = isNow ? "Đang diễn ra" : isPast(event.endTime) ? "Đã xong" : "Sắp tới";

                    return (
                        <div key={event.id} className="flex items-start group">
                            <div className="w-16 flex-shrink-0 flex flex-col items-center pt-2">
                                <span className="text-xs font-bold text-gray-400">{format(event.startTime, 'HH:mm')}</span>
                                <div className="h-full w-0.5 bg-gray-200 dark:bg-gray-700 my-2 group-last:hidden"></div>
                            </div>
                            <div className={`flex-1 ${colorData.bg} border-l-4 ${colorData.border} rounded-r-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-gray-800 dark:text-white text-lg">{event.title}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                                            <span className="material-symbols-outlined text-sm mr-1">schedule</span>
                                            {format(event.startTime, 'HH:mm')} - {format(event.endTime, 'HH:mm')}
                                        </p>
                                    </div>
                                    <span className={`${colorData.bg} ${colorData.text} text-xs font-bold px-2 py-1 rounded-md`}>
                                        {statusText}
                                    </span>
                                </div>
                            </div>

                        </div>
                    );
                }) : (
                    <div className="text-center py-8 text-gray-400 font-medium">Bạn không có lịch học nào hôm nay 🎉</div>
                )}
            </div>
        </div>
    );
}
