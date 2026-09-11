/**
 * Utilities for Daily Streak calculation, week tracker, and milestones
 */

export const DEFAULT_MILESTONES = [
  { days: 3, label: 'Khởi động 3 ngày', xpBonus: 100 },
  { days: 7, label: 'Chiến binh 1 tuần', xpBonus: 300 },
  { days: 30, label: 'Bậc thầy kiên trì 1 tháng', xpBonus: 1500 },
  { days: 100, label: 'Huyền thoại Hanzify', xpBonus: 5000 }
];

export const STREAK_TIME_ZONE = 'Asia/Ho_Chi_Minh';

export function getDateKey(date = new Date(), timeZone = STREAK_TIME_ZONE) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function getPreviousDateKey(dateKey) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey || '')) return null;
  const [year, month, day] = dateKey.split('-').map(Number);
  const previous = new Date(Date.UTC(year, month - 1, day - 1));
  return previous.toISOString().slice(0, 10);
}

export function getEffectiveStreak(currentStreak, lastCheckIn, today = getDateKey()) {
  const streak = Math.max(0, Number(currentStreak) || 0);
  if (!lastCheckIn || streak === 0) return 0;
  return lastCheckIn === today || lastCheckIn === getPreviousDateKey(today) ? streak : 0;
}

export function calculateCheckIn(current = {}, today = getDateKey()) {
  const previousDate = getPreviousDateKey(today);
  const oldStreak = Math.max(0, Number(current.currentStreak) || 0);
  const nextStreak = current.lastCheckIn === previousDate ? oldStreak + 1 : 1;
  return {
    currentStreak: nextStreak,
    longestStreak: Math.max(nextStreak, Number(current.longestStreak) || 0),
    totalXp: Math.max(0, Number(current.totalXp) || 0) + 50,
    checkedInToday: true,
    lastCheckIn: today
  };
}

export function getCurrentWeekDateKeys(today = getDateKey()) {
  const [year, month, day] = today.split('-').map(Number);
  const current = new Date(Date.UTC(year, month - 1, day));
  const mondayOffset = (current.getUTCDay() + 6) % 7;
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(current);
    date.setUTCDate(current.getUTCDate() - mondayOffset + index);
    return date.toISOString().slice(0, 10);
  });
}

export function generateCurrentWeekDays(currentStreak = 0, checkedInToday = false, checkInDates = null, today = getDateKey()) {
  const dayNames = [
    { day: 'T2', name: 'Thứ 2' },
    { day: 'T3', name: 'Thứ 3' },
    { day: 'T4', name: 'Thứ 4' },
    { day: 'T5', name: 'Thứ 5' },
    { day: 'T6', name: 'Thứ 6' },
    { day: 'T7', name: 'Thứ 7' },
    { day: 'CN', name: 'Chủ Nhật' }
  ];

  const weekDateKeys = getCurrentWeekDateKeys(today);
  const todayIndex = weekDateKeys.indexOf(today);
  const savedDates = Array.isArray(checkInDates) ? new Set(checkInDates) : null;

  return dayNames.map((item, idx) => {
    const date = weekDateKeys[idx];
    const daysAgo = todayIndex - idx;
    let completed = false;
    if (savedDates) {
      completed = savedDates.has(date);
    } else if (daysAgo === 0) {
      completed = Boolean(checkedInToday);
    } else if (daysAgo > 0) {
      completed = currentStreak > daysAgo;
    }
    return {
      ...item,
      date,
      completed
    };
  });
}

export function formatStreakMilestones(currentStreak = 0, customMilestones = null) {
  const base = Array.isArray(customMilestones) && customMilestones.length > 0 
    ? customMilestones 
    : DEFAULT_MILESTONES;

  return base.map((m) => ({
    ...m,
    unlocked: typeof m.unlocked === 'boolean' ? m.unlocked : (currentStreak >= m.days)
  }));
}
