import { parse, differenceInSeconds, isBefore, isAfter, startOfDay, addDays } from 'date-fns';
import { ISTANBUL_IMSAKIYE_2026, PrayerTime } from './imsakiye';

export type NextEvent = {
    type: 'imsak' | 'aksam';
    label: string;
    timeStr: string;
    diffSeconds: number;
    prayerData: PrayerTime;
};

export function getNextEvent(now: Date): NextEvent | null {
    const currentDayStr = now.toISOString().split('T')[0];

    // Find today's data
    let todayData = ISTANBUL_IMSAKIYE_2026.find(d => d.date === currentDayStr);

    if (!todayData) {
        // If we're before Ramazan, return the first day's Imsak
        const firstDay = parse(ISTANBUL_IMSAKIYE_2026[0].date, 'yyyy-MM-dd', new Date());
        if (isBefore(now, firstDay)) {
            const imsakTime = parse(`${ISTANBUL_IMSAKIYE_2026[0].date} ${ISTANBUL_IMSAKIYE_2026[0].imsak}`, 'yyyy-MM-dd HH:mm', new Date());
            return {
                type: 'imsak',
                label: 'İlk Sahura Kalan Süre',
                timeStr: ISTANBUL_IMSAKIYE_2026[0].imsak,
                diffSeconds: differenceInSeconds(imsakTime, now),
                prayerData: ISTANBUL_IMSAKIYE_2026[0]
            };
        }
        // If after Ramazan, return null
        return null;
    }

    const imsakTime = parse(`${todayData.date} ${todayData.imsak}`, 'yyyy-MM-dd HH:mm', new Date());
    const iftarTime = parse(`${todayData.date} ${todayData.aksam}`, 'yyyy-MM-dd HH:mm', new Date());

    if (isBefore(now, imsakTime)) {
        // Time before Imsak (Sahur time)
        return {
            type: 'imsak',
            label: 'İmsak Vaktine (Sahur)',
            timeStr: todayData.imsak,
            diffSeconds: differenceInSeconds(imsakTime, now),
            prayerData: todayData
        };
    } else if (isBefore(now, iftarTime)) {
        // Fasting time (waiting for Iftar)
        return {
            type: 'aksam',
            label: 'İftar Vaktine Kalan Süre',
            timeStr: todayData.aksam,
            diffSeconds: differenceInSeconds(iftarTime, now),
            prayerData: todayData
        };
    } else {
        // After Iftar, look for next day's Imsak
        const tomorrowStr = addDays(now, 1).toISOString().split('T')[0];
        const tomorrowData = ISTANBUL_IMSAKIYE_2026.find(d => d.date === tomorrowStr);

        if (tomorrowData) {
            const nextImsakTime = parse(`${tomorrowData.date} ${tomorrowData.imsak}`, 'yyyy-MM-dd HH:mm', new Date());
            return {
                type: 'imsak',
                label: 'Yarının İmsak Vaktine (Sahur)',
                timeStr: tomorrowData.imsak,
                diffSeconds: differenceInSeconds(nextImsakTime, now),
                prayerData: tomorrowData
            };
        }

        return null; // Ramazan is over
    }
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
