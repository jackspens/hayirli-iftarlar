import React, { useEffect, useState } from 'react';
import { NextEvent, formatDuration } from '../utils/timeTracker';
import { Clock } from 'lucide-react';
import clsx from 'clsx';

export const Countdown = ({ event, isPrimary }: { event: NextEvent; isPrimary?: boolean }) => {
    const [timeLeft, setTimeLeft] = useState(event.diffSeconds);

    useEffect(() => {
        setTimeLeft(event.diffSeconds);
        const interval = setInterval(() => {
            setTimeLeft((prev: number) => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(interval);
    }, [event]);

    const { h, m, s } = formatDuration(timeLeft);
    const isIftar = event.type === 'aksam';

    // Solid Dark Theme: Remove the bright green glow to achieve the "dark" look requested.
    const borderClass = isIftar ? "border-emerald-500/30" : "border-cyan-500/30";
    const glowClass = isIftar ? "bg-emerald-950/40" : "bg-cyan-900/20";
    const textClass = isIftar ? "text-emerald-400" : "text-cyan-300";
    const titleIconClass = isIftar ? "text-emerald-500/80" : "text-cyan-400";

    return (
        <div className={clsx(
            "text-center relative overflow-hidden transition-all duration-500 rounded-3xl border shadow-2xl",
            isIftar ? "bg-[#020617] border-emerald-500/20 shadow-emerald-950/20" : "glass-panel",
            isPrimary ? "p-6 sm:p-8" : "p-3 sm:p-4 opacity-90 scale-95",
            borderClass
        )}>
            {/* Background Glow */}
            <div className={clsx(
                "absolute -inset-4 blur-[80px] rounded-full pointer-events-none transition-all duration-1000",
                isPrimary ? "opacity-25" : "opacity-10",
                glowClass,
                isPrimary && "animate-soft-pulse"
            )} />

            <div className="relative z-10">
                <div className={clsx(
                    "flex items-center justify-center gap-2 mb-4 font-bold",
                    isIftar ? "text-emerald-500/70" : "text-slate-400/80"
                )}>
                    <Clock size={isPrimary ? 18 : 14} className={titleIconClass} />
                    <span className="uppercase tracking-[0.2em] text-[10px] sm:text-xs">{event.label}</span>
                </div>

                <div className="flex justify-center items-baseline gap-2 sm:gap-4 font-black tabular-nums tracking-tighter">
                    <div className="flex flex-col items-center">
                        <span className={clsx(isPrimary ? "text-5xl sm:text-7xl" : "text-3xl sm:text-4xl", textClass)}>{h}</span>
                        <span className={clsx("text-[10px] sm:text-xs font-bold uppercase mt-1 sm:mt-2 tracking-widest text-slate-500")}>Saat</span>
                    </div>
                    <span className={clsx(isPrimary ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl", "self-start mt-1 sm:mt-2 text-slate-600")}>:</span>
                    <div className="flex flex-col items-center">
                        <span className={clsx(isPrimary ? "text-5xl sm:text-7xl" : "text-3xl sm:text-4xl", textClass)}>{m}</span>
                        <span className={clsx("text-[10px] sm:text-xs font-bold uppercase mt-1 sm:mt-2 tracking-widest text-slate-500")}>Dk</span>
                    </div>
                    <span className={clsx(isPrimary ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl", "self-start mt-1 sm:mt-2 text-slate-600")}>:</span>
                    <div className="flex flex-col items-center">
                        <span className={clsx(isPrimary ? "text-5xl sm:text-7xl" : "text-3xl sm:text-4xl", textClass)}>{s}</span>
                        <span className={clsx("text-[10px] sm:text-xs font-bold uppercase mt-1 sm:mt-2 tracking-widest text-slate-500")}>Sn</span>
                    </div>
                </div>

                {isPrimary && (
                    <div className="mt-6 sm:mt-8 flex flex-col items-center pb-2">
                        <span className={clsx("text-sm sm:text-base font-medium tracking-wide mb-1", isIftar ? "text-emerald-500/50" : "text-slate-400")}>İftar vakti</span>
                        <strong className={clsx("text-4xl sm:text-5xl font-black", isIftar ? "text-amber-400" : "text-slate-200")}>
                            {event.timeStr}
                        </strong>
                    </div>
                )}
            </div>
        </div>
    );
};
