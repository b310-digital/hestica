import * as fs from 'fs';
import fetch from 'cross-fetch';

const BASE_DIRECTUS_URL = process.env.DIRECTUS_LOCAL_URL;
const BASE_ACCESS_TOKEN = process.env.DIRECTUS_LOCAL_ACCESS_TOKEN;

async function main() {
	const snapshotRoles = await readRoles();
	await uploadSnapshot(snapshotRoles, "roles");
  const snapshotPermissions = await readPermissions();
	await uploadSnapshot(snapshotPermissions, "permissions");
}

main();

async function uploadSnapshot(snapshot: any, collection: string) {
	const URL = `${BASE_DIRECTUS_URL}/${collection}?access_token=${BASE_ACCESS_TOKEN}`;

	await fetch(URL, {
		method: 'POST',
		body: snapshot,
		headers: {
			'Content-Type': 'application/json',
		},
	});
}

async function readPermissions(): Promise<any> {
	return fs.readFileSync('../permissions.json', { encoding: 'utf8', flag: 'r' });
}

async function readRoles(): Promise<any> {
	return fs.readFileSync('../roles.json', { encoding: 'utf8', flag: 'r' });
}