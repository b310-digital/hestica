import * as fs from 'fs';
import fetch from 'cross-fetch';

const BASE_DIRECTUS_URL = process.env.DIRECTUS_LOCAL_URL;
const BASE_ACCESS_TOKEN = process.env.DIRECTUS_LOCAL_ACCESS_TOKEN;

async function main() {
	const snapshot = await readSchema();
	const diff = await getDiff(snapshot);
	await applyDiff(diff);
}

main();

async function getDiff(snapshot: any) {
	const URL = `${BASE_DIRECTUS_URL}/schema/diff?access_token=${BASE_ACCESS_TOKEN}`;

	const { data } = await fetch(URL, {
		method: 'POST',
		body: snapshot,
		headers: {
			'Content-Type': 'application/json',
		},
	}).then((r: any) => { return r.json() });

  return data;
}

async function applyDiff(diff: any) {
	const URL = `${BASE_DIRECTUS_URL}/schema/apply?access_token=${BASE_ACCESS_TOKEN}`;

	await fetch(URL, {
		method: 'POST',
		body: JSON.stringify(diff),
		headers: {
			'Content-Type': 'application/json',
		},
	});
}

async function readSchema(): Promise<any> {
	return fs.readFileSync('../schema.json', { encoding: 'utf8', flag: 'r' });
}