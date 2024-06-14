import * as fs from 'fs';
import fetch from 'cross-fetch';

// const TARGET_DIRECTUS_URL = process.env.DIRECTUS_STAGING_URL;
// const TARGET_ACCESS_TOKEN = process.env.DIRECTUS_STAGING_ACCESS_TOKEN;

const BASE_DIRECTUS_URL = process.env.DIRECTUS_LOCAL_URL;
const BASE_ACCESS_TOKEN = process.env.DIRECTUS_LOCAL_ACCESS_TOKEN;

async function main() {
	const snapshot = await getSnapshot();
	writeSchema(snapshot)
	//const diff = await getDiff(snapshot);
	//await applyDiff(diff);
}

main();

async function writeSchema(jsonData: any) {
	try {
		fs.writeFileSync('../schema.json', JSON.stringify(jsonData));
		console.log('JSON data saved to file successfully.');
	} catch (error) {
		console.error('Error writing JSON data to file:', error);
	}
}

async function getSnapshot() {
	const URL = `${BASE_DIRECTUS_URL}/schema/snapshot?access_token=${BASE_ACCESS_TOKEN}`;
	const { data } = await fetch(URL).then((r: any) => r.json());
	return data;
}

// async function getDiff(snapshot: any) {
// 	const URL = `${TARGET_DIRECTUS_URL}/schema/diff?access_token=${TARGET_ACCESS_TOKEN}`;

// 	const { data } = await fetch(URL, {
// 		method: 'POST',
// 		body: JSON.stringify(snapshot),
// 		headers: {
// 			'Content-Type': 'application/json',
// 		},
// 	}).then((r: any) => { return r.json() }); // TODO: throws error when status equals 204 and content is empty

// 	return data;
// }

// async function applyDiff(diff: any) {
// 	const URL = `${TARGET_DIRECTUS_URL}/schema/apply?access_token=${TARGET_ACCESS_TOKEN}`;

// 	await fetch(URL, {
// 		method: 'POST',
// 		body: JSON.stringify(diff),
// 		headers: {
// 			'Content-Type': 'application/json',
// 		},
// 	});
// }