declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DIRECTUS_STAGING_URL: string;
      DIRECTUS_STAGING_ACCESS_TOKEN: string;
      DIRECTUS_LOCAL_URL: string;
      DIRECTUS_LOCAL_ACCESS_TOKEN: string;
    }
  }
}

export {}