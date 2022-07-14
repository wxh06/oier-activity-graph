import axios from "axios";
import { DateTime } from "luxon";
import type { DataResponse, List, RecordBase } from "./api-docs/luogu-api";

const cache: Record<number, RecordBase[]> = {};

const fetchRecordPage = (
  user: number,
  page: number,
  cached: RecordBase[]
): Promise<RecordBase[]> =>
  axios
    .get<DataResponse<{ records: List<RecordBase> }>>(
      `https://www.luogu.com.cn/record/list?user=${user}&page=${page}`,
      {
        headers: {
          "x-luogu-type": "content-only",
          cookie: process.env.LUOGU_COOKIE!,
        },
      }
    )
    .then(({ data }) => data.currentData.records)
    .then(async (records) => {
      if (records.result.length < records.perPage!) return records.result;
      const index = cached
        .map(({ id }) => id)
        .indexOf(records.result[records.result.length - 1].id);
      if (index >= 0) return records.result.concat(cached.slice(index + 1));
      return records.result.concat(
        await fetchRecordPage(user, page + 1, cached)
      );
    });

const getRecords = async (user: number) => {
  const records = await fetchRecordPage(user, 1, cache[user] ?? []);
  cache[user] = records;
  return records;
};

const activitiesPerDay = async (user: number) => {
  const activities: Record<string, number> = {};
  (await getRecords(user))
    .map(({ submitTime }) => DateTime.fromSeconds(submitTime).toISODate())
    .forEach((date) => {
      activities[date] = (activities[date] ?? 0) + 1;
    });
  return activities;
};

export default activitiesPerDay;
