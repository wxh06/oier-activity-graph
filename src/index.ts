import { DateTime } from "luxon";
import { groupByWeek } from "./utils";
import luogu from "./sources/luogu";
import toSvg from "./renderers/svg";

luogu(108135)
  .then((activities) =>
    groupByWeek(activities, DateTime.now().minus({ years: 1 }), DateTime.now())
  )
  .then(toSvg)
  .then(console.log)
  .catch(console.error);
