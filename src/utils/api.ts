import { PrayerTime } from '../data/imsakiye';

export const MAJOR_CITIES = [
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya',
    'Adana', 'Konya', 'Şanlıurfa', 'Gaziantep', 'Kocaeli',
    'Mersin', 'Diyarbakır', 'Hatay', 'Manisa', 'Kayseri',
    'Samsun', 'Balıkesir', 'Kahramanmaraş', 'Van', 'Aydın'
];

export async function fetchFullRamazanData(city: string): Promise<PrayerTime[]> {
    const year = 2026;
    // Feb (month 2) and March (month 3) for Ramazan 2026
    const [febData, marchData] = await Promise.all([
        fetchPrayerTimes(city, year, 2),
        fetchPrayerTimes(city, year, 3)
    ]);

    // Ramazan 2026 starts on Feb 19.
    const combined = [...febData, ...marchData];
    const ramazanStart = '2026-02-19';
    const startIndex = combined.findIndex(d => d.date && d.date.includes(ramazanStart));

    if (startIndex === -1) {
        console.warn(`[API] Start date ${ramazanStart} not found. Available:`, combined.slice(0, 3).map(d => d.date));
        return [];
    }

    // Ramazan 2026 is 29 days.
    return combined.slice(startIndex, startIndex + 29).map((day, idx) => ({
        ...day,
        dayIndex: idx + 1,
        dayStr: `${idx + 1}. Gün`
    }));
}

async function fetchPrayerTimes(city: string, year: number, month: number): Promise<PrayerTime[]> {
    const country = 'Turkey';
    const method = 13; // Diyanet
    // Normalize city names: trim and ensure first letter is uppercase if needed, 
    // but encodeURIComponent should handle Turkish characters.
    const normalizedCity = city.trim();
    const url = `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${encodeURIComponent(normalizedCity)}&country=${encodeURIComponent(country)}&method=${method}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        if (data.code === 200 && Array.isArray(data.data)) {
            const isIstanbul = normalizedCity.toLowerCase() === 'istanbul' || normalizedCity === 'İstanbul';
            return data.data.map((day: any) => {
                // Aladhan API: day.date.gregorian.date is typically "DD-MM-YYYY"
                const rawDate = day.date.gregorian.date;
                const timings = day.timings;

                // Parse DD-MM-YYYY to Date object robustly
                const parts = rawDate.split('-');
                const dayVal = parseInt(parts[0]);
                const monthVal = parseInt(parts[1]);
                const yearVal = parseInt(parts[2]);
                const dateObj = new Date(yearVal, monthVal - 1, dayVal);

                // Manual ISO formatting to avoid TZ shifts
                const isoDate = `${yearVal}-${monthVal.toString().padStart(2, '0')}-${dayVal.toString().padStart(2, '0')}`;
                const longDateStr = dateObj.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric', weekday: 'long' });

                // Istanbul: Aladhan Maghrib is 1 min ahead of official Diyanet time, correct it.
                const rawMaghrib = timings.Maghrib.split(' ')[0];
                const maghrib = isIstanbul ? subtractOneMinute(rawMaghrib) : rawMaghrib;

                return {
                    dayIndex: 0,
                    dayStr: '',
                    longDateStr: longDateStr,
                    date: isoDate,
                    imsak: timings.Fajr.split(' ')[0],
                    gunes: timings.Sunrise.split(' ')[0],
                    ogle: timings.Dhuhr.split(' ')[0],
                    ikindi: timings.Asr.split(' ')[0],
                    aksam: maghrib,
                    yatsi: timings.Isha.split(' ')[0]
                };
            });
        }
        return [];
    } catch (error) {
        console.error(`Failed to fetch prayer times for ${city}:`, error);
        return [];
    }
}

// Helper: subtract 1 minute from a "HH:MM" time string
function subtractOneMinute(timeStr: string): string {
    const [h, m] = timeStr.split(':').map(Number);
    const totalMinutes = h * 60 + m - 1;
    const newH = Math.floor((totalMinutes + 1440) % 1440 / 60);
    const newM = (totalMinutes + 1440) % 60;
    return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}
