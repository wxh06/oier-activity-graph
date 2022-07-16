import React from "react";
import ReactDOMServer from "react-dom/server";
import type { DailyData } from "../utils";

function Day({ data: { count, date, level, y } }: { data: DailyData }) {
  const fill = [
    "#f7f6f7",
    "#d4ffc0",
    "#b0ff80",
    "#7fff54",
    "#4fff28",
    "#35dd20",
  ][level];
  return (
    <rect
      width={10}
      height={10}
      x={0}
      y={y * 13}
      rx={2}
      ry={2}
      fill={fill}
      data-count={count}
      data-date={date.toISODate()}
      data-level={level}
    >
      <title>{`${date.toISODate()}: ${count}`}</title>
    </rect>
  );
}

function Week({ days, index }: { days: DailyData[]; index: number }) {
  return (
    <g transform={`translate(${index * 13}, 0)`}>
      {days.map((day) => (
        <Day data={day} key={day.y} />
      ))}
    </g>
  );
}

function Calendar({ weeks }: { weeks: DailyData[][] }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg">
      {weeks.map((week, index) => (
        <Week days={week} index={index} key={week[0].x} />
      ))}
    </svg>
  );
}

const render = (calendar: DailyData[][]) =>
  ReactDOMServer.renderToString(<Calendar weeks={calendar} />);

export default render;
