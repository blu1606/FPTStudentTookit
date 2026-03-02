export type Subject = {
    id: string;
    name: string;
    count: number;
    colorClass: string;
    bgColorClass: string;
    icon: string;
    progress: number;
};

export type CalendarEventType = "group" | "exam" | "online" | "project" | "deadline";

export type CalendarEvent = {
    id: string;
    title: string;
    date: string; // "YYYY-MM-DD"
    startHour: number; // e.g. 8 = 08:00
    durationHours: number; // e.g. 2 = 2 hours
    type: CalendarEventType;
    location?: string;
    isUrgent?: boolean;
};

// Color map per event type
export const EVENT_TYPE_COLORS: Record<CalendarEventType, { bg: string; border: string; text: string; label: string }> = {
    group: { bg: "bg-teal-100 dark:bg-teal-900/40", border: "border-teal-500", text: "text-teal-600", label: "Học nhóm 👥" },
    exam: { bg: "bg-rose-100 dark:bg-rose-900/40", border: "border-rose-500", text: "text-rose-500", label: "Ôn thi 📝" },
    online: { bg: "bg-blue-100 dark:bg-blue-900/40", border: "border-blue-500", text: "text-blue-500", label: "Online 💻" },
    project: { bg: "bg-purple-100 dark:bg-purple-900/40", border: "border-purple-500", text: "text-purple-500", label: "Dự án 🎓" },
    deadline: { bg: "bg-orange-100 dark:bg-orange-900/40", border: "border-primary", text: "text-primary", label: "Deadline ⚠️" },
};

export type Priority = "High" | "Medium" | "Low";

export type TaskStatus = "Todo" | "InProgress" | "Done";

export type Task = {
    id: string;
    title: string;
    subjectId: string;
    priority: Priority;
    deadline: Date; // Keep as Date object
    status: TaskStatus;
    description?: string;
    source: "Coursera" | "Edunext" | "Tự học";
    submittedOn?: string;
    isUrgent?: boolean;
};

export type LessonType = "video" | "reading" | "exercise" | "exam-prep" | "project";

export type Lesson = {
    id: string;
    subjectId: string;
    title: string;
    type: LessonType;
    score?: number;
    notes?: string;
    completed_at?: string;
    created_at?: string;
};

export type AcademicStat = {
    title: string;
    value: string;
    bottomText?: string;
    ringColorClass: string;
};

export const MOCK_SUBJECTS: Subject[] = [
    { id: "s1", name: "Toán học", count: 4, colorClass: "text-blue-600", bgColorClass: "bg-blue-600", icon: "calculate", progress: 85 },
    { id: "s2", name: "Ngữ Văn", count: 2, colorClass: "text-rose-600", bgColorClass: "bg-rose-600", icon: "history_edu", progress: 65 },
    { id: "s3", name: "Vật Lý", count: 3, colorClass: "text-green-600", bgColorClass: "bg-green-600", icon: "science", progress: 40 },
    { id: "s4", name: "Tiếng Anh", count: 1, colorClass: "text-purple-600", bgColorClass: "bg-purple-600", icon: "campaign", progress: 92 },
];

export const MOCK_TASKS: Task[] = [
    {
        id: "t1",
        title: "Lab Report: Thermodynamics",
        subjectId: "s3",
        priority: "Medium",
        deadline: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // +2 days
        status: "Todo",
        source: "Tự học"
    },
    {
        id: "t2",
        title: "Essay: Vietnam War Impact",
        subjectId: "s2",
        priority: "Medium",
        deadline: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000), // +5 days
        status: "Todo",
        source: "Tự học"
    },
    {
        id: "t3",
        title: "Bài tập Đại số tuyến tính - Chương 3",
        subjectId: "s1",
        priority: "High",
        deadline: new Date(new Date().setHours(23, 59, 0, 0)), // Today 23:59
        status: "InProgress",
        source: "Edunext",
        isUrgent: true,
    },
    {
        id: "t4",
        title: "Presentation: Global Warming",
        subjectId: "s4",
        priority: "High",
        deadline: new Date(new Date().getTime() + 14 * 60 * 60 * 1000), // +14 hours
        status: "InProgress",
        source: "Tự học"
    },
    {
        id: "t5",
        title: "Quiz: Week 3 Linear Algebra",
        subjectId: "s1",
        priority: "High",
        deadline: new Date(new Date().getTime() + 4 * 60 * 60 * 1000), // +4 hours
        status: "InProgress",
        source: "Coursera",
        description: "Hoàn thành 10 câu hỏi trắc nghiệm về vector space và matrix transformation trên hệ thống Coursera."
    },
    {
        id: "t6",
        title: "Group Assignment: Thuyết trình",
        subjectId: "s4",
        priority: "Medium",
        deadline: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), // +3 days
        status: "InProgress",
        source: "Edunext"
    },
    {
        id: "t7",
        title: "Đọc chapter 5 - Clean Code",
        subjectId: "s4",
        priority: "Low",
        deadline: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // +7 days
        status: "Todo",
        source: "Tự học"
    },
    {
        id: "t8",
        title: "Quiz: English Unit 5 Vocab",
        subjectId: "s4",
        priority: "Medium",
        deadline: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000), // -1 day (Yesterday)
        status: "Done",
        source: "Edunext",
        submittedOn: "Yesterday"
    }
];

export const MOCK_STATS: AcademicStat[] = [
    { title: "Môn đã qua", value: "4/6", bottomText: "Kỳ Fall 2024", ringColorClass: "ring-primary" },
    { title: "Tín chỉ", value: "12/18", bottomText: "Đạt 66%", ringColorClass: "ring-purple-500" }
];

// Helper: get ISO date string for a day offset from today
function dayOffset(offset: number): string {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().split("T")[0];
}

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
    { id: "e1", title: "Lý học nhóm", date: dayOffset(0), startHour: 8, durationHours: 2, type: "group", location: "Phòng 204" },
    { id: "e2", title: "Ôn môn Toán", date: dayOffset(1), startHour: 10, durationHours: 2, type: "exam", isUrgent: true },
    { id: "e3", title: "Tiếng Anh Online", date: dayOffset(1), startHour: 14, durationHours: 2, type: "online", location: "Zoom" },
    { id: "e4", title: "Project Java", date: dayOffset(2), startHour: 8, durationHours: 3, type: "project", location: "Library" },
    { id: "e5", title: "Deadline Assignment", date: dayOffset(4), startHour: 9, durationHours: 1, type: "deadline", isUrgent: true, location: "Edunext" },
];

export const MOCK_LESSONS: Lesson[] = [
    { id: "l1", subjectId: "s1", title: "Chương 4 – Đạo hàm", type: "video", score: 8.5 },
    { id: "l2", subjectId: "s2", title: "Phân tích tác phẩm Vợ Nhặt", type: "reading" },
];
