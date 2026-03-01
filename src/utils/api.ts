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

    return combined.slice(startIndex, startIndex + 30).map((day, idx) => ({
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
            return data.data.map((day: any) => {
                const isoDate = day.date.iso; // "2026-03-01"
                const timings = day.timings;
                const dateObj = new Date(isoDate);
                const longDateStr = dateObj.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric', weekday: 'long' });

                return {
                    dayIndex: 0,
                    dayStr: '',
                    longDateStr: longDateStr,
                    date: isoDate,
                    imsak: timings.Fajr.split(' ')[0],
                    gunes: timings.Sunrise.split(' ')[0],
                    ogle: timings.Dhuhr.split(' ')[0],
                    ikindi: timings.Asr.split(' ')[0],
                    aksam: timings.Maghrib.split(' ')[0],
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
