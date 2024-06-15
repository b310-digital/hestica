import * as fs from 'fs';
import fetch from 'cross-fetch';

const BASE_DIRECTUS_URL = process.env.DIRECTUS_LOCAL_URL;
const BASE_ACCESS_TOKEN = process.env.DIRECTUS_LOCAL_ACCESS_TOKEN;

async function main() {
	const permissions = await listPermissions();
	writeSchema(permissions, '../permissions.json')
	const roles = await listRoles();
  writeSchema(roles, '../roles.json')
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

// TODO: remove admin permissions, as admin permissions are created by default

async function listPermissions() {
	const URL = `${BASE_DIRECTUS_URL}/permissions?access_token=${BASE_ACCESS_TOKEN}`;
	const { data } = await fetch(URL).then((r: any) => r.json());
	return data;
}

// TODO: remove user references and admin role, as the admin role is created by default

async function listRoles() {
	const URL = `${BASE_DIRECTUS_URL}/roles?access_token=${BASE_ACCESS_TOKEN}`;
	const { data } = await fetch(URL).then((r: any) => r.json());
	return data;
}
