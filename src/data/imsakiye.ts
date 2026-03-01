export type PrayerTime = {
    date: string; // YYYY-MM-DD
    dayStr: string; // 1. Gün falan eklenebilir ama şu an "X Ramazan" gibi veya "19 Şubat 2026 Perşembe"
    dayIndex: number;
    imsak: string; // HH:mm
    gunes: string;
    ogle: string;
    ikindi: string;
    aksam: string; // Iftar
    yatsi: string;
    longDateStr: string;
};

export const ISTANBUL_IMSAKIYE_2026: PrayerTime[] = [
    { dayIndex: 1, longDateStr: '19 Şubat 2026 Perşembe', date: '2026-02-19', dayStr: '1. Gün', imsak: '06:22', gunes: '07:47', ogle: '13:23', ikindi: '16:20', aksam: '18:49', yatsi: '20:09' },
    { dayIndex: 2, longDateStr: '20 Şubat 2026 Cuma', date: '2026-02-20', dayStr: '2. Gün', imsak: '06:20', gunes: '07:45', ogle: '13:23', ikindi: '16:21', aksam: '18:51', yatsi: '20:10' },
    { dayIndex: 3, longDateStr: '21 Şubat 2026 Cumartesi', date: '2026-02-21', dayStr: '3. Gün', imsak: '06:19', gunes: '07:44', ogle: '13:23', ikindi: '16:21', aksam: '18:52', yatsi: '20:11' },
    { dayIndex: 4, longDateStr: '22 Şubat 2026 Pazar', date: '2026-02-22', dayStr: '4. Gün', imsak: '06:18', gunes: '07:42', ogle: '13:23', ikindi: '16:22', aksam: '18:53', yatsi: '20:12' },
    { dayIndex: 5, longDateStr: '23 Şubat 2026 Pazartesi', date: '2026-02-23', dayStr: '5. Gün', imsak: '06:16', gunes: '07:41', ogle: '13:22', ikindi: '16:23', aksam: '18:54', yatsi: '20:13' },
    { dayIndex: 6, longDateStr: '24 Şubat 2026 Salı', date: '2026-02-24', dayStr: '6. Gün', imsak: '06:15', gunes: '07:39', ogle: '13:22', ikindi: '16:24', aksam: '18:55', yatsi: '20:15' },
    { dayIndex: 7, longDateStr: '25 Şubat 2026 Çarşamba', date: '2026-02-25', dayStr: '7. Gün', imsak: '06:13', gunes: '07:38', ogle: '13:22', ikindi: '16:25', aksam: '18:56', yatsi: '20:16' },
    { dayIndex: 8, longDateStr: '26 Şubat 2026 Perşembe', date: '2026-02-26', dayStr: '8. Gün', imsak: '06:12', gunes: '07:36', ogle: '13:22', ikindi: '16:26', aksam: '18:58', yatsi: '20:17' },
    { dayIndex: 9, longDateStr: '27 Şubat 2026 Cuma', date: '2026-02-27', dayStr: '9. Gün', imsak: '06:11', gunes: '07:35', ogle: '13:22', ikindi: '16:26', aksam: '18:59', yatsi: '20:18' },
    { dayIndex: 10, longDateStr: '28 Şubat 2026 Cumartesi', date: '2026-02-28', dayStr: '10. Gün', imsak: '06:09', gunes: '07:33', ogle: '13:22', ikindi: '16:27', aksam: '19:00', yatsi: '20:19' },
    { dayIndex: 11, longDateStr: '01 Mart 2026 Pazar', date: '2026-03-01', dayStr: '11. Gün', imsak: '06:08', gunes: '07:32', ogle: '13:22', ikindi: '16:28', aksam: '19:01', yatsi: '20:20' },
    { dayIndex: 12, longDateStr: '02 Mart 2026 Pazartesi', date: '2026-03-02', dayStr: '12. Gün', imsak: '06:06', gunes: '07:30', ogle: '13:21', ikindi: '16:29', aksam: '19:02', yatsi: '20:21' },
    { dayIndex: 13, longDateStr: '03 Mart 2026 Salı', date: '2026-03-03', dayStr: '13. Gün', imsak: '06:05', gunes: '07:29', ogle: '13:21', ikindi: '16:30', aksam: '19:03', yatsi: '20:22' },
    { dayIndex: 14, longDateStr: '04 Mart 2026 Çarşamba', date: '2026-03-04', dayStr: '14. Gün', imsak: '06:03', gunes: '07:27', ogle: '13:21', ikindi: '16:30', aksam: '19:05', yatsi: '20:24' },
    { dayIndex: 15, longDateStr: '05 Mart 2026 Perşembe', date: '2026-03-05', dayStr: '15. Gün', imsak: '06:01', gunes: '07:26', ogle: '13:21', ikindi: '16:31', aksam: '19:06', yatsi: '20:25' },
    { dayIndex: 16, longDateStr: '06 Mart 2026 Cuma', date: '2026-03-06', dayStr: '16. Gün', imsak: '06:00', gunes: '07:24', ogle: '13:20', ikindi: '16:32', aksam: '19:07', yatsi: '20:26' },
    { dayIndex: 17, longDateStr: '07 Mart 2026 Cumartesi', date: '2026-03-07', dayStr: '17. Gün', imsak: '05:58', gunes: '07:23', ogle: '13:20', ikindi: '16:32', aksam: '19:08', yatsi: '20:27' },
    { dayIndex: 18, longDateStr: '08 Mart 2026 Pazar', date: '2026-03-08', dayStr: '18. Gün', imsak: '05:57', gunes: '07:21', ogle: '13:20', ikindi: '16:33', aksam: '19:09', yatsi: '20:28' },
    { dayIndex: 19, longDateStr: '09 Mart 2026 Pazartesi', date: '2026-03-09', dayStr: '19. Gün', imsak: '05:55', gunes: '07:19', ogle: '13:20', ikindi: '16:34', aksam: '19:10', yatsi: '20:29' },
    { dayIndex: 20, longDateStr: '10 Mart 2026 Salı', date: '2026-03-10', dayStr: '20. Gün', imsak: '05:53', gunes: '07:18', ogle: '13:19', ikindi: '16:34', aksam: '19:11', yatsi: '20:30' },
    { dayIndex: 21, longDateStr: '11 Mart 2026 Çarşamba', date: '2026-03-11', dayStr: '21. Gün', imsak: '05:52', gunes: '07:16', ogle: '13:19', ikindi: '16:35', aksam: '19:12', yatsi: '20:31' },
    { dayIndex: 22, longDateStr: '12 Mart 2026 Perşembe', date: '2026-03-12', dayStr: '22. Gün', imsak: '05:50', gunes: '07:14', ogle: '13:19', ikindi: '16:36', aksam: '19:14', yatsi: '20:33' },
    { dayIndex: 23, longDateStr: '13 Mart 2026 Cuma', date: '2026-03-13', dayStr: '23. Gün', imsak: '05:48', gunes: '07:13', ogle: '13:19', ikindi: '16:36', aksam: '19:15', yatsi: '20:34' },
    { dayIndex: 24, longDateStr: '14 Mart 2026 Cumartesi', date: '2026-03-14', dayStr: '24. Gün', imsak: '05:47', gunes: '07:11', ogle: '13:18', ikindi: '16:37', aksam: '19:16', yatsi: '20:35' },
    { dayIndex: 25, longDateStr: '15 Mart 2026 Pazar', date: '2026-03-15', dayStr: '25. Gün', imsak: '05:45', gunes: '07:09', ogle: '13:18', ikindi: '16:38', aksam: '19:17', yatsi: '20:36' },
    { dayIndex: 26, longDateStr: '16 Mart 2026 Pazartesi', date: '2026-03-16', dayStr: '26. Gün', imsak: '05:43', gunes: '07:08', ogle: '13:18', ikindi: '16:38', aksam: '19:18', yatsi: '20:37' },
    { dayIndex: 27, longDateStr: '17 Mart 2026 Salı', date: '2026-03-17', dayStr: '27. Gün', imsak: '05:41', gunes: '07:06', ogle: '13:18', ikindi: '16:39', aksam: '19:19', yatsi: '20:38' },
    { dayIndex: 28, longDateStr: '18 Mart 2026 Çarşamba', date: '2026-03-18', dayStr: '28. Gün', imsak: '05:40', gunes: '07:04', ogle: '13:17', ikindi: '16:39', aksam: '19:20', yatsi: '20:40' },
    { dayIndex: 29, longDateStr: '19 Mart 2026 Perşembe', date: '2026-03-19', dayStr: '29. Gün', imsak: '05:38', gunes: '07:03', ogle: '13:17', ikindi: '16:40', aksam: '19:21', yatsi: '20:41' },
];
