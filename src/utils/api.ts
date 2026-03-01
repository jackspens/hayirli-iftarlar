import { PrayerTime } from '../data/imsakiye';

export async function fetchPrayerTimes(city: string, year: number, month: number): Promise<PrayerTime[]> {
    const country = 'Turkey';
    const method = 13; // Diyanet
    const url = `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${city}&country=${country}&method=${method}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.code === 200) {
            return data.data.map((day: any) => {
                const date = day.date.readable; // Need to convert this to YYYY-MM-DD
                const isoDate = day.date.iso; // "2026-03-01"
                const timings = day.timings;

                return {
                    day: day.date.day,
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
        throw new Error('API Error');
    } catch (error) {
        console.error('Failed to fetch prayer times:', error);
        return [];
    }
}
