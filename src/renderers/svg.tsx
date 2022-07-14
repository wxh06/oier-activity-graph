import React from "react";
import ReactDOMServer from "react-dom/server";
import { DateTime } from "luxon";

interface ActivitiesPerDay {
  date: DateTime;
  count: number;
}

function Day({ count, date }: { count: number; date: DateTime }) {
  return (
    <rect
      width={10}
      height={10}
      x={0}
      y={(date.weekday % 7) * 13}
      rx={2}
      ry={2}
      data-count={count}
      data-date={date.toISODate()}
    >
      <title>{`${date.toISODate()}: ${count}`}</title>
    </rect>
  );
}

function Week({ days, index }: { days: ActivitiesPerDay[]; index: number }) {
  return (
    <g transform={`translate(${index * 13}, 0)`}>
      {days.map((day) => (
        <Day count={day.count} date={day.date} key={day.date.weekday} />
      ))}
    </g>
  );
}

const render = (
  activities: Record<string, number>,
  f: DateTime,
  t: DateTime
) => {
  const weeks: ActivitiesPerDay[][] = [];
  for (
    let date = f.startOf("day"), week: ActivitiesPerDay[] = [];
    date <= t;
    date = date.plus({ days: 1 })
  ) {
    week.push({ date, count: activities[date.toISODate()] ?? 0 });
    if (date.weekday === 6 || date.equals(t.startOf("day"))) {
      weeks.push(week);
      week = [];
    }
  }
  return ReactDOMServer.renderToString(
    <svg xmlns="http://www.w3.org/2000/svg">
      {weeks.map((week, index) => (
        <Week days={week} index={index} key={week[0].date.toISODate()} />
      ))}
    </svg>
  );
};

console.log(render({}, DateTime.fromObject({ year: 2022 }), DateTime.now()));
