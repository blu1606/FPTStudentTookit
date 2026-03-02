import { Droppable } from "@hello-pangea/dnd";

type KanbanColumnProps = {
    id: string;
    title: string;
    count: number;
    colorIndicatorClass: string;
    pulse?: boolean;
    headerTextColorClass: string;
    badgeTextColorClass: string;
    children: React.ReactNode;
    onAdd?: () => void;
};

export function KanbanColumn({ id, title, count, colorIndicatorClass, pulse, headerTextColorClass, badgeTextColorClass, children, onAdd }: KanbanColumnProps) {
    return (
        <div className="flex flex-col h-full min-h-0 overflow-hidden bg-gray-200/50 dark:bg-gray-800/30 rounded-2xl p-2 border border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center justify-between px-3 py-4 flex-shrink-0">
                <h3 className={`font-extrabold ${headerTextColorClass} flex items-center gap-2 text-sm uppercase tracking-wide`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${colorIndicatorClass} ${pulse ? 'animate-pulse' : ''}`}></span>
                    {title}
                    <span className={`bg-white dark:bg-gray-700 ${badgeTextColorClass} text-xs font-bold px-2 py-0.5 rounded-full shadow-sm`}>
                        {count}
                    </span>
                </h3>
                <button onClick={onAdd} className="text-gray-400 hover:text-primary bg-white hover:bg-orange-50 dark:bg-gray-700 dark:hover:bg-orange-900/30 rounded-lg p-1 transition-all shadow-sm transform hover:scale-110 active:scale-95">
                    <span className="material-icons-round text-lg">add</span>
                </button>
            </div>
            <Droppable droppableId={id}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 overflow-y-auto space-y-3 px-2 pb-2 custom-scrollbar transition-colors ${snapshot.isDraggingOver ? 'bg-gray-100/50 dark:bg-gray-700/20' : ''}`}
                    >
                        {children}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}
