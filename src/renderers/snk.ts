import { createSvg } from "@snk/svg-creator";
import { parseEntry } from "@snk/action/outputsOptions";
import { userContributionToGrid } from "@snk/action/userContributionToGrid";
import { getBestRoute } from "@snk/solver/getBestRoute";
import { getPathToPose } from "@snk/solver/getPathToPose";
import { snake4 as snake } from "@snk/types/__fixtures__/snake";
import { DailyData } from "../utils";

function render(data: DailyData[][]) {
  const cells = data.flat();
  const grid = userContributionToGrid(
    cells.map((day) => ({
      ...day,
      date: day.date.toISODate(),
    }))
  );

  const chain = getBestRoute(grid, snake)!;
  chain.push(...getPathToPose(chain.slice(-1)[0], snake)!);

  const options = parseEntry("0.svg?palette=github-light")!;

  return createSvg(
    grid,
    cells,
    chain,
    options.drawOptions,
    options.animationOptions
  );
}

export default render;
