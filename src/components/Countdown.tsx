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

    // User requested orange for iftar, so we'll map aksam to orange.
    // We'll keep imsak as blue/cyan.
    const borderClass = isIftar ? "border-orange-500/50" : "border-cyan-500/30";
    const glowClass = isIftar ? "bg-orange-500" : "bg-cyan-500";
    const textClass = isIftar ? "text-orange-400" : "text-cyan-300";
    const titleIconClass = isIftar ? "text-orange-500" : "text-cyan-400";

    return (
        <div className={clsx(
            "glass-panel text-center relative overflow-hidden transition-all duration-500",
            isPrimary ? "p-6 sm:p-10" : "p-4 sm:p-6 opacity-90 scale-95",
            borderClass
        )}>
            {/* Background Glow */}
            <div className={clsx(
                "absolute -inset-2 blur-3xl rounded-full pointer-events-none transition-all duration-1000",
                isPrimary ? "opacity-20" : "opacity-10",
                glowClass,
                isPrimary && "animate-soft-pulse"
            )} />

            <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-4 text-slate-300 font-medium">
                    <Clock size={isPrimary ? 18 : 14} className={titleIconClass} />
                    <span className="uppercase tracking-wider text-xs sm:text-sm">{event.label}</span>
                </div>

                <div className="flex justify-center items-baseline gap-2 sm:gap-4 font-bold tabular-nums tracking-tight">
                    <div className="flex flex-col items-center">
                        <span className={clsx(isPrimary ? "text-5xl sm:text-7xl" : "text-4xl sm:text-5xl", textClass)}>{h}</span>
                        <span className="text-[10px] sm:text-xs text-slate-500 font-medium uppercase mt-1 sm:mt-2">Saat</span>
                    </div>
                    <span className={clsx(isPrimary ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl", "text-slate-600 self-start mt-1 sm:mt-2")}>:</span>
                    <div className="flex flex-col items-center">
                        <span className={clsx(isPrimary ? "text-5xl sm:text-7xl" : "text-4xl sm:text-5xl", textClass)}>{m}</span>
                        <span className="text-[10px] sm:text-xs text-slate-500 font-medium uppercase mt-1 sm:mt-2">Dk</span>
                    </div>
                    <span className={clsx(isPrimary ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl", "text-slate-600 self-start mt-1 sm:mt-2")}>:</span>
                    <div className="flex flex-col items-center">
                        <span className={clsx(isPrimary ? "text-5xl sm:text-7xl" : "text-4xl sm:text-5xl", textClass)}>{s}</span>
                        <span className="text-[10px] sm:text-xs text-slate-500 font-medium uppercase mt-1 sm:mt-2">Sn</span>
                    </div>
                </div>

                {isPrimary && (
                    <div className="mt-6 sm:mt-8 text-xs sm:text-sm text-slate-400">
                        Hedef Vakit: <strong className="text-slate-200">{event.timeStr}</strong>
                    </div>
                )}
            </div>
        </div>
    );
};
