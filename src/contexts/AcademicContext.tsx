"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Subject, Lesson, MOCK_SUBJECTS, MOCK_LESSONS, LessonType } from "@/lib/mock-data";
import { useAuth } from "./AuthContext";
import { createClient } from "@/lib/supabase/client";

type AcademicContextType = {
    subjects: Subject[];
    lessons: Lesson[];
    isLoading: boolean;
    setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>;
    addLesson: (lesson: Omit<Lesson, "id">) => Promise<void>;
    deleteLesson: (lessonId: string) => Promise<void>;
    addSubject: (name: string, code: string) => Promise<Subject | null>;
};

const AcademicContext = createContext<AcademicContextType | undefined>(undefined);

export function AcademicProvider({ children }: { children: ReactNode }) {
    const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { user } = useAuth();
    const supabase = createClient();
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);

            const isGuest = typeof document !== 'undefined' && document.cookie.includes('guest_mode=true');

            if (useMockData || isGuest) {
                // Return static mocks or loaded from localStorage
                setTimeout(() => {
                    const savedLessons = localStorage.getItem("planner_lessons");
                    const savedSubjects = localStorage.getItem("planner_subjects");

                    if (savedLessons) {
                        try {
                            setLessons(JSON.parse(savedLessons));
                        } catch (e) {
                            console.error("Failed to parse local lessons", e);
                            setLessons(MOCK_LESSONS);
                        }
                    } else {
                        setLessons(MOCK_LESSONS);
                    }

                    if (savedSubjects) {
                        try {
                            setSubjects(JSON.parse(savedSubjects));
                        } catch (e) {
                            console.error("Failed to parse local subjects", e);
                            setSubjects(MOCK_SUBJECTS);
                        }
                    } else {
                        setSubjects(MOCK_SUBJECTS);
                    }
                    setIsLoading(false);
                }, 500);
                return;
            }

            if (!user) {
                setLessons([]);
                setSubjects([]);
                setIsLoading(false);
                return;
            }

            try {
                // Fetch Subjects
                const { data: subjectData, error: subErr } = await (supabase
                    .from("subjects") as any)
                    .select("*")
                    .eq("user_id", user.id);


                if (subErr) throw subErr;

                // Fetch Lessons
                const { data: lessonData, error: lesErr } = await (supabase
                    .from("lessons") as any)
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false });


                if (lesErr) throw lesErr;

                if (lessonData) {
                    const mappedLessons: Lesson[] = lessonData.map((d: any) => ({
                        id: d.id,
                        subjectId: d.subject_id,
                        title: d.title,
                        type: d.type as LessonType,
                        score: d.score ? Number(d.score) : undefined,
                        notes: d.notes || undefined,
                        completed_at: d.completed_at || undefined,
                        created_at: d.created_at || undefined,
                    }));
                    setLessons(mappedLessons);
                }

                if (subjectData && subjectData.length > 0) {
                    const mappedSubjects: Subject[] = subjectData.map((s: any) => {
                        // Calculate stats for this subject based on lessons
                        const subjLessons = lessonData ? lessonData.filter((l: any) => l.subject_id === s.id) : [];
                        const count = subjLessons.length;
                        // Example progress logic: 10% per lesson up to 100%
                        const progress = Math.min(count * 10, 100);

                        return {
                            id: s.id,
                            name: s.name,
                            code: s.code || "",
                            bg: s.color_class ? s.color_class.replace('text-', 'bg-').replace('600', '100') + " dark:bg-gray-800" : "bg-orange-50 dark:bg-orange-900/10",
                            text: s.color_class || "text-primary",
                            icon: s.icon || "book",
                            progress: progress,
                        };

                    });
                    setSubjects(mappedSubjects);
                } else {
                    setSubjects([]);
                }

            } catch (err) {
                console.error("Error fetching academic data:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [user, useMockData, supabase]);

    // Save to local storage whenever data changes in mock/guest mode
    useEffect(() => {
        const isGuest = typeof document !== 'undefined' && document.cookie.includes('guest_mode=true');
        if (!isLoading && (useMockData || isGuest)) {
            localStorage.setItem("planner_lessons", JSON.stringify(lessons));
            localStorage.setItem("planner_subjects", JSON.stringify(subjects));
        }
    }, [lessons, subjects, isLoading, useMockData]);

    const addLesson = async (lesson: Omit<Lesson, "id">) => {
        const isGuest = typeof document !== 'undefined' && document.cookie.includes('guest_mode=true');
        if (useMockData || isGuest) {
            const newLesson = { ...lesson, id: `l-${Date.now()}` };
            setLessons((prev) => [newLesson, ...prev]);
            return;
        }

        if (!user) return;

        try {
            const { data, error } = await (supabase.from("lessons") as any).insert({
                user_id: user.id,
                subject_id: lesson.subjectId,
                title: lesson.title,
                type: lesson.type,
                score: lesson.score ?? null,
                notes: lesson.notes ?? null,
                completed_at: lesson.completed_at || new Date().toISOString(),
            }).select().single();


            if (error) throw error;

            if (data) {
                const newLesson: Lesson = {
                    id: data.id,
                    subjectId: data.subject_id,
                    title: data.title,
                    type: data.type as LessonType,
                    score: data.score ? Number(data.score) : undefined,
                    notes: data.notes || undefined,
                    completed_at: data.completed_at || undefined,
                    created_at: data.created_at || undefined,
                };
                setLessons((prev) => [newLesson, ...prev]);
            }
        } catch (err) {
            console.error("Error adding lesson:", err);
        }
    };

    const addSubject = async (name: string, code: string): Promise<Subject | null> => {
        const isGuest = typeof document !== 'undefined' && document.cookie.includes('guest_mode=true');
        if (useMockData || isGuest) {
            const newSubject: Subject = {
                id: `s-${Date.now()}`,
                name,
                code,
                bg: "bg-blue-50 dark:bg-blue-900/10",
                text: "text-blue-500",
                icon: "book",
                progress: 0,
            };

            setSubjects((prev) => [...prev, newSubject]);
            return newSubject;
        }

        if (!user) return null;

        try {
            const { data, error } = await (supabase.from("subjects") as any).insert({
                user_id: user.id,
                name,
                code: code ?? null,
                color_class: "text-primary",
                icon: "book"
            }).select().single();


            if (error) throw error;

            if (data) {
                const newSubject: Subject = {
                    id: data.id,
                    name: data.name,
                    code: data.code || "",
                    bg: data.color_class ? data.color_class.replace('text-', 'bg-').replace('600', '100') + " dark:bg-gray-800" : "bg-orange-50 dark:bg-orange-900/10",
                    text: data.color_class || "text-primary",
                    icon: data.icon || "book",
                    progress: 0,
                };

                setSubjects((prev) => [...prev, newSubject]);
                return newSubject;
            }
        } catch (err) {
            console.error("Error adding subject:", err);
            return null;
        }
        return null;
    };

    const deleteLesson = async (lessonId: string) => {
        const isGuest = typeof document !== 'undefined' && document.cookie.includes('guest_mode=true');
        if (useMockData || isGuest) {
            setLessons((prev) => prev.filter((l) => l.id !== lessonId));
            return;
        }

        if (!user) return;

        try {
            const { error } = await (supabase
                .from("lessons") as any)
                .delete()
                .eq("id", lessonId)
                .eq("user_id", user.id);


            if (error) throw error;
            setLessons((prev) => prev.filter((l) => l.id !== lessonId));
        } catch (err) {
            console.error("Error deleting lesson:", err);
        }
    };

    return (
        <AcademicContext.Provider
            value={{
                subjects,
                lessons,
                isLoading,
                setLessons,
                addLesson,
                deleteLesson,
                addSubject,
            }}
        >
            {children}
        </AcademicContext.Provider>
    );
}

export function useAcademic() {
    const context = useContext(AcademicContext);
    if (context === undefined) {
        throw new Error("useAcademic must be used within an AcademicProvider");
    }
    return context;
}
