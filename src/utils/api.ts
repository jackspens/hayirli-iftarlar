import { PrayerTime } from '../data/imsakiye';

export async function fetchPrayerTimes(city: string, year: number, month: number): Promise<PrayerTime[]> {
    const country = 'Turkey';
    const method = 13; // Diyanet
    const url = `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${city}&country=${country}&method=${method}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.code === 200) {
            return data.data.map((day: any, index: number) => {
                const isoDate = day.date.iso; // "2026-03-01"
                const timings = day.timings;

                // Helper for Turkish long date
                const dateObj = new Date(isoDate);
                const longDateStr = dateObj.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric', weekday: 'long' });

                return {
                    dayIndex: index + 1,
                    dayStr: `${index + 1}. Gün`,
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
        throw new Error('API Error');
    } catch (error) {
        console.error('Failed to fetch prayer times:', error);
        return [];
    }
}
