"use client";

import { useState, useEffect } from "react";

type BreathingModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function BreathingModal({ isOpen, onClose }: BreathingModalProps) {
    const [step, setStep] = useState<"select_time" | "breathing">("select_time");
    const [duration, setDuration] = useState<number>(5); // minutes
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [phase, setPhase] = useState<"Hít vào" | "Giữ" | "Thở ra">("Hít vào");
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setStep("select_time");
            setTimeLeft(0);
            setIsActive(false);
            return;
        }

        if (step === "breathing" && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);

                // Breathing cycle: 4s inhale, 4s hold, 4s exhale
                const cycleTime = timeLeft % 12;
                if (cycleTime >= 8) {
                    setPhase("Hít vào");
                } else if (cycleTime >= 4) {
                    setPhase("Giữ");
                } else {
                    setPhase("Thở ra");
                }
            }, 1000);
            return () => clearInterval(timer);
        } else if (step === "breathing" && timeLeft <= 0) {
            setStep("select_time");
            setIsActive(false);
        }
    }, [isOpen, step, timeLeft]);

    if (!isOpen) return null;

    const startBreathing = (mins: number) => {
        setDuration(mins);
        setTimeLeft(mins * 60);
        setStep("breathing");
        setPhase("Hít vào");
        setIsActive(true);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-gray-800 w-full max-w-md p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden fade-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors z-10 flex items-center justify-center"
                >
                    <span className="material-icons-round text-sm">close</span>
                </button>

                {step === "select_time" ? (
                    <div className="text-center relative z-10 fade-in">
                        <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-green-50 dark:ring-green-900/10">
                            <span className="material-icons-round text-4xl">self_improvement</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Cool Down Menu</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 px-4 leading-relaxed">
                            Chọn khoảng thời gian để bắt đầu bài tập thở, giúp bạn lấy lại sự tĩnh tâm và giải tỏa căng thẳng.
                        </p>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            {[1, 3, 5].map((mins) => (
                                <button
                                    key={mins}
                                    onClick={() => startBreathing(mins)}
                                    className="p-4 rounded-2xl border-2 border-green-100 dark:border-green-800/30 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 active:scale-95 transition-all group group-hover:shadow-md flex flex-col items-center justify-center gap-1"
                                >
                                    <span className="text-2xl font-black text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">{mins}</span>
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">phút</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-6 relative z-10 fade-in flex flex-col items-center justify-center min-h-[320px]">
                        <div className="inline-flex items-center justify-center bg-gray-100 dark:bg-gray-700 px-4 py-1.5 rounded-full mb-8">
                            <span className="material-icons-round text-gray-500 dark:text-gray-400 text-sm mr-2">timer</span>
                            <span className="text-lg font-bold text-gray-700 dark:text-gray-200 font-mono tracking-widest">{formatTime(timeLeft)}</span>
                        </div>

                        <div className="relative w-56 h-56 mx-auto flex items-center justify-center mb-10">
                            {/* Outer pulsating ring */}
                            <div
                                className={`absolute inset-0 bg-green-400/20 dark:bg-green-500/10 rounded-full transition-all duration-[4000ms] ease-in-out ${phase === 'Hít vào' ? 'scale-[1.3] opacity-0' : phase === 'Giữ' ? 'scale-[1.15] opacity-30' : 'scale-75 opacity-100'}`}
                            ></div>
                            {/* Inner pulsating ring */}
                            <div
                                className={`absolute inset-4 bg-green-400/40 dark:bg-green-500/20 rounded-full transition-all duration-[4000ms] ease-in-out ${phase === 'Hít vào' ? 'scale-110 opacity-50' : phase === 'Giữ' ? 'scale-100 opacity-60' : 'scale-75 opacity-100'}`}
                            ></div>
                            {/* Core circle */}
                            <div className="relative w-36 h-36 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg shadow-green-500/40 flex items-center justify-center z-10 border-4 border-white/20 dark:border-gray-800/50">
                                <span className="text-white font-extrabold text-2xl tracking-widest uppercase origin-center transition-transform duration-700 select-none">
                                    {phase}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setStep("select_time");
                                setIsActive(false);
                            }}
                            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-bold text-sm px-6 py-2.5 rounded-xl transition-colors active:scale-95"
                        >
                            Kết thúc sớm
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
