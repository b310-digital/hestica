import {
  createDirectus,
  authentication,
  rest,
  DirectusClient,
  RestClient,
  logout,
  DirectusUser,
  AuthenticationData,
  AuthenticationStorage,
} from "@directus/sdk";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { components as directusTypes } from "./schema";
import { ErrorCode } from "@directus/errors";

// https://docs.directus.io/guides/sdk/types.html
// https://docs.directus.io/packages/@directus/sdk/

export type Overwrite<Type, NewType> = Omit<Type, keyof NewType> & NewType;

// Overwrite schema types as the item type is only a single object instead of an array
export type Recipe = Overwrite<
  directusTypes["schemas"]["ItemsRecipes"],
  {
    ingredients:
      | (
          | number
          | Overwrite<RecipeIngredient, { item: string | Ingredient | null }>
        )[]
      | null;
  }
>;
export type RecipeIngredient =
  directusTypes["schemas"]["ItemsRecipesIngredients"];
export type Ingredient = directusTypes["schemas"]["ItemsIngredients"];
export type Instruction = directusTypes["schemas"]["ItemsInstructions"];
export type LoginUser = { email: string; password: string };
// leave avatar for know as new type problems arise and currently not needed
export type User = Overwrite<
  Omit<DirectusUser<directusTypes["schemas"]>, "avatar">,
  { last_access: string | null }
>;

export interface SchemaTypes {
  recipes: Recipe[];
  recipesIngredients: RecipeIngredient[];
  ingredients: Ingredient[];
  instructions: Instruction[];
  users: User[];
}

export type BasicDirectusErrorExtensions = {
  code: ErrorCode;
  extensions: { code: ErrorCode };
  message: string;
};

export class NoAuthCredsGiven extends Error {
  constructor(message?: string | undefined) {
    super(message);
    this.name = "NoAuthCredsGiven";
  }
}

export const authLocalStorage = () =>
  ({
    get: async (): Promise<AuthenticationData | undefined> => {
      const directusStorage = await AsyncStorage.getItem("directus-data");
      if (!directusStorage) return;

      return JSON.parse(directusStorage) as AuthenticationData;
    },

    set: async (data: AuthenticationData) => {
      return AsyncStorage.setItem("directus-data", JSON.stringify(data));
    },
  }) as AuthenticationStorage;

class DirectusAppClient {
  private static client: DirectusClient<SchemaTypes> & RestClient<SchemaTypes>;

  static getPublicClient() {
    if (
      !process.env.EXPO_PUBLIC_DIRECTUS_URL ||
      !process.env.EXPO_PUBLIC_DIRECTUS_LOCAL_USER_CREATE_PUBLIC_TOKEN
    )
      throw new NoAuthCredsGiven();

    return createDirectus<SchemaTypes>(
      process.env.EXPO_PUBLIC_DIRECTUS_URL,
    ).with(rest());
  }

  static async getClient(): Promise<
    (DirectusClient<SchemaTypes> & RestClient<SchemaTypes>) | undefined
  > {
    if (!process.env.EXPO_PUBLIC_DIRECTUS_URL) throw new NoAuthCredsGiven();
    if (!(await DirectusAppClient.getTokenExpiryTime())) return;
    // During a page reload, client is undefined but access tokes remain in storage
    if (!this.client) {
      this.client = createDirectus<SchemaTypes>(
        process.env.EXPO_PUBLIC_DIRECTUS_URL,
      )
        .with(authentication("json", { storage: authLocalStorage() }))
        .with(rest());
    }

    return this.client;
  }

  static async logout() {
    if (!this.client) return;

    const storage = authLocalStorage();
    const data = await storage.get();
    if (!data || !data.refresh_token) return;

    await this.client.request(logout(data.refresh_token, "json"));
    storage.set(null);
  }

  static async deleteLocalAuthData() {
    const storage = authLocalStorage();
    storage.set(null);
  }

  static async getTokenExpiryTime(): Promise<number | null | undefined> {
    const storage = authLocalStorage();
    const data = await storage.get();

    return data?.expires_at;
  }

  static async getAccessToken(): Promise<string | null | undefined> {
    const storage = authLocalStorage();
    const data = await storage.get();

    return data?.access_token;
  }

  static async createClient(email: string, password: string) {
    if (!process.env.EXPO_PUBLIC_DIRECTUS_URL)
      return Promise.reject(new NoAuthCredsGiven());

    const client = createDirectus<SchemaTypes>(
      process.env.EXPO_PUBLIC_DIRECTUS_URL,
    )
      .with(authentication("json", { storage: authLocalStorage() }))
      .with(rest());

    // login using the authentication composable
    const result = await client.login(email, password);
    this.client = client;

    return result;
  }
}

export { DirectusAppClient };
