"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./AuthContext";

export type MoodEntry = {
    id: string;
    user_id: string;
    mood_type: string;
    score: number;
    note?: string;
    recorded_at: string;
};

type MoodContextType = {
    moodEntries: MoodEntry[];
    isLoading: boolean;
    error: string | null;
    addMoodEntry: (entry: Omit<MoodEntry, "id" | "user_id" | "recorded_at">) => Promise<void>;
};

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export function MoodProvider({ children }: { children: React.ReactNode }) {
    const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const supabase = createClient();

    useEffect(() => {
        async function fetchMoods() {
            try {
                // Check if we should use mock data
                let useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";
                if (typeof document !== 'undefined') {
                    const isGuest = document.cookie.includes('guest_mode=true');
                    if (isGuest) useMockData = true;
                }

                if (useMockData || !user) {
                    setMoodEntries([
                        {
                            id: "mock-1",
                            user_id: "mock",
                            mood_type: "Hào hứng 🤩",
                            score: 8,
                            note: "Hoàn thành bài tập sớm.",
                            recorded_at: new Date().toISOString()
                        }
                    ]);
                    setIsLoading(false);
                    return;
                }

                const { data, error } = await supabase
                    .from("mood_entries")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("recorded_at", { ascending: false });

                if (error) throw error;
                setMoodEntries(data || []);
            } catch (err: any) {
                console.error("Error fetching mood entries:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchMoods();
    }, [user, supabase]);

    const addMoodEntry = async (entry: Omit<MoodEntry, "id" | "user_id" | "recorded_at">) => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from("mood_entries")
                .insert([{ ...entry, user_id: user.id }])
                .select()
                .single();

            if (error) throw error;
            setMoodEntries(prev => [data, ...prev]);
        } catch (err: any) {
            console.error("Error adding mood entry:", err);
            throw err;
        }
    };

    return (
        <MoodContext.Provider value={{ moodEntries, isLoading, error, addMoodEntry }}>
            {children}
        </MoodContext.Provider>
    );
}

export function useMood() {
    const context = useContext(MoodContext);
    if (context === undefined) {
        throw new Error("useMood must be used within a MoodProvider");
    }
    return context;
}
