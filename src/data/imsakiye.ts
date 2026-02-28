export type PrayerTime = {
    date: string; // YYYY-MM-DD
    dayStr: string;
    imsak: string; // HH:mm
    gunes: string;
    ogle: string;
    ikindi: string;
    aksam: string; // Iftar
    yatsi: string;
};

// 2026 Ramazan begins around Feb 17/18, 2026 (Subject to moonsighting, but roughly based on standard calendars for Turkey)
// These are rough approximate times for Istanbul to serve as the static database for the app.
export const ISTANBUL_IMSAKIYE_2026: PrayerTime[] = [
    { date: '2026-02-18', dayStr: '1 Ramazan', imsak: '06:21', gunes: '07:44', ogle: '13:20', ikindi: '16:11', aksam: '18:45', yatsi: '20:00' },
    { date: '2026-02-19', dayStr: '2 Ramazan', imsak: '06:19', gunes: '07:42', ogle: '13:19', ikindi: '16:12', aksam: '18:46', yatsi: '20:01' },
    { date: '2026-02-20', dayStr: '3 Ramazan', imsak: '06:18', gunes: '07:41', ogle: '13:19', ikindi: '16:13', aksam: '18:47', yatsi: '20:03' },
    { date: '2026-02-21', dayStr: '4 Ramazan', imsak: '06:16', gunes: '07:39', ogle: '13:19', ikindi: '16:15', aksam: '18:49', yatsi: '20:04' },
    { date: '2026-02-22', dayStr: '5 Ramazan', imsak: '06:14', gunes: '07:38', ogle: '13:19', ikindi: '16:16', aksam: '18:50', yatsi: '20:05' },
    { date: '2026-02-23', dayStr: '6 Ramazan', imsak: '06:13', gunes: '07:36', ogle: '13:19', ikindi: '16:17', aksam: '18:51', yatsi: '20:06' },
    { date: '2026-02-24', dayStr: '7 Ramazan', imsak: '06:11', gunes: '07:34', ogle: '13:19', ikindi: '16:18', aksam: '18:52', yatsi: '20:08' },
    { date: '2026-02-25', dayStr: '8 Ramazan', imsak: '06:09', gunes: '07:33', ogle: '13:18', ikindi: '16:19', aksam: '18:53', yatsi: '20:09' },
    { date: '2026-02-26', dayStr: '9 Ramazan', imsak: '06:08', gunes: '07:31', ogle: '13:18', ikindi: '16:20', aksam: '18:55', yatsi: '20:10' },
    { date: '2026-02-27', dayStr: '10 Ramazan', imsak: '06:06', gunes: '07:30', ogle: '13:18', ikindi: '16:20', aksam: '18:56', yatsi: '20:12' },
    { date: '2026-02-28', dayStr: '11 Ramazan', imsak: '06:04', gunes: '07:28', ogle: '13:18', ikindi: '16:21', aksam: '18:57', yatsi: '20:13' },
    { date: '2026-03-01', dayStr: '12 Ramazan', imsak: '06:02', gunes: '07:26', ogle: '13:18', ikindi: '16:22', aksam: '18:58', yatsi: '20:14' },
    { date: '2026-03-02', dayStr: '13 Ramazan', imsak: '06:01', gunes: '07:25', ogle: '13:17', ikindi: '16:23', aksam: '18:59', yatsi: '20:16' },
    { date: '2026-03-03', dayStr: '14 Ramazan', imsak: '05:59', gunes: '07:23', ogle: '13:17', ikindi: '16:24', aksam: '19:00', yatsi: '20:17' },
    { date: '2026-03-04', dayStr: '15 Ramazan', imsak: '05:57', gunes: '07:21', ogle: '13:17', ikindi: '16:25', aksam: '19:02', yatsi: '20:18' },
];
