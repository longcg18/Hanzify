/**
 * Hanzify 汉字流 - Gamification & Community Data Definitions
 * Dữ liệu thật 100% được truy vấn trực tiếp từ bảng 'submissions', 'user_streaks', 'users' trên Supabase.
 * Không chứa bất kỳ dữ liệu mẫu (mock/sample) nào.
 */

export const INITIAL_STREAK_DATA = {
  currentStreak: 0,
  longestStreak: 0,
  checkedInToday: false,
  totalXp: 0,
  weekDays: [],
  milestones: []
};

export const CLASSES_LIST = [];

export const LEADERBOARD_DATA = {
  byClass: {},
  all: [],
  weekly: [],
  monthly: [],
  allTime: []
};

export const COMMUNITY_POSTS = [];
