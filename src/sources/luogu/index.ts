import axios from "axios";
import type { DataResponse, List, RecordBase } from "./api-docs/luogu-api";

const getRecords = (user: string, page = 1): Promise<RecordBase[]> =>
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
      return records.result.concat(await getRecords(user, page + 1));
    });

getRecords("108135")
  .then((records) => records.map(({ submitTime }) => submitTime))
  .then((t) => t.map((time) => new Date(time * 1000)))
  .then(console.log)
  .catch(console.error);
