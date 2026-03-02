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

            if (useMockData) {
                // Return static mocks and compute
                setTimeout(() => {
                    setLessons(MOCK_LESSONS);
                    setSubjects(MOCK_SUBJECTS); // Can compute real counts here if needed
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
                const { data: subjectData, error: subErr } = await supabase
                    .from("subjects")
                    .select("*")
                    .eq("user_id", user.id);

                if (subErr) throw subErr;

                // Fetch Lessons
                const { data: lessonData, error: lesErr } = await supabase
                    .from("lessons")
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
                            count: count,
                            colorClass: s.color_class || "text-blue-600",
                            bgColorClass: s.color_class ? s.color_class.replace('text-', 'bg-') : "bg-blue-600",
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

    const addLesson = async (lesson: Omit<Lesson, "id">) => {
        if (useMockData) {
            const newLesson = { ...lesson, id: `l-${Date.now()}` };
            setLessons((prev) => [newLesson, ...prev]);
            return;
        }

        if (!user) return;

        try {
            const { data, error } = await supabase.from("lessons").insert({
                user_id: user.id,
                subject_id: lesson.subjectId,
                title: lesson.title,
                type: lesson.type,
                score: lesson.score,
                notes: lesson.notes,
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
        if (useMockData) {
            const newSubject: Subject = {
                id: `s-${Date.now()}`,
                name,
                count: 0,
                colorClass: "text-blue-600",
                bgColorClass: "bg-blue-600",
                icon: "book",
                progress: 0,
            };
            setSubjects((prev) => [...prev, newSubject]);
            return newSubject;
        }

        if (!user) return null;

        try {
            const { data, error } = await supabase.from("subjects").insert({
                user_id: user.id,
                name,
                code,
                color_class: "text-primary",
                icon: "book"
            }).select().single();

            if (error) throw error;

            if (data) {
                const newSubject: Subject = {
                    id: data.id,
                    name: data.name,
                    count: 0, // No lessons initially
                    colorClass: data.color_class || "text-primary",
                    bgColorClass: data.color_class ? data.color_class.replace('text-', 'bg-') : "bg-primary",
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
        if (useMockData) {
            setLessons((prev) => prev.filter((l) => l.id !== lessonId));
            return;
        }

        if (!user) return;

        try {
            const { error } = await supabase
                .from("lessons")
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
