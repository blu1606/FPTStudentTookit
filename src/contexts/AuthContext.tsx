"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type AuthContextType = {
    user: User | null;
    isGuest: boolean;
    setIsGuest: (val: boolean) => void;
    isLoading: boolean;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isGuest, setIsGuest] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const sessionUser = session?.user ?? null;
                console.log("AuthContext: sessionUser", sessionUser);
                setUser(sessionUser);

                const hasGuestCookie = typeof document !== 'undefined' && document.cookie.includes('guest_mode=true');
                console.log("AuthContext: hasGuestCookie", hasGuestCookie);

                // Failsafe: if a real user is logged in, destroy any lingering guest_mode cookie
                if (sessionUser && typeof document !== 'undefined') {
                    document.cookie = "guest_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    setIsGuest(false);
                } else if (hasGuestCookie) {
                    setIsGuest(true);
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
                    setIsGuest(false);
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
            setIsGuest(false);
            await supabase.auth.signOut();
            router.push("/auth/login");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isGuest, setIsGuest, isLoading, signOut }}>
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
