import * as fs from "fs";
import fetch from "cross-fetch";
import { Permission, RoleWithoutUsers } from "./types";

const BASE_DIRECTUS_URL = process.env.DIRECTUS_LOCAL_URL;
const BASE_ACCESS_TOKEN = process.env.DIRECTUS_LOCAL_ACCESS_TOKEN;

async function main() {
  const permissions = await listPermissions();
  writeFile(permissions, "../permissions.json");
  const roles = await listRoles();
  writeFile(roles, "../roles.json");
}

main();

async function writeFile(
  jsonData: Permission[] | RoleWithoutUsers[],
  filename: string,
) {
  try {
    fs.writeFileSync(filename, JSON.stringify(jsonData));
    console.log("JSON data saved to file successfully.");
  } catch (error) {
    console.error("Error writing JSON data to file:", error);
  }
}

async function listPermissions(): Promise<Permission[]> {
  const adminRoles = await fetchAdminRole();
  const adminRoleId = adminRoles?.id;
  const URL = `${BASE_DIRECTUS_URL}/permissions?filter[role][_neq]=${adminRoleId}`;
  const { data } = await fetch(URL, {
    headers: { authorization: `Bearer ${BASE_ACCESS_TOKEN}` },
  }).then((r: any) => r.json());
  return data;
}

async function listRoles(): Promise<RoleWithoutUsers[]> {
  const URL = `${BASE_DIRECTUS_URL}/roles?filter[name][_neq]=Administrator&fields=id,name,icon,description,ip_access,enforce_tfa,admin_access,app_access`;
  const { data } = await fetch(URL, {
    headers: { authorization: `Bearer ${BASE_ACCESS_TOKEN}` },
  }).then((r) => r.json());
  return data;
}

async function fetchAdminRole(): Promise<RoleWithoutUsers> {
  const URL = `${BASE_DIRECTUS_URL}/roles?filter[name][_eq]=Administrator&fields=id,name`;
  const { data } = await fetch(URL, {
    headers: { authorization: `Bearer ${BASE_ACCESS_TOKEN}` },
  }).then((r) => r.json());
  return data[0];
}
