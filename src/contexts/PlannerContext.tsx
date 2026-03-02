"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { CalendarEvent, MOCK_CALENDAR_EVENTS, CalendarEventType } from "@/lib/mock-data";
import { useAuth } from "./AuthContext";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";

type PlannerContextType = {
    events: CalendarEvent[];
    isLoading: boolean;
    setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
    addEvent: (event: CalendarEvent) => Promise<void>;
    updateEvent: (updatedEvent: CalendarEvent) => Promise<void>;
    deleteEvent: (eventId: string) => Promise<void>;
};

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export function PlannerProvider({ children }: { children: ReactNode }) {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();
    const supabase = createClient();

    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

    useEffect(() => {
        async function fetchEvents() {
            setIsLoading(true);

            const isGuest = typeof document !== 'undefined' && document.cookie.includes('guest_mode=true');

            console.log("[fetchEvents] useMockData:", useMockData, "| isGuest:", isGuest, "| auth user:", !!user);

            if (useMockData || isGuest) {
                console.log("[fetchEvents] Fetching Mock Data / LocalStorage");
                // Delay to simulate network
                setTimeout(() => {
                    const saved = localStorage.getItem("planner_events");
                    if (saved) {
                        try {
                            const parsed = JSON.parse(saved);
                            const hydrated = parsed.map((e: any) => ({
                                ...e,
                                startTime: new Date(e.startTime),
                                endTime: new Date(e.endTime)
                            }));
                            setEvents(hydrated);
                        } catch (e) {
                            console.error("Failed to parse local events", e);
                            setEvents(MOCK_CALENDAR_EVENTS);
                        }
                    } else {
                        setEvents(MOCK_CALENDAR_EVENTS);
                    }
                    setIsLoading(false);
                }, 500);

                return;
            }

            if (!user) {
                setEvents([]);
                setIsLoading(false);
                return;
            }

            try {
                const { data, error } = await (supabase
                    .from("events") as any)
                    .select("*")
                    .eq("user_id", user.id)
                    .order("start_time", { ascending: true });


                console.log("[fetchEvents] Supabase Response -> Error:", error, "| Data array length:", data?.length);

                if (error) throw error;

                if (data) {
                    // Map DB format to CalendarEvent format
                    const mappedEvents: CalendarEvent[] = data.map((d: any) => {
                        // Ensure ISO format for Safari compatibility by replacing space with 'T'
                        const safeStartTime = d.start_time.replace(' ', 'T');
                        const safeEndTime = d.end_time.replace(' ', 'T');

                        const start = new Date(safeStartTime);
                        const end = new Date(safeEndTime);
                        const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

                        // Map "Class" -> "class"
                        const clientType = d.type ? d.type.toLowerCase() : "other";

                        return {
                            id: d.id,
                            title: d.title,
                            date: format(start, "yyyy-MM-dd"),
                            startHour: start.getHours() + (start.getMinutes() / 60),
                            durationHours: durationHours,
                            startTime: start,
                            endTime: end,
                            type: clientType as CalendarEventType,
                            location: d.location || undefined,
                        };

                    });
                    setEvents(mappedEvents);
                }
            } catch (err) {
                console.error("Error fetching events:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchEvents();
    }, [user, useMockData, supabase]);

    // Save to local storage when using mock data
    useEffect(() => {
        const isGuest = typeof document !== 'undefined' && document.cookie.includes('guest_mode=true');
        if (!isLoading && (useMockData || isGuest)) {
            localStorage.setItem("planner_events", JSON.stringify(events));
        }
    }, [events, isLoading, useMockData]);

    const addEvent = async (event: CalendarEvent) => {
        if (useMockData) {
            setEvents((prev) => [...prev, event]);
            return;
        }

        if (!user) return;

        try {
            const [year, month, day] = event.date.split('-').map(Number);
            const startHours = Math.floor(event.startHour);
            const startMinutes = Math.round((event.startHour - startHours) * 60);

            const startTime = new Date(year, month - 1, day, startHours, startMinutes, 0);
            const endTime = new Date(startTime.getTime() + event.durationHours * 60 * 60 * 1000);

            // Map UI event types to DB Enum appropriately.
            let dbType = event.type as string;
            if (["class", "study", "exam", "other"].includes(dbType)) {
                dbType = dbType.charAt(0).toUpperCase() + dbType.slice(1);
            }

            const payload = {
                user_id: user.id,
                title: event.title,
                type: dbType,
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString(),
                location: event.location,
            };
            console.log("[addEvent] PAYLOAD TO SUPABASE:", payload);

            const { data, error } = await (supabase.from("events") as any).insert(payload).select().single();


            console.log("[addEvent] Supabase Insert Response -> Error:", error, "| Data:", data);

            if (error) {
                console.error("Supabase returned error object:", JSON.stringify(error, null, 2));
                throw error;
            }

            if (data) {
                const safeStartTime = data.start_time.replace(' ', 'T');
                const safeEndTime = data.end_time.replace(' ', 'T');

                const start = new Date(safeStartTime);
                const end = new Date(safeEndTime);

                const clientType = data.type ? data.type.toLowerCase() : "other";

                const newEvent: CalendarEvent = {
                    id: data.id,
                    title: data.title,
                    date: format(start, "yyyy-MM-dd"),
                    startHour: start.getHours() + (start.getMinutes() / 60),
                    durationHours: (end.getTime() - start.getTime()) / (1000 * 60 * 60),
                    startTime: start,
                    endTime: end,
                    type: clientType as CalendarEventType,
                    location: data.location || undefined,
                };

                setEvents((prev) => [...prev, newEvent]);
            }
        } catch (err) {
            console.error("Error adding event:", err);
        }
    };

    const updateEvent = async (updatedEvent: CalendarEvent) => {
        if (useMockData) {
            setEvents((prev) =>
                prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
            );
            return;
        }

        if (!user) return;

        try {
            const [year, month, day] = updatedEvent.date.split('-').map(Number);
            const startHours = Math.floor(updatedEvent.startHour);
            const startMinutes = Math.round((updatedEvent.startHour - startHours) * 60);

            const startTime = new Date(year, month - 1, day, startHours, startMinutes, 0);
            const endTime = new Date(startTime.getTime() + updatedEvent.durationHours * 60 * 60 * 1000);

            // Map UI event types to DB Enum appropriately.
            let dbType = updatedEvent.type as string;
            if (["class", "study", "exam", "other"].includes(dbType)) {
                dbType = dbType.charAt(0).toUpperCase() + dbType.slice(1);
            }

            const { error } = await (supabase
                .from("events") as any)
                .update({
                    title: updatedEvent.title,
                    type: dbType,
                    start_time: startTime.toISOString(),
                    end_time: endTime.toISOString(),
                    location: updatedEvent.location,
                })
                .eq("id", updatedEvent.id)
                .eq("user_id", user.id);


            if (error) throw error;
            setEvents((prev) =>
                prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
            );
        } catch (err) {
            console.error("Error updating event:", err);
        }
    };

    const deleteEvent = async (eventId: string) => {
        if (useMockData) {
            setEvents((prev) => prev.filter((e) => e.id !== eventId));
            return;
        }

        if (!user) return;

        try {
            const { error } = await (supabase
                .from("events") as any)
                .delete()
                .eq("id", eventId)
                .eq("user_id", user.id);


            if (error) throw error;
            setEvents((prev) => prev.filter((e) => e.id !== eventId));
        } catch (err) {
            console.error("Error deleting event:", err);
        }
    };

    return (
        <PlannerContext.Provider
            value={{
                events,
                isLoading,
                setEvents,
                addEvent,
                updateEvent,
                deleteEvent,
            }}
        >
            {children}
        </PlannerContext.Provider>
    );
}

export function usePlanner() {
    const context = useContext(PlannerContext);
    if (context === undefined) {
        throw new Error("usePlanner must be used within a PlannerProvider");
    }
    return context;
}
