import React from 'react';
import { ISTANBUL_IMSAKIYE_2026 } from '../data/imsakiye';
import { isBefore, parse, startOfDay } from 'date-fns';
import clsx from 'clsx';
import { CheckCircle2 } from 'lucide-react';

export const MonthTimetable: React.FC<{ currentDateStr: string }> = ({ currentDateStr }) => {
    const now = new Date();
    const todayStart = startOfDay(now);

    return (
        <div className="glass-panel mt-6 overflow-hidden flex flex-col">
            <div className="bg-slate-800/80 px-4 sm:px-6 py-4 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-slate-200">
                    Ramazan İmsakiyesi (Tüm Ay)
                </h3>
                <p className="text-xs text-slate-400 mt-1">İstanbul için 2026 Ramazan tablosu</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-slate-700/50">
                        <tr>
                            <th className="px-4 py-3 font-medium whitespace-nowrap">Gün</th>
                            <th className="px-4 py-3 font-medium whitespace-nowrap">Tarih</th>
                            <th className="px-4 py-3 font-medium whitespace-nowrap text-center">İmsak</th>
                            <th className="px-4 py-3 font-medium whitespace-nowrap text-center">İftar</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {ISTANBUL_IMSAKIYE_2026.map((day) => {
                            const dayDate = parse(day.date, 'yyyy-MM-dd', new Date());
                            const isToday = day.date === now.toISOString().split('T')[0];
                            const isPast = isBefore(dayDate, todayStart) && !isToday;

                            return (
                                <tr
                                    key={day.dayIndex}
                                    className={clsx(
                                        "transition-colors",
                                        isToday ? "bg-ramadan-900/30 ring-1 ring-inset ring-ramadan-500/50" :
                                            isPast ? "bg-slate-900/20 opacity-50" : "hover:bg-slate-800/30"
                                    )}
                                >
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {isPast ? <CheckCircle2 size={14} className="text-emerald-500" /> : null}
                                            <span className={clsx("font-medium", isToday ? "text-ramadan-300" : (isPast ? "text-slate-500" : "text-slate-300"))}>
                                                {day.dayStr}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={clsx("px-4 py-3 whitespace-nowrap", isToday ? "text-ramadan-200" : "text-slate-400")}>
                                        {day.longDateStr}
                                    </td>
                                    <td className={clsx("px-4 py-3 text-center font-mono font-bold whitespace-nowrap", isToday ? "text-ramadan-400" : "text-slate-300")}>
                                        {day.imsak}
                                    </td>
                                    <td className={clsx("px-4 py-3 text-center font-mono font-bold whitespace-nowrap", isToday ? "text-ramadan-400" : "text-slate-300")}>
                                        {day.aksam}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
