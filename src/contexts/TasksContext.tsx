"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Task, MOCK_TASKS } from "@/lib/mock-data";
import { useAuth } from "./AuthContext";
import { createClient } from "@/lib/supabase/client";

type TasksContextType = {
    tasks: Task[];
    isLoading: boolean;
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    addTask: (task: Task) => Promise<void>;
    updateTask: (updatedTask: Task) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
};

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();
    const supabase = createClient();

    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

    useEffect(() => {
        async function fetchTasks() {
            setIsLoading(true);

            const isGuest = typeof document !== 'undefined' && document.cookie.includes('guest_mode=true');

            if (useMockData || isGuest) {
                // Delay to simulate network
                setTimeout(() => {
                    const saved = localStorage.getItem("planner_tasks");
                    if (saved) {
                        try {
                            const parsed = JSON.parse(saved).map((t: any) => ({
                                ...t,
                                deadline: new Date(t.deadline)
                            }));
                            setTasks(parsed);
                        } catch (e) {
                            console.error("Failed to parse local tasks", e);
                            setTasks(MOCK_TASKS);
                        }
                    } else {
                        setTasks(MOCK_TASKS);
                    }
                    setIsLoading(false);
                }, 500);
                return;
            }

            if (!user) {
                setTasks([]);
                setIsLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from("tasks")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false });

                if (error) throw error;

                if (data) {
                    // Map DB format to Task format
                    const mappedTasks: Task[] = data.map((d: any) => ({
                        id: d.id,
                        title: d.title,
                        subjectId: d.subject_id,
                        priority: d.priority,
                        deadline: new Date(d.deadline),
                        status: d.status,
                        description: d.description || undefined,
                        source: "Tự học", // Default fallback if not in DB
                        submittedOn: d.submitted_on || undefined,
                    }));
                    setTasks(mappedTasks);
                }
            } catch (err) {
                console.error("Error fetching tasks:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchTasks();
    }, [user, useMockData, supabase]);

    // Save to local storage when using mock data
    useEffect(() => {
        const isGuest = typeof document !== 'undefined' && document.cookie.includes('guest_mode=true');
        if (!isLoading && (useMockData || isGuest)) {
            localStorage.setItem("planner_tasks", JSON.stringify(tasks));
        }
    }, [tasks, isLoading, useMockData]);

    const addTask = async (task: Task) => {
        if (useMockData) {
            setTasks((prev) => [...prev, task]);
            return;
        }

        if (!user) return;

        try {
            const { data, error } = await supabase.from("tasks").insert({
                user_id: user.id,
                title: task.title,
                subject_id: task.subjectId,
                priority: task.priority,
                deadline: task.deadline.toISOString(),
                status: task.status,
                description: task.description,
            }).select().single();

            if (error) throw error;

            // Map the returned DB record to our Task type
            if (data) {
                const newTask: Task = {
                    id: data.id,
                    title: data.title,
                    subjectId: data.subject_id,
                    priority: data.priority,
                    deadline: new Date(data.deadline),
                    status: data.status,
                    description: data.description || undefined,
                    source: "Tự học",
                    submittedOn: data.submitted_on || undefined,
                };
                setTasks((prev) => [...prev, newTask]);
            }
        } catch (err) {
            console.error("Error adding task:", err);
        }
    };

    const updateTask = async (updatedTask: Task) => {
        if (useMockData) {
            setTasks((prev) =>
                prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
            );
            return;
        }

        if (!user) return;

        try {
            const { error } = await supabase
                .from("tasks")
                .update({
                    title: updatedTask.title,
                    subject_id: updatedTask.subjectId,
                    priority: updatedTask.priority,
                    deadline: updatedTask.deadline.toISOString(),
                    status: updatedTask.status,
                    description: updatedTask.description,
                })
                .eq("id", updatedTask.id)
                .eq("user_id", user.id);

            if (error) throw error;
            // Optimistic UI update
            setTasks((prev) =>
                prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
            );
        } catch (err) {
            console.error("Error updating task:", err);
        }
    };

    const deleteTask = async (taskId: string) => {
        if (useMockData) {
            setTasks((prev) => prev.filter((task) => task.id !== taskId));
            return;
        }

        if (!user) return;

        try {
            const { error } = await supabase
                .from("tasks")
                .delete()
                .eq("id", taskId)
                .eq("user_id", user.id);

            if (error) throw error;
            // Optimistic UI update
            setTasks((prev) => prev.filter((task) => task.id !== taskId));
        } catch (err) {
            console.error("Error deleting task:", err);
        }
    };

    return (
        <TasksContext.Provider
            value={{
                tasks,
                isLoading,
                setTasks,
                addTask,
                updateTask,
                deleteTask,
            }}
        >
            {children}
        </TasksContext.Provider>
    );
}

export function useTasks() {
    const context = useContext(TasksContext);
    if (context === undefined) {
        throw new Error("useTasks must be used within a TasksProvider");
    }
    return context;
}
