import { parse, differenceInSeconds, isBefore, addDays } from 'date-fns';
import { ISTANBUL_IMSAKIYE_2026, PrayerTime } from '../data/imsakiye';

export type NextEvent = {
    type: 'imsak' | 'aksam';
    label: string;
    timeStr: string;
    diffSeconds: number;
    prayerData: PrayerTime;
    nextDayTime?: string;
};

export type DayEvents = {
    activeIftar: NextEvent | null;
    activeImsak: NextEvent | null;
    prayerData: PrayerTime | null;
    currentDateStr: string;
};

export function getDayEvents(now: Date, data: PrayerTime[] = ISTANBUL_IMSAKIYE_2026): DayEvents {
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const currentDayStr = `${year}-${month}-${day}`;

    // Find today's data
    let todayData = data.find((d: PrayerTime) => d.date === currentDayStr);

    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const localizedDateStr = now.toLocaleDateString('tr-TR', options);

    if (!todayData) {
        // If we're before Ramazan, return the first day's Imsak
        if (data.length === 0) return { activeIftar: null, activeImsak: null, prayerData: null, currentDateStr: localizedDateStr };

        const firstDay = parse(data[0].date, 'yyyy-MM-dd', new Date());
        if (isBefore(now, firstDay)) {
            const imsakTime = parse(`${data[0].date} ${data[0].imsak}`, 'yyyy-MM-dd HH:mm', new Date());
            const iftarTime = parse(`${data[0].date} ${data[0].aksam}`, 'yyyy-MM-dd HH:mm', new Date());

            return {
                activeImsak: {
                    type: 'imsak', label: 'İmsak Vaktine Kalan Süre', timeStr: data[0].imsak, diffSeconds: differenceInSeconds(imsakTime, now), prayerData: data[0]
                },
                activeIftar: {
                    type: 'aksam', label: 'İftar Vaktine Kalan Süre', timeStr: data[0].aksam, diffSeconds: differenceInSeconds(iftarTime, now), prayerData: data[0]
                },
                prayerData: data[0],
                currentDateStr: localizedDateStr
            };
        }
        // If after Ramazan, return nulls
        return { activeIftar: null, activeImsak: null, prayerData: null, currentDateStr: localizedDateStr };
    }

    const imsakTime = parse(`${todayData.date} ${todayData.imsak}`, 'yyyy-MM-dd HH:mm', new Date());
    const iftarTime = parse(`${todayData.date} ${todayData.aksam}`, 'yyyy-MM-dd HH:mm', new Date());

    let activeImsak: NextEvent | null = null;
    let activeIftar: NextEvent | null = null;

    // Tomorrow's data for "next day" info (use local date math to avoid TZ shift)
    const tomorrow = addDays(now, 1);
    const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
    const tomorrowData = data.find((d: PrayerTime) => d.date === tomorrowStr);

    if (isBefore(now, imsakTime)) {
        // Time before Imsak (midnight to Sahur/Imsak)
        activeImsak = { type: 'imsak', label: 'İmsak Vaktine Kalan Süre', timeStr: todayData.imsak, diffSeconds: differenceInSeconds(imsakTime, now), prayerData: todayData };
        activeIftar = {
            type: 'aksam',
            label: 'İftar Vaktine Kalan Süre',
            timeStr: todayData.aksam,
            diffSeconds: differenceInSeconds(iftarTime, now),
            prayerData: todayData,
            nextDayTime: tomorrowData?.aksam
        };
    } else if (isBefore(now, iftarTime)) {
        // Fasting time (Imsak to Iftar)
        activeIftar = {
            type: 'aksam',
            label: 'İftar Vaktine Kalan Süre',
            timeStr: todayData.aksam,
            diffSeconds: differenceInSeconds(iftarTime, now),
            prayerData: todayData,
            nextDayTime: tomorrowData?.aksam
        };

        if (tomorrowData) {
            const nextImsakTime = parse(`${tomorrowData.date} ${tomorrowData.imsak}`, 'yyyy-MM-dd HH:mm', new Date());
            activeImsak = { type: 'imsak', label: 'İmsak Vaktine Kalan Süre', timeStr: tomorrowData.imsak, diffSeconds: differenceInSeconds(nextImsakTime, now), prayerData: tomorrowData };
        }
    } else {
        // After Iftar
        if (tomorrowData) {
            const nextImsakTime = parse(`${tomorrowData.date} ${tomorrowData.imsak}`, 'yyyy-MM-dd HH:mm', new Date());
            const nextIftarTime = parse(`${tomorrowData.date} ${tomorrowData.aksam}`, 'yyyy-MM-dd HH:mm', new Date());

            // Next day's iftar for the secondary timer (local date math)
            const dayAfterTomorrow = addDays(now, 2);
            const dayAfterTomorrowStr = `${dayAfterTomorrow.getFullYear()}-${String(dayAfterTomorrow.getMonth() + 1).padStart(2, '0')}-${String(dayAfterTomorrow.getDate()).padStart(2, '0')}`;
            const dayAfterTomorrowData = data.find((d: PrayerTime) => d.date === dayAfterTomorrowStr);

            activeImsak = { type: 'imsak', label: 'İmsak Vaktine Kalan Süre', timeStr: tomorrowData.imsak, diffSeconds: differenceInSeconds(nextImsakTime, now), prayerData: tomorrowData };
            activeIftar = {
                type: 'aksam',
                label: 'İftar Vaktine Kalan Süre',
                timeStr: tomorrowData.aksam,
                diffSeconds: differenceInSeconds(nextIftarTime, now),
                prayerData: tomorrowData,
                nextDayTime: dayAfterTomorrowData?.aksam
            };

            todayData = tomorrowData;
        }
    }

    return { activeIftar, activeImsak, prayerData: todayData, currentDateStr: localizedDateStr };
}

export function formatDuration(totalSeconds: number) {
    if (totalSeconds < 0) return { h: '00', m: '00', s: '00' };
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return {
        h: h.toString().padStart(2, '0'),
        m: m.toString().padStart(2, '0'),
        s: s.toString().padStart(2, '0')
    };
}
