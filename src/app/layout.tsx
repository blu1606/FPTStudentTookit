import type { Metadata } from "next";
import { Lexend, Noto_Sans, Nunito } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { TasksProvider } from "@/contexts/TasksContext";
import { PlannerProvider } from "@/contexts/PlannerContext";
import { AcademicProvider } from "@/contexts/AcademicContext";
import { MoodProvider } from "@/contexts/MoodContext";
import { CommunityProvider } from "@/contexts/CommunityContext";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Smart Time Management - Học Ít Hơn, Hiểu Nhiều Hơn",
  description: "Bộ công cụ quản lý thời gian tối ưu dành riêng cho sinh viên Đại học FPT để chinh phục mọi deadline và nâng cao GPA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Material Icons Round */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${lexend.variable} ${notoSans.variable} ${nunito.variable} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 antialiased overflow-x-hidden transition-colors duration-300 font-display min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <TasksProvider>
              <PlannerProvider>
                <AcademicProvider>
                  <MoodProvider>
                    <CommunityProvider>
                      {children}
                    </CommunityProvider>
                  </MoodProvider>
                </AcademicProvider>
              </PlannerProvider>
            </TasksProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
