import { DateTime } from "luxon";

export interface DailyData {
  x: number;
  y: number;
  date: DateTime;
  count: number;
  level: number;
}

export function groupByWeek(
  activities: Record<string, number>,
  f: DateTime,
  t: DateTime,
  maxLevel = 4
) {
  const weeks: DailyData[][] = [];
  let max = 0;
  Object.entries(activities).forEach(([date, count]) => {
    const dateTime = DateTime.fromISO(date);
    if (dateTime >= f.startOf("day") && dateTime <= t.endOf("day"))
      max = count > max ? count : max;
  });
  for (
    let date = f.startOf("day"), week: DailyData[] = [];
    date <= t;
    date = date.plus({ days: 1 })
  ) {
    const count = activities[date.toISODate()] ?? 0;
    week.push({
      x: weeks.length,
      y: date.weekday % 7,
      date,
      count,
      level: max ? Math.ceil((count / max) * maxLevel) : 0,
    });
    if (date.weekday === 6 || date.equals(t.startOf("day"))) {
      weeks.push(week);
      week = [];
    }
  }
  return weeks;
}
