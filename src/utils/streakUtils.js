/**
 * Utilities for Daily Streak calculation, week tracker, and milestones
 */

export const DEFAULT_MILESTONES = [
  { days: 3, label: 'Khởi động 3 ngày', xpBonus: 100 },
  { days: 7, label: 'Chiến binh 1 tuần', xpBonus: 300 },
  { days: 30, label: 'Bậc thầy kiên trì 1 tháng', xpBonus: 1500 },
  { days: 100, label: 'Huyền thoại Hanzify', xpBonus: 5000 }
];

export function generateCurrentWeekDays(currentStreak = 0, checkedInToday = false) {
  const dayNames = [
    { day: 'T2', name: 'Thứ 2' },
    { day: 'T3', name: 'Thứ 3' },
    { day: 'T4', name: 'Thứ 4' },
    { day: 'T5', name: 'Thứ 5' },
    { day: 'T6', name: 'Thứ 6' },
    { day: 'T7', name: 'Thứ 7' },
    { day: 'CN', name: 'Chủ Nhật' }
  ];

  const now = new Date();
  const currentDow = now.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const todayIndex = (currentDow + 6) % 7; // 0 for Mon, 6 for Sun

  return dayNames.map((item, idx) => {
    const daysAgo = todayIndex - idx;
    let completed = false;
    if (daysAgo === 0) {
      completed = Boolean(checkedInToday);
    } else if (daysAgo > 0) {
      completed = currentStreak > daysAgo;
    }
    return {
      ...item,
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
