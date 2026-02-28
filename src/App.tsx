import { useEffect, useState } from 'react';
import { Countdown } from './components/Countdown';
import { Timetable } from './components/Timetable';
import { getNextEvent, NextEvent } from './utils/timeTracker';
import { MoonStar } from 'lucide-react';

function App() {
    const [event, setEvent] = useState<NextEvent | null>(null);

    useEffect(() => {
        // Update event every minute to keep the day accurate
        const update = () => {
            setEvent(getNextEvent(new Date()));
        };

        update();
        const interval = setInterval(update, 60000); // check every minute if we crossed a boundary
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex-1 flex flex-col items-center py-6 px-4 sm:py-12 w-full max-w-lg mx-auto">
            <header className="w-full mb-8 text-center sm:text-left flex items-center justify-center sm:justify-start gap-3">
                <div className="p-3 bg-ramadan-500/20 rounded-2xl text-ramadan-400">
                    <MoonStar size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Hayırlı İftarlar</h1>
                    <p className="text-ramadan-400/80 font-medium text-sm mt-1">Ramazan 2026 • İstanbul</p>
                </div>
            </header>

            <main className="w-full flex-1 flex flex-col gap-2">
                <Countdown event={event} />
                {event?.prayerData && (
                    <Timetable today={event.prayerData} nextEventType={event.type} />
                )}
            </main>

            <footer className="w-full mt-12 text-center text-xs text-slate-500 font-medium">
                Veriler Diyanet (veya referans takvimler) baz alınarak simüle edilmiştir.<br />
                &copy; 2026 DevFolio
            </footer>
        </div>
    );
}

export default App;
