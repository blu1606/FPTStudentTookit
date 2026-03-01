type StatCardProps = {
    title: string;
    value: string;
    bottomText: string;
    ringColorClass: string; // e.g., "ring-green-500" or "ring-orange-500"
};

export function StatCard({ title, value, bottomText, ringColorClass }: StatCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center gap-2">
            <div className={`w-12 h-12 rounded-full bg-white dark:bg-gray-700 shadow-sm border-2 border-gray-100 dark:border-gray-600 ring-4 ${ringColorClass} flex items-center justify-center flex-shrink-0`}>
                <span className="text-sm font-extrabold text-gray-800 dark:text-white leading-none">{value}</span>
            </div>
            <div className="min-w-0 w-full">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{title}</h3>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5 truncate">{bottomText}</p>
            </div>
        </div>
    );
}
