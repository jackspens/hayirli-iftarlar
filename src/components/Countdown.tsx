import React, { useEffect, useState } from 'react';
import { NextEvent, formatDuration } from '../utils/timeTracker';
import { Clock } from 'lucide-react';
import clsx from 'clsx';

export const Countdown: React.FC<{ event: NextEvent | null }> = ({ event }) => {
    const [timeLeft, setTimeLeft] = useState(event?.diffSeconds || 0);

    useEffect(() => {
        if (!event) return;
        setTimeLeft(event.diffSeconds);

        const interval = setInterval(() => {
            setTimeLeft((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(interval);
    }, [event]);

    if (!event) {
        return (
            <div className="glass-panel p-8 text-center mt-6">
                <h2 className="text-2xl font-bold text-ramadan-300">Ramazan Bayramı Mübarek Olsun!</h2>
                <p className="text-slate-400 mt-2">Bu seneki Ramazan ayını tamamladık.</p>
            </div>
        );
    }

    const { h, m, s } = formatDuration(timeLeft);
    const isIftar = event.type === 'aksam';

    return (
        <div className={clsx(
            "glass-panel p-6 sm:p-10 text-center relative overflow-hidden transition-all duration-500",
            isIftar ? "border-ramadan-500/30" : "border-cyan-500/30"
        )}>
            {/* Background Glow */}
            <div className={clsx(
                "absolute -inset-2 opacity-20 blur-3xl rounded-full pointer-events-none transition-all duration-1000",
                isIftar ? "bg-ramadan-500" : "bg-cyan-500"
            )} />

            <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-4 text-slate-300 font-medium">
                    <Clock size={18} className={isIftar ? "text-ramadan-400" : "text-cyan-400"} />
                    <span className="uppercase tracking-wider text-xs sm:text-sm">{event.label}</span>
                </div>

                <div className="flex justify-center items-baseline gap-2 sm:gap-4 font-bold tabular-nums tracking-tight">
                    <div className="flex flex-col items-center">
                        <span className={clsx("text-5xl sm:text-7xl", isIftar ? "text-ramadan-300" : "text-cyan-300")}>{h}</span>
                        <span className="text-xs sm:text-sm text-slate-500 font-medium uppercase mt-2">Saat</span>
                    </div>
                    <span className="text-4xl sm:text-5xl text-slate-600 self-start mt-2 sm:mt-4">:</span>
                    <div className="flex flex-col items-center">
                        <span className={clsx("text-5xl sm:text-7xl", isIftar ? "text-ramadan-300" : "text-cyan-300")}>{m}</span>
                        <span className="text-xs sm:text-sm text-slate-500 font-medium uppercase mt-2">Dakika</span>
                    </div>
                    <span className="text-4xl sm:text-5xl text-slate-600 self-start mt-2 sm:mt-4">:</span>
                    <div className="flex flex-col items-center">
                        <span className={clsx("text-5xl sm:text-7xl", isIftar ? "text-ramadan-300" : "text-cyan-300")}>{s}</span>
                        <span className="text-xs sm:text-sm text-slate-500 font-medium uppercase mt-2">Saniye</span>
                    </div>
                </div>

                <div className="mt-8 text-sm sm:text-base text-slate-400">
                    İstanbul için planlanan vakit: <strong className="text-slate-200">{event.timeStr}</strong>
                </div>
            </div>
        </div>
    );
};
