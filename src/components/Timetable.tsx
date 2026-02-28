import React from 'react';
import { PrayerTime } from '../data/imsakiye';
import { Sun, Moon, Sunrise, Sunset, Clock3, MoonStar } from 'lucide-react';
import clsx from 'clsx';

export const Timetable: React.FC<{ today: PrayerTime, nextEventType: 'imsak' | 'aksam' | undefined }> = ({ today, nextEventType }) => {
    const times = [
        { label: 'İmsak', time: today.imsak, icon: MoonStar, id: 'imsak' },
        { label: 'Güneş', time: today.gunes, icon: Sunrise, id: 'gunes' },
        { label: 'Öğle', time: today.ogle, icon: Sun, id: 'ogle' },
        { label: 'İkindi', time: today.ikindi, icon: Clock3, id: 'ikindi' },
        { label: 'Akşam (İftar)', time: today.aksam, icon: Sunset, id: 'aksam' },
        { label: 'Yatsı', time: today.yatsi, icon: Moon, id: 'yatsi' },
    ];

    return (
        <div className="glass-panel mt-6 overflow-hidden">
            <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-slate-200 flex justify-between items-center">
                    <span>{today.dayStr}</span>
                    <span className="text-sm font-normal text-slate-400">İstanbul</span>
                </h3>
            </div>
            <div className="divide-y divide-slate-800/50">
                {times.map((t) => {
                    const isNext = t.id === nextEventType;
                    const Icon = t.icon;
                    return (
                        <div
                            key={t.id}
                            className={clsx(
                                "flex items-center justify-between px-6 py-4 transition-colors",
                                isNext ? "bg-ramadan-900/20" : "hover:bg-slate-800/30"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={clsx(
                                    "p-2 rounded-lg",
                                    isNext ? "bg-ramadan-500/20 text-ramadan-400" : "bg-slate-800 text-slate-400"
                                )}>
                                    <Icon size={20} />
                                </div>
                                <span className={clsx(
                                    "font-medium",
                                    isNext ? "text-ramadan-300" : "text-slate-300"
                                )}>
                                    {t.label}
                                </span>
                            </div>
                            <span className={clsx(
                                "text-xl font-bold font-mono tracking-tight",
                                isNext ? "text-ramadan-400" : "text-slate-100"
                            )}>
                                {t.time}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
