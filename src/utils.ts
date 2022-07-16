import { DateTime } from "luxon";

export type Level = 0 | 1 | 2 | 3 | 4 | 5;

export interface DailyData {
  x: number;
  y: number;
  date: DateTime;
  count: number;
  level: Level;
}

export function groupByWeek(
  activities: Record<string, number>,
  f: DateTime,
  t: DateTime
) {
  const weeks: DailyData[][] = [];
  for (
    let date = f.startOf("day"), week: DailyData[] = [];
    date <= t;
    date = date.plus({ days: 1 })
  ) {
    const count = activities[date.toISODate()] ?? 0;
    let level: Level = Math.ceil(count / 5) as never;
    if (level > 5) level = 5;
    week.push({ x: weeks.length, y: date.weekday % 7, date, count, level });
    if (date.weekday === 6 || date.equals(t.startOf("day"))) {
      weeks.push(week);
      week = [];
    }
  }
  return weeks;
}
