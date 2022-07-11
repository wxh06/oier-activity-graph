import axios from "axios";
import type { DataResponse, List, RecordBase } from "./api-docs/luogu-api";

const cache: Record<number, RecordBase[]> = {};

const getRecordPage = (
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
      return records.result.concat(await getRecordPage(user, page + 1, cached));
    });

const getRecords = async (user: number) => {
  const records = await getRecordPage(user, 1, cache[user] ?? []);
  cache[user] = records;
  return records;
};

getRecords(108135)
  .then((records) => records.map(({ submitTime }) => submitTime))
  .then((t) => t.map((time) => new Date(time * 1000)))
  .then(console.log)
  .catch(console.error);
