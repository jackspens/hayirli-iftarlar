import React, { useEffect, useState } from 'react';
import { Countdown } from './components/Countdown';
import { Timetable } from './components/Timetable';
import { MonthTimetable } from './components/MonthTimetable';
import { getDayEvents, DayEvents } from './utils/timeTracker';
import { MoonStar, CalendarDays, MapPin, ChevronDown } from 'lucide-react';
import { ISTANBUL_IMSAKIYE_2026, PrayerTime } from './data/imsakiye';
import { fetchPrayerTimes } from './utils/api';
import { InstallPrompt } from './components/InstallPrompt';

const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Çanakkale'];

function App() {
    const [selectedCity, setSelectedCity] = useState('İstanbul');
    const [currentPrayerData, setCurrentPrayerData] = useState<PrayerTime[]>(ISTANBUL_IMSAKIYE_2026);
    const [events, setEvents] = useState<DayEvents | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function loadCityData() {
            if (selectedCity === 'İstanbul') {
                setCurrentPrayerData(ISTANBUL_IMSAKIYE_2026);
                return;
            }

            setIsLoading(true);
            const now = new Date();
            const times = await fetchPrayerTimes(selectedCity, now.getFullYear(), now.getMonth() + 1);
            if (times.length > 0) {
                setCurrentPrayerData(times);
            }
            setIsLoading(false);
        }
        loadCityData();
    }, [selectedCity]);

    useEffect(() => {
        const update = () => {
            setEvents(getDayEvents(new Date(), currentPrayerData));
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [currentPrayerData]);

    if (!events) return null;

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
                            <div className="relative group mt-1.5 inline-flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-emerald-500/30 cursor-pointer hover:border-emerald-500/60 transition-all shadow-lg active:scale-95">
                                <MapPin size={12} className="text-emerald-500" />
                                <select
                                    value={selectedCity}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCity(e.target.value)}
                                    className="bg-transparent text-emerald-400 font-bold text-[11px] appearance-none outline-none pr-5 cursor-pointer"
                                >
                                    {CITIES.map(city => (
                                        <option key={city} value={city} className="bg-slate-900 text-slate-100">{city}</option>
                                    ))}
                                </select>
                                <ChevronDown size={12} className="text-emerald-500 absolute right-2 pointer-events-none group-hover:translate-y-0.5 transition-transform" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300 text-[10px] sm:text-xs font-semibold bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800 shadow-xl">
                        <CalendarDays size={14} className="text-emerald-500" />
                        {events.currentDateStr}
                    </div>
                </div>
            </header>

            <main className="w-full flex-1 flex flex-col gap-3">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-20 gap-4">
                        <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                        <p className="text-slate-500 text-xs font-medium">Vakitler yükleniyor...</p>
                    </div>
                ) : (
                    <>
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
                            customData={currentPrayerData}
                            city={selectedCity}
                        />
                    </>
                )}
            </main>

            <footer className="w-full mt-10 text-center text-xs text-slate-500 font-medium pb-12 border-t border-slate-800/50 pt-8 space-y-2">
                <p>Veriler referans takvimler baz alınarak hesaplanmıştır.</p>
                <p className="text-slate-400">Bu site <span className="text-emerald-500 font-bold">Ersin Uçan</span> tarafından hazırlanmıştır.</p>
                <p className="text-[10px] opacity-50">Son güncelleme: 1 Mart 2026</p>
                <p className="pt-2">&copy; 2026 Hayırlı İftarlar</p>
            </footer>

            <InstallPrompt />
        </div>
    );
}

export default App;
