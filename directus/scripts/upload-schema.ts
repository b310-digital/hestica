import * as fs from "fs";
import fetch from "cross-fetch";
import { Schema } from "./types";

const BASE_DIRECTUS_URL = process.env.DIRECTUS_LOCAL_URL;
const BASE_ACCESS_TOKEN = process.env.DIRECTUS_LOCAL_ACCESS_TOKEN;

async function main() {
  const snapshot = await readSchema();
  const diff = await getDiff(snapshot);
  await applyDiff(diff);
}

main();

async function getDiff(snapshot: Schema) {
  const URL = `${BASE_DIRECTUS_URL}/schema/diff`;

  const { data } = await fetch(URL, {
    method: "POST",
    body: snapshot,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${BASE_ACCESS_TOKEN}`,
    },
  }).then((r) => {
    return r.json();
  });

  return data;
}

async function applyDiff(diff: object) {
  const URL = `${BASE_DIRECTUS_URL}/schema/apply`;

  await fetch(URL, {
    method: "POST",
    body: JSON.stringify(diff),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${BASE_ACCESS_TOKEN}`,
    },
  });
}

async function readSchema(): Promise<Schema> {
  return fs.readFileSync("../schema.json", { encoding: "utf8", flag: "r" });
}
