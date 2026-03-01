import { useEffect, useState } from 'react';
import { NextEvent, formatDuration } from '../utils/timeTracker';
import { Clock } from 'lucide-react';
import clsx from 'clsx';

export const Countdown = ({ event, isPrimary }: { event: NextEvent; isPrimary?: boolean }) => {
    const [timeLeft, setTimeLeft] = useState(event.diffSeconds);

    useEffect(() => {
        setTimeLeft(event.diffSeconds);
        const interval = setInterval(() => {
            setTimeLeft((prev) => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(interval);
    }, [event]);

    const { h, m, s } = formatDuration(timeLeft);
    const isIftar = event.type === 'aksam';

    // Greenish theme with black text for iftar, as requested.
    const borderClass = isIftar ? "border-emerald-500/50" : "border-cyan-500/30";
    const glowClass = isIftar ? "bg-emerald-500" : "bg-cyan-500";
    const textClass = isIftar ? "text-slate-950" : "text-cyan-300";
    const titleIconClass = isIftar ? "text-emerald-900" : "text-cyan-400";

    return (
        <div className={clsx(
            "text-center relative overflow-hidden transition-all duration-500 rounded-2xl border shadow-xl",
            isIftar ? "bg-emerald-400" : "glass-panel",
            isPrimary ? "p-6 sm:p-10" : "p-4 sm:p-6 opacity-90 scale-95",
            borderClass
        )}>
            {/* Background Glow */}
            <div className={clsx(
                "absolute -inset-2 blur-3xl rounded-full pointer-events-none transition-all duration-1000",
                isPrimary ? "opacity-30" : "opacity-10",
                glowClass,
                isPrimary && "animate-soft-pulse"
            )} />

            <div className="relative z-10">
                <div className={clsx(
                    "flex items-center justify-center gap-2 mb-4 font-bold",
                    isIftar ? "text-slate-900" : "text-slate-300"
                )}>
                    <Clock size={isPrimary ? 18 : 14} className={titleIconClass} />
                    <span className="uppercase tracking-wider text-xs sm:text-sm">{event.label}</span>
                </div>

                <div className="flex justify-center items-baseline gap-2 sm:gap-4 font-black tabular-nums tracking-tight">
                    <div className="flex flex-col items-center">
                        <span className={clsx(isPrimary ? "text-5xl sm:text-7xl" : "text-4xl sm:text-5xl", textClass)}>{h}</span>
                        <span className={clsx("text-[10px] sm:text-xs font-bold uppercase mt-1 sm:mt-2", isIftar ? "text-slate-800" : "text-slate-500")}>Saat</span>
                    </div>
                    <span className={clsx(isPrimary ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl", "self-start mt-1 sm:mt-2", isIftar ? "text-slate-900" : "text-slate-600")}>:</span>
                    <div className="flex flex-col items-center">
                        <span className={clsx(isPrimary ? "text-5xl sm:text-7xl" : "text-4xl sm:text-5xl", textClass)}>{m}</span>
                        <span className={clsx("text-[10px] sm:text-xs font-bold uppercase mt-1 sm:mt-2", isIftar ? "text-slate-800" : "text-slate-500")}>Dk</span>
                    </div>
                    <span className={clsx(isPrimary ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl", "self-start mt-1 sm:mt-2", isIftar ? "text-slate-900" : "text-slate-600")}>:</span>
                    <div className="flex flex-col items-center">
                        <span className={clsx(isPrimary ? "text-5xl sm:text-7xl" : "text-4xl sm:text-5xl", textClass)}>{s}</span>
                        <span className={clsx("text-[10px] sm:text-xs font-bold uppercase mt-1 sm:mt-2", isIftar ? "text-slate-800" : "text-slate-500")}>Sn</span>
                    </div>
                </div>

                {isPrimary && (
                    <div className="mt-6 sm:mt-8 flex flex-col items-center">
                        <span className={clsx("text-lg sm:text-2xl font-bold", isIftar ? "text-slate-900" : "text-slate-400")}>İftar vakti</span>
                        <strong className={clsx("text-2xl sm:text-4xl font-black", isIftar ? "text-slate-950" : "text-slate-200")}>{event.timeStr}</strong>
                    </div>
                )}
            </div>
        </div>
    );
};
