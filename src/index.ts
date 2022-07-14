import { DateTime } from "luxon";
import luogu from "./sources/luogu";
import toSvg from "./renderers/svg";

luogu(108135)
  .then((activities) =>
    toSvg(activities, DateTime.now().minus({ years: 1 }), DateTime.now())
  )
  .then(console.log)
  .catch(console.error);
