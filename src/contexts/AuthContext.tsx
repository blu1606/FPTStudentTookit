"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const sessionUser = session?.user ?? null;
                setUser(sessionUser);

                // Failsafe: if a real user is logged in, destroy any lingering guest_mode cookie
                if (sessionUser && typeof document !== 'undefined') {
                    document.cookie = "guest_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                }
            } catch (error) {
                console.error("Error checking auth session:", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                const sessionUser = session?.user ?? null;
                setUser(sessionUser);

                if (sessionUser && typeof document !== 'undefined') {
                    document.cookie = "guest_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase.auth]);

    const signOut = async () => {
        try {
            if (typeof document !== 'undefined') {
                document.cookie = "guest_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }
            await supabase.auth.signOut();
            router.push("/auth/login");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
