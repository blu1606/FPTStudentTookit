export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    student_id: string | null
                    avatar_url: string | null
                    created_at: string | null
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    student_id?: string | null
                    avatar_url?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    student_id?: string | null
                    avatar_url?: string | null
                    created_at?: string | null
                }
            }
            events: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    type: string
                    start_time: string
                    end_time: string
                    location: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    type: string
                    start_time: string
                    end_time: string
                    location?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    type?: string
                    start_time?: string
                    end_time?: string
                    location?: string | null
                    created_at?: string
                }
            }
            subjects: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    code: string | null
                    color_class: string | null
                    icon: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    code?: string | null
                    color_class?: string | null
                    icon?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    code?: string | null
                    color_class?: string | null
                    icon?: string | null
                    created_at?: string
                }
            }
            lessons: {
                Row: {
                    id: string
                    user_id: string
                    subject_id: string
                    title: string
                    type: string
                    score: number | null
                    notes: string | null
                    completed_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    subject_id: string
                    title: string
                    type: string
                    score?: number | null
                    notes?: string | null
                    completed_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    subject_id?: string
                    title?: string
                    type?: string
                    score?: number | null
                    notes?: string | null
                    completed_at?: string | null
                    created_at?: string
                }
            }
            tasks: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    subject_id: string
                    priority: string
                    deadline: string
                    status: string
                    description: string | null
                    submitted_on: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    subject_id: string
                    priority: string
                    deadline: string
                    status: string
                    description?: string | null
                    submitted_on?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    subject_id?: string
                    priority?: string
                    deadline?: string
                    status?: string
                    description?: string | null
                    submitted_on?: string | null
                    created_at?: string
                }
            }
            mood_entries: {
                Row: {
                    id: string
                    user_id: string
                    mood_type: string
                    score: number
                    note: string | null
                    recorded_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    mood_type: string
                    score: number
                    note?: string | null
                    recorded_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    mood_type?: string
                    score?: number
                    note?: string | null
                    recorded_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            task_status: "Todo" | "InProgress" | "Done"
            task_priority: "Low" | "Medium" | "High"
            event_type: "Class" | "Study" | "Exam" | "Other"
            subject_status: "Enrolled" | "Passed" | "Failed"
        }
    }
}

