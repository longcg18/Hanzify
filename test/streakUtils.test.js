import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCheckIn,
  generateCurrentWeekDays,
  getCurrentWeekDateKeys,
  getDateKey,
  getEffectiveStreak,
  getPreviousDateKey
} from '../src/utils/streakUtils.js';

test('builds the Monday-to-Sunday date keys across month boundaries', () => {
  assert.deepEqual(getCurrentWeekDateKeys('2026-09-02'), [
    '2026-08-31', '2026-09-01', '2026-09-02', '2026-09-03',
    '2026-09-04', '2026-09-05', '2026-09-06'
  ]);
});

test('renders the weekly calendar from persisted check-in dates', () => {
  const days = generateCurrentWeekDays(1, true, ['2026-09-07', '2026-09-09'], '2026-09-09');
  assert.deepEqual(days.map(({ date, completed }) => ({ date, completed })), [
    { date: '2026-09-07', completed: true },
    { date: '2026-09-08', completed: false },
    { date: '2026-09-09', completed: true },
    { date: '2026-09-10', completed: false },
    { date: '2026-09-11', completed: false },
    { date: '2026-09-12', completed: false },
    { date: '2026-09-13', completed: false }
  ]);
});

test('uses Vietnam calendar day instead of UTC day', () => {
  const instant = new Date('2026-09-09T18:30:00.000Z');
  assert.equal(getDateKey(instant), '2026-09-10');
});

test('handles previous day across month and year boundaries', () => {
  assert.equal(getPreviousDateKey('2026-03-01'), '2026-02-28');
  assert.equal(getPreviousDateKey('2026-01-01'), '2025-12-31');
});

test('continues a streak only when the last check-in was yesterday', () => {
  const result = calculateCheckIn({
    currentStreak: 4,
    longestStreak: 8,
    totalXp: 200,
    lastCheckIn: '2026-09-09'
  }, '2026-09-10');
  assert.deepEqual(result, {
    currentStreak: 5,
    longestStreak: 8,
    totalXp: 250,
    checkedInToday: true,
    lastCheckIn: '2026-09-10'
  });
});

test('resets a broken streak to one', () => {
  const result = calculateCheckIn({
    currentStreak: 12,
    longestStreak: 12,
    totalXp: 600,
    lastCheckIn: '2026-09-07'
  }, '2026-09-10');
  assert.equal(result.currentStreak, 1);
  assert.equal(result.longestStreak, 12);
  assert.equal(result.totalXp, 650);
});

test('shows an expired streak as zero before the next check-in', () => {
  assert.equal(getEffectiveStreak(9, '2026-09-08', '2026-09-10'), 0);
  assert.equal(getEffectiveStreak(9, '2026-09-09', '2026-09-10'), 9);
  assert.equal(getEffectiveStreak(9, '2026-09-10', '2026-09-10'), 9);
});
