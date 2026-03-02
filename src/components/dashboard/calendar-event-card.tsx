"use client";

import { Draggable } from "@hello-pangea/dnd";
import { CalendarEvent, EVENT_TYPE_COLORS } from "@/lib/mock-data";

type Props = {
    event: CalendarEvent;
    index: number;
    // pixels per hour in the week grid
    pxPerHour: number;
};

export function CalendarEventCard({ event, index, pxPerHour }: Props) {
    const colors = EVENT_TYPE_COLORS[event.type];
    // Position: offset from 08:00 (hour 8)
    const topPx = (event.startHour - 8) * pxPerHour;
    const heightPx = event.durationHours * pxPerHour;

    return (
        <Draggable draggableId={event.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`absolute left-1 right-1 rounded-lg ${colors.bg} border-l-4 ${colors.border} p-2 shadow-sm cursor-grab
                        ${snapshot.isDragging ? "shadow-xl ring-2 ring-primary/50 cursor-grabbing z-50 opacity-90" : "hover:shadow-md z-10"}
                        transition-shadow text-[${colors.text}]`}

                    style={{
                        top: topPx,
                        height: heightPx,
                        ...provided.draggableProps.style,
                    }}
                >
                    <div className="flex justify-between items-start">
                        <span className={`text-xs font-bold ${colors.text} bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded`}>
                            {String(event.startHour).padStart(2, "0")}:00
                        </span>

                        {event.isUrgent && (
                            <span className="material-icons-round text-rose-500 text-sm animate-pulse">priority_high</span>
                        )}
                    </div>
                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 mt-1 leading-tight truncate">
                        {event.title}
                    </h4>
                    {event.location && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <span className="material-icons-round text-[10px]">location_on</span>
                            <span className="truncate">{event.location}</span>
                        </div>
                    )}
                </div>
            )}
        </Draggable>
    );
}
