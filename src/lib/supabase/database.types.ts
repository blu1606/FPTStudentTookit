export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
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
            // Stub for other tables. We can generate strict types later using Supabase CLI
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
