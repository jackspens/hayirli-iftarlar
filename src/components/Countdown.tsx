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

    // Fancy Modern Green Theme with better contrast and eye-friendly colors.
    // Using a lush emerald-teal gradient for a premium "fancy" look.
    const borderClass = isIftar ? "border-emerald-400/30" : "border-cyan-500/30";
    const glowClass = isIftar ? "bg-emerald-400" : "bg-cyan-500";
    const textClass = isIftar ? "text-slate-950" : "text-cyan-300";
    const titleIconClass = isIftar ? "text-emerald-900/70" : "text-cyan-400";

    return (
        <div className={clsx(
            "text-center relative overflow-hidden transition-all duration-500 rounded-3xl border shadow-2xl",
            isIftar ? "bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 shadow-emerald-900/20" : "glass-panel",
            isPrimary ? "p-8 sm:p-12" : "p-4 sm:p-6 opacity-90 scale-95",
            borderClass
        )}>
            {/* Background Glow */}
            <div className={clsx(
                "absolute -inset-4 blur-[60px] rounded-full pointer-events-none transition-all duration-1000",
                isPrimary ? "opacity-40" : "opacity-10",
                glowClass,
                isPrimary && "animate-soft-pulse"
            )} />

            <div className="relative z-10">
                <div className={clsx(
                    "flex items-center justify-center gap-2 mb-6 font-bold",
                    isIftar ? "text-slate-900/80" : "text-slate-300"
                )}>
                    <Clock size={isPrimary ? 20 : 14} className={titleIconClass} />
                    <span className="uppercase tracking-[0.2em] text-[10px] sm:text-xs">{event.label}</span>
                </div>

                <div className="flex justify-center items-baseline gap-3 sm:gap-6 font-black tabular-nums tracking-tighter">
                    <div className="flex flex-col items-center">
                        <span className={clsx(isPrimary ? "text-6xl sm:text-8xl" : "text-4xl sm:text-5xl", textClass)}>{h}</span>
                        <span className={clsx("text-[10px] sm:text-xs font-bold uppercase mt-1 sm:mt-2", isIftar ? "text-emerald-950/60" : "text-slate-500")}>Saat</span>
                    </div>
                    <span className={clsx(isPrimary ? "text-5xl sm:text-6xl" : "text-3xl sm:text-4xl", "self-start mt-2 sm:mt-4", isIftar ? "text-slate-900" : "text-slate-600")}>:</span>
                    <div className="flex flex-col items-center">
                        <span className={clsx(isPrimary ? "text-6xl sm:text-8xl" : "text-4xl sm:text-5xl", textClass)}>{m}</span>
                        <span className={clsx("text-[10px] sm:text-xs font-bold uppercase mt-1 sm:mt-2", isIftar ? "text-emerald-950/60" : "text-slate-500")}>Dk</span>
                    </div>
                    <span className={clsx(isPrimary ? "text-5xl sm:text-6xl" : "text-3xl sm:text-4xl", "self-start mt-2 sm:mt-4", isIftar ? "text-slate-900" : "text-slate-600")}>:</span>
                    <div className="flex flex-col items-center">
                        <span className={clsx(isPrimary ? "text-6xl sm:text-8xl" : "text-4xl sm:text-5xl", textClass)}>{s}</span>
                        <span className={clsx("text-[10px] sm:text-xs font-bold uppercase mt-1 sm:mt-2", isIftar ? "text-emerald-950/60" : "text-slate-500")}>Sn</span>
                    </div>
                </div>

                {isPrimary && (
                    <div className="mt-8 sm:mt-10 flex flex-col items-center">
                        <span className={clsx("text-base sm:text-xl font-semibold tracking-wide mb-1", isIftar ? "text-slate-900/60" : "text-slate-400")}>İftar vakti</span>
                        <strong className={clsx("text-4xl sm:text-6xl font-black", isIftar ? "text-slate-950 underline decoration-slate-900/10 decoration-4 underline-offset-8" : "text-slate-200")}>{event.timeStr}</strong>
                    </div>
                )}
            </div>
        </div>
    );
};
