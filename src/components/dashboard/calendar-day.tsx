type CalendarDayProps = {
    dateNum: number;
    isCurrentMonth?: boolean;
    isToday?: boolean;
    isSunday?: boolean;
    events: { title: string; duration: string; colorClass: string }[];
};

export function CalendarDay({ dateNum, isCurrentMonth = true, isToday = false, isSunday = false, events }: CalendarDayProps) {
    // Determine the base classes for the container
    let containerClass = "min-h-[140px] rounded-xl p-2 transition-shadow relative ";
    let dateTextClass = "text-sm ";

    if (isToday) {
        containerClass += "bg-orange-50 dark:bg-orange-900/10 border-2 border-primary hover:shadow-md";
        dateTextClass += "font-bold text-primary";
    } else {
        containerClass += "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md ";
        if (!isCurrentMonth) {
            containerClass += "opacity-50 ";
        }
        if (isSunday) {
            containerClass += "bg-red-50/30 dark:bg-red-900/10 ";
            dateTextClass += "font-bold text-red-500";
        } else {
            dateTextClass += "font-semibold text-gray-400";
        }
    }

    return (
        <div className={containerClass}>
            <span className={dateTextClass}>{dateNum.toString().padStart(2, '0')}</span>
            {events.length > 0 && (
                <div className="mt-2 space-y-1">
                    {events.map((evt, idx) => (
                        <div key={idx} className={`text-[10px] font-bold ${evt.colorClass} px-1 py-0.5 rounded truncate`}>
                            {evt.title} ({evt.duration})
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
