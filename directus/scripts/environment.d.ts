declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DIRECTUS_LOCAL_URL: string;
      DIRECTUS_LOCAL_ACCESS_TOKEN: string;
    }
  }
}

export {};
