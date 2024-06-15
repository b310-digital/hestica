import * as fs from 'fs';
import fetch from 'cross-fetch';

const BASE_DIRECTUS_URL = process.env.DIRECTUS_LOCAL_URL;
const BASE_ACCESS_TOKEN = process.env.DIRECTUS_LOCAL_ACCESS_TOKEN;

async function main() {
	const snapshot = await getSnapshot();
	writeSchema(snapshot)
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