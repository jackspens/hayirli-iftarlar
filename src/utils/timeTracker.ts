import { parse, differenceInSeconds, isBefore, addDays } from 'date-fns';
import { ISTANBUL_IMSAKIYE_2026, PrayerTime } from '../data/imsakiye';

export type NextEvent = {
    type: 'imsak' | 'aksam';
    label: string;
    timeStr: string;
    diffSeconds: number;
    prayerData: PrayerTime;
};

export type DayEvents = {
    activeIftar: NextEvent | null;
    activeImsak: NextEvent | null;
    prayerData: PrayerTime | null;
    currentDateStr: string;
};

export function getDayEvents(now: Date): DayEvents {
    const currentDayStr = now.toISOString().split('T')[0];

    // Find today's data
    let todayData = ISTANBUL_IMSAKIYE_2026.find((d: PrayerTime) => d.date === currentDayStr);

    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const localizedDateStr = now.toLocaleDateString('tr-TR', options);

    if (!todayData) {
        // If we're before Ramazan, return the first day's Imsak
        const firstDay = parse(ISTANBUL_IMSAKIYE_2026[0].date, 'yyyy-MM-dd', new Date());
        if (isBefore(now, firstDay)) {
            const imsakTime = parse(`${ISTANBUL_IMSAKIYE_2026[0].date} ${ISTANBUL_IMSAKIYE_2026[0].imsak}`, 'yyyy-MM-dd HH:mm', new Date());
            const iftarTime = parse(`${ISTANBUL_IMSAKIYE_2026[0].date} ${ISTANBUL_IMSAKIYE_2026[0].aksam}`, 'yyyy-MM-dd HH:mm', new Date());

            return {
                activeImsak: {
                    type: 'imsak', label: 'İlk Sahura Kalan Süre', timeStr: ISTANBUL_IMSAKIYE_2026[0].imsak, diffSeconds: differenceInSeconds(imsakTime, now), prayerData: ISTANBUL_IMSAKIYE_2026[0]
                },
                activeIftar: {
                    type: 'aksam', label: 'İlk İftara Kalan Süre', timeStr: ISTANBUL_IMSAKIYE_2026[0].aksam, diffSeconds: differenceInSeconds(iftarTime, now), prayerData: ISTANBUL_IMSAKIYE_2026[0]
                },
                prayerData: ISTANBUL_IMSAKIYE_2026[0],
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

    if (isBefore(now, imsakTime)) {
        // Time before Imsak (midnight to Sahur)
        activeImsak = { type: 'imsak', label: 'İmsak Vaktine (Sahur)', timeStr: todayData.imsak, diffSeconds: differenceInSeconds(imsakTime, now), prayerData: todayData };
        activeIftar = { type: 'aksam', label: 'İftar Vaktine Kalan Süre', timeStr: todayData.aksam, diffSeconds: differenceInSeconds(iftarTime, now), prayerData: todayData };
    } else if (isBefore(now, iftarTime)) {
        // Fasting time (Imsak to Iftar)
        activeIftar = { type: 'aksam', label: 'İftar Vaktine Kalan Süre', timeStr: todayData.aksam, diffSeconds: differenceInSeconds(iftarTime, now), prayerData: todayData };

        // For Sahur, we should show TOMORROW's Sahur time because today's has passed
        const tomorrowStr = addDays(now, 1).toISOString().split('T')[0];
        const tomorrowData = ISTANBUL_IMSAKIYE_2026.find((d: PrayerTime) => d.date === tomorrowStr);
        if (tomorrowData) {
            const nextImsakTime = parse(`${tomorrowData.date} ${tomorrowData.imsak}`, 'yyyy-MM-dd HH:mm', new Date());
            activeImsak = { type: 'imsak', label: 'Yarının Sahuruna Kalan Süre', timeStr: tomorrowData.imsak, diffSeconds: differenceInSeconds(nextImsakTime, now), prayerData: tomorrowData };
        }
    } else {
        // After Iftar, look for next day's Imsak and next day's Iftar
        const tomorrowStr = addDays(now, 1).toISOString().split('T')[0];
        const tomorrowData = ISTANBUL_IMSAKIYE_2026.find((d: PrayerTime) => d.date === tomorrowStr);

        if (tomorrowData) {
            const nextImsakTime = parse(`${tomorrowData.date} ${tomorrowData.imsak}`, 'yyyy-MM-dd HH:mm', new Date());
            const nextIftarTime = parse(`${tomorrowData.date} ${tomorrowData.aksam}`, 'yyyy-MM-dd HH:mm', new Date());

            activeImsak = { type: 'imsak', label: 'Yarının İmsak Vaktine (Sahur)', timeStr: tomorrowData.imsak, diffSeconds: differenceInSeconds(nextImsakTime, now), prayerData: tomorrowData };
            activeIftar = { type: 'aksam', label: 'Yarının İftar Vaktine', timeStr: tomorrowData.aksam, diffSeconds: differenceInSeconds(nextIftarTime, now), prayerData: tomorrowData };

            // We want tomorrow's prayer data to show in the table if it's past Iftar (common preference)
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
