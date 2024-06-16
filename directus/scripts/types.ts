export interface RoleWithoutUsers {
  id?: string;
  name?: string;
  icon?: string;
  description?: string | null;
  ip_access?: string[];
  enforce_tfa?: boolean;
  admin_access?: boolean;
  app_access?: boolean;
}

export interface Permission {
  id?: number;
  role?: string | null;
  collection?: string;
  action?: "create" | "read" | "update" | "delete";
  permissions?: object | null;
  validation?: object | null;
  presets?: object | null;
  fields?: string[] | null;
}

export interface Schema {
  version?: number;
  directus?: string;
  vendor?: string;
  collections?: object[];
  fields?: object[];
  relations?: object[];
}
