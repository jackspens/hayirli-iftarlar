import React, { useEffect, useState } from 'react';
import { Countdown } from './components/Countdown';
import { Timetable } from './components/Timetable';
import { MonthTimetable } from './components/MonthTimetable';
import { getDayEvents, DayEvents } from './utils/timeTracker';
import { MoonStar, CalendarDays, MonitorDown } from 'lucide-react';
import { ISTANBUL_IMSAKIYE_2026, PrayerTime } from './data/imsakiye';
import { InstallPrompt } from './components/InstallPrompt';

function App() {
    const [events, setEvents] = useState<DayEvents | null>(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);

    useEffect(() => {
        const update = () => {
            setEvents(getDayEvents(new Date(), ISTANBUL_IMSAKIYE_2026));
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!events) return null;

    const ramazanDay = events.prayerData?.dayIndex || 0;
    const totalDays = ISTANBUL_IMSAKIYE_2026.length;
    const daysLeft = totalDays - ramazanDay;

    return (
        <div className="flex-1 flex flex-col items-center py-6 px-4 sm:py-10 w-full max-w-lg mx-auto">
            <header className="w-full mb-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                            <MoonStar size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-100 tracking-tight">Hayırlı İftarlar</h1>
                            <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-md">İstanbul</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 text-right">
                        <div className="flex items-center gap-2 text-slate-300 text-[10px] sm:text-xs font-semibold bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800 shadow-xl">
                            <CalendarDays size={14} className="text-emerald-500" />
                            {events.currentDateStr}
                        </div>
                        {ramazanDay > 0 && (
                            <div className="text-[10px] font-medium text-slate-400">
                                Ramazan'ın <span className="text-emerald-500 font-bold">{ramazanDay}. Günü</span>
                                {daysLeft > 0 ? (
                                    <> • <span className="text-slate-500">{daysLeft} Gün Kaldı</span></>
                                ) : (
                                    <> • <span className="text-emerald-500 font-bold">Son Gün!</span></>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="w-full flex-1 flex flex-col gap-3">
                {events.activeImsak || events.activeIftar ? (
                    <div className="flex flex-col gap-3">
                        {[events.activeIftar, events.activeImsak]
                            .filter((e): e is NonNullable<typeof e> => !!e)
                            .sort((a, b) => a.diffSeconds - b.diffSeconds)
                            .map((event, idx) => (
                                <Countdown
                                    key={event.type}
                                    event={event}
                                    isPrimary={idx === 0}
                                />
                            ))
                        }
                    </div>
                ) : (
                    <div className="glass-panel p-8 text-center mt-6">
                        <h2 className="text-2xl font-bold text-ramadan-300">Ramazan Bayramı Mübarek Olsun!</h2>
                        <p className="text-slate-400 mt-2">Bu seneki Ramazan ayını tamamladık.</p>
                    </div>
                )}

                {events.prayerData && (
                    <Timetable
                        today={events.prayerData}
                        nextEventType={events.activeImsak ? 'imsak' : (events.activeIftar ? 'aksam' : undefined)}
                    />
                )}

                <MonthTimetable
                    customData={ISTANBUL_IMSAKIYE_2026}
                    city="İstanbul"
                />
            </main>

            <footer className="w-full mt-10 text-center text-xs text-slate-500 font-medium pb-12 border-t border-slate-800/50 pt-8 space-y-4">
                <div className="flex flex-col items-center gap-4">
                    <button
                        onClick={() => setShowInstallPrompt(true)}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/50 px-4 py-2 rounded-xl transition-all active:scale-95 text-[11px] font-bold"
                    >
                        <MonitorDown size={14} className="text-emerald-500" />
                        Ana Ekrana Ekle
                    </button>

                    <div className="space-y-1">
                        <p>Veriler referans takvimler baz alınarak hesaplanmıştır.</p>
                        <p className="text-slate-400">Bu site <span className="text-emerald-500 font-bold">Ersin Uçan</span> tarafından hazırlanmıştır.</p>
                        <p className="text-[10px] opacity-50">Son güncelleme: 1 Mart 2026</p>
                    </div>

                    <div className="mt-4 flex flex-col items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Ziyaretçi Sayısı</span>
                        <img
                            src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fjackspens.github.io%2Fhayirli-iftarlar&count_bg=%2310b981&title_bg=%231e293b&icon=at-and-t.svg&icon_color=%23E7E7E7&title=hits&edge_flat=false"
                            alt="Visitor Count"
                        />
                    </div>

                    <p className="pt-2 text-[10px]">&copy; 2026 Hayırlı İftarlar</p>
                </div>
            </footer>

            <InstallPrompt manualOpen={showInstallPrompt} onClose={() => setShowInstallPrompt(false)} />
        </div>
    );
}

export default App;
