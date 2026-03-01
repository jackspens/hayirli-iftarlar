import { useEffect, useState } from 'react';
import { Countdown } from './components/Countdown';
import { Timetable } from './components/Timetable';
import { MonthTimetable } from './components/MonthTimetable';
import { getDayEvents, DayEvents } from './utils/timeTracker';
import { MoonStar, CalendarDays } from 'lucide-react';

function App() {
    const [events, setEvents] = useState<DayEvents | null>(null);

    useEffect(() => {
        const update = () => {
            setEvents(getDayEvents(new Date()));
        };

        update();
        const interval = setInterval(update, 1000); // Check every second for countdown sync
        return () => clearInterval(interval);
    }, []);

    if (!events) return null;

    return (
        <div className="flex-1 flex flex-col items-center py-6 px-4 sm:py-10 w-full max-w-lg mx-auto">
            <header className="w-full mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-ramadan-500/20 rounded-2xl text-ramadan-400">
                        <MoonStar size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Hayırlı İftarlar</h1>
                        <p className="text-ramadan-400/80 font-medium text-xs mt-1">İstanbul</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium bg-slate-900/50 px-3 py-1.5 rounded-xl border border-slate-800">
                    <CalendarDays size={14} />
                    {events.currentDateStr}
                </div>
            </header>

            <main className="w-full flex-1 flex flex-col gap-3">
                {events.activeImsak || events.activeIftar ? (
                    <div className="flex flex-col gap-3">
                        {events.activeIftar && <Countdown event={events.activeIftar} isPrimary={true} />}
                        {events.activeImsak && <Countdown event={events.activeImsak} isPrimary={false} />}
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

                <MonthTimetable />
            </main>

            <footer className="w-full mt-10 text-center text-xs text-slate-500 font-medium">
                Veriler referans takvimler baz alınarak hesaplanmıştır.<br />
                &copy; 2026 Hayırlı İftarlar
            </footer>
        </div>
    );
}

export default App;
