import React, { useEffect, useState, useCallback } from 'react';
import { Countdown } from './components/Countdown';
import { Timetable } from './components/Timetable';
import { MonthTimetable } from './components/MonthTimetable';
import { getDayEvents, DayEvents } from './utils/timeTracker';
import { MoonStar, CalendarDays, MonitorDown, MapPin, ChevronDown } from 'lucide-react';
import { PrayerTime } from './data/imsakiye';
import { InstallPrompt } from './components/InstallPrompt';
import { fetchFullRamazanData, MAJOR_CITIES } from './utils/api';

function App() {
    const [selectedCity, setSelectedCity] = useState('İstanbul');
    const [imsakiye, setImsakiye] = useState<PrayerTime[]>([]);
    const [events, setEvents] = useState<DayEvents | null>(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const [loading, setLoading] = useState(true);
    const [visitorCount, setVisitorCount] = useState(1000);

    const loadData = useCallback(async (city: string) => {
        setLoading(true);
        try {
            const data = await fetchFullRamazanData(city);
            setImsakiye(data);
            if (data.length > 0) {
                setEvents(getDayEvents(new Date(), data));
            } else {
                setEvents(getDayEvents(new Date(), []));
            }
        } catch (error) {
            console.error('Failed to load data:', error);
            setImsakiye([]);
            setEvents(getDayEvents(new Date(), []));
        } finally {
            setLoading(false);
        }
    }, []);

    // Visitor counter: starts at 1000, increments once per browser session
    useEffect(() => {
        const BASE = 1000;
        const stored = parseInt(localStorage.getItem('hi_visitor_count') ?? String(BASE), 10);
        const sessionKey = 'hi_visited_this_session';
        if (!sessionStorage.getItem(sessionKey)) {
            const next = stored + 1;
            localStorage.setItem('hi_visitor_count', String(next));
            sessionStorage.setItem(sessionKey, '1');
            setVisitorCount(next);
        } else {
            setVisitorCount(stored);
        }
    }, []);

    useEffect(() => {
        loadData(selectedCity);
    }, [selectedCity, loadData]);

    useEffect(() => {
        if (imsakiye.length === 0) return;

        const interval = setInterval(() => {
            setEvents(getDayEvents(new Date(), imsakiye));
        }, 1000);
        return () => clearInterval(interval);
    }, [imsakiye]);

    if (loading || !events) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-emerald-500 gap-4">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Dualar Yükleniyor...</span>
            </div>
        );
    }

    const ramazanDay = events.prayerData?.dayIndex || 0;
    const totalDays = imsakiye.length || 29;
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
                            <div className="relative mt-1 group">
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-500 cursor-pointer hover:bg-emerald-500/20 transition-all">
                                    <MapPin size={12} />
                                    <select
                                        value={selectedCity}
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                        className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-wider appearance-none pr-4 cursor-pointer"
                                    >
                                        {MAJOR_CITIES.map(city => (
                                            <option key={city} value={city} className="bg-slate-900 text-slate-100">{city}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={10} className="absolute right-2 pointer-events-none" />
                                </div>
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
                    customData={imsakiye}
                    city={selectedCity}
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
                        <p className="text-slate-400">Bu site <a href="mailto:ersinucan@yandex.com" className="text-emerald-500 font-bold hover:underline transition-all">Mr. EU</a> tarafından hazırlanmıştır.</p>
                        <p className="text-[10px] opacity-50">Son güncelleme: {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>

                    <div className="mt-4 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-all">
                        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Ziyaretçi Sayısı</span>
                        <span className="text-emerald-400 font-mono font-black text-lg">{visitorCount.toLocaleString('tr-TR')}</span>
                    </div>

                    <p className="pt-2 text-[10px]">&copy; 2026 Hayırlı İftarlar</p>
                </div>
            </footer>

            <InstallPrompt manualOpen={showInstallPrompt} onClose={() => setShowInstallPrompt(false)} />
        </div>
    );
}

export default App;
