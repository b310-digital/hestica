import * as fs from 'fs';
import fetch from 'cross-fetch';

// const TARGET_DIRECTUS_URL = process.env.DIRECTUS_STAGING_URL;
// const TARGET_ACCESS_TOKEN = process.env.DIRECTUS_STAGING_ACCESS_TOKEN;

const BASE_DIRECTUS_URL = process.env.DIRECTUS_LOCAL_URL;
const BASE_ACCESS_TOKEN = process.env.DIRECTUS_LOCAL_ACCESS_TOKEN;

async function main() {
	const permissions = await listPermissions();
	writeSchema(permissions, '../permissions.json')
	const roles = await listRoles();
  writeSchema(roles, '../roles.json')
	//const diff = await getDiff(snapshot);
	//await applyDiff(diff);
}
main();

async function writeSchema(jsonData: any, filename: string) {
	try {
		fs.writeFileSync(filename, JSON.stringify(jsonData));
		console.log('JSON data saved to file successfully.');
	} catch (error) {
		console.error('Error writing JSON data to file:', error);
	}
}

async function listPermissions() {
	const URL = `${BASE_DIRECTUS_URL}/permissions?access_token=${BASE_ACCESS_TOKEN}`;
	const { data } = await fetch(URL).then((r: any) => r.json());
	return data;
}

async function listRoles() {
	const URL = `${BASE_DIRECTUS_URL}/roles?access_token=${BASE_ACCESS_TOKEN}`;
	const { data } = await fetch(URL).then((r: any) => r.json());
	return data;
}
