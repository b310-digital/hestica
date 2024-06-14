import {
  DirectusClient,
  Query,
  RestClient,
  createItem,
  customEndpoint,
  deleteFile,
  deleteItem,
  readItem,
  readItems,
  createUser,
  updateItem,
  withToken,
  readMe,
  deleteUser,
  readAssetBlob,
} from "@directus/sdk";
import {
  BasicDirectusErrorExtensions,
  Ingredient,
  LoginUser,
  NoAuthCredsGiven,
  Recipe,
  SchemaTypes,
  User,
} from "../lib/directus";
import { RecipeFormValues } from "../components/RecipeInputForm";
import { ErrorCode } from "@directus/errors";
import { ExpoRouter } from "expo-router/types/expo-router";

export const fetchRecipes =
  (
    directusClient:
      | (DirectusClient<SchemaTypes> & RestClient<SchemaTypes>)
      | undefined,
  ) =>
  (): Promise<Recipe[]> => {
    if (!directusClient) return Promise.reject(new NoAuthCredsGiven());

    return directusClient.request(
      readItems("recipes", {
        filter: {
          user_created: {
            _eq: "$CURRENT_USER",
          },
        },
      }),
    );
  };

export const fetchRecipe =
  (
    directusClient:
      | (DirectusClient<SchemaTypes> & RestClient<SchemaTypes>)
      | undefined,
  ) =>
  (
    recipeId: string,
    recipeFields: Query<SchemaTypes, Recipe>["fields"],
  ): Promise<Recipe> => {
    if (!directusClient) return Promise.reject(new NoAuthCredsGiven());

    return directusClient.request(
      readItem("recipes", recipeId, { fields: recipeFields }),
    );
  };

export const fetchIngredients =
  (
    directusClient:
      | (DirectusClient<SchemaTypes> & RestClient<SchemaTypes>)
      | undefined,
  ) =>
  (): Promise<Ingredient[]> => {
    if (!directusClient) return Promise.reject(new NoAuthCredsGiven());

    return directusClient.request(readItems("ingredients"));
  };

export const postIngredient =
  (
    directusClient:
      | (DirectusClient<SchemaTypes> & RestClient<SchemaTypes>)
      | undefined,
  ) =>
  (name: string) => {
    if (!directusClient) return Promise.reject(new NoAuthCredsGiven());

    return directusClient.request(
      createItem("ingredients", {
        name,
      }),
    );
  };

export const fetchRecipeImage =
  (
    directusClient:
      | (DirectusClient<SchemaTypes> & RestClient<SchemaTypes>)
      | undefined,
  ) =>
  async (imageId: string, callback: (e: ProgressEvent<FileReader>) => void) => {
    if (!directusClient) return;

    const imageBlob = await directusClient.request(
      readAssetBlob(imageId, { key: "system-large-cover" }),
    );
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(imageBlob);
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (typeof e?.target?.result === "string") {
        callback(e);
      }
    };
  };

export const putRecipe =
  (
    directusClient:
      | (DirectusClient<SchemaTypes> & RestClient<SchemaTypes>)
      | undefined,
  ) =>
  async (
    recipeId: string | undefined,
    data: RecipeFormValues,
  ): Promise<Recipe> => {
    if (!directusClient || !recipeId)
      return Promise.reject(new NoAuthCredsGiven());

    return directusClient.request(
      updateItem("recipes", recipeId, mapRecipeFormDataToDirectus(data)),
    );
  };

export const putIngredient =
  (
    directusClient:
      | (DirectusClient<SchemaTypes> & RestClient<SchemaTypes>)
      | undefined,
  ) =>
  async (
    ingredientId: string | undefined,
    data: Partial<Ingredient>,
  ): Promise<Ingredient> => {
    if (!directusClient || !ingredientId)
      return Promise.reject(new NoAuthCredsGiven());

    return directusClient.request(
      updateItem("ingredients", ingredientId, {
        name: data.name,
      }),
    );
  };

export const postRecipe =
  (
    directusClient:
      | (DirectusClient<SchemaTypes> & RestClient<SchemaTypes>)
      | undefined,
  ) =>
  async (data: RecipeFormValues): Promise<Recipe> => {
    if (!directusClient) return Promise.reject(new NoAuthCredsGiven());

    return directusClient.request(
      createItem("recipes", mapRecipeFormDataToDirectus(data)),
    );
  };

export const putRecipeImage =
  (
    directusClient:
      | (DirectusClient<SchemaTypes> & RestClient<SchemaTypes>)
      | undefined,
  ) =>
  async (
    recipe: Recipe,
    imageAsset: string | undefined,
    isImageAssetDirty: boolean | undefined,
    name: string | undefined,
  ): Promise<boolean> => {
    if (!directusClient) return Promise.reject(new NoAuthCredsGiven());
    if (isImageAssetDirty && imageAsset) {
      const blob = await (await fetch(imageAsset)).blob();

      const formData = new FormData();
      formData.append("title", name || "recipe image");
      formData.append("file", blob);

      // https://github.com/directus/directus/discussions/10841
      const result: Response = await directusClient.request(
        customEndpoint({
          path: `/recipe-images/${recipe.id}`,
          method: "POST",
          body: formData,
          headers: { "Content-Type": "multipart/form-data" },
        }),
      );
      if (result.status > 399)
        return Promise.reject({
          errors: [
            {
              data: JSON.stringify(result.body),
              extensions: { code: ErrorCode.ContentTooLarge },
            },
          ],
        });
    } else if (!imageAsset && recipe?.image) {
      const imageId =
        typeof recipe.image === "object" ? recipe.image.id : recipe.image;
      if (imageId) {
        await directusClient.request(deleteFile(imageId));
        return true;
      }
    }
    return false;
  };

export const deleteRecipe =
  (
    directusClient:
      | (DirectusClient<SchemaTypes> & RestClient<SchemaTypes>)
      | undefined,
  ) =>
  async (recipeId: string | undefined): Promise<void> => {
    if (!directusClient || !recipeId)
      return Promise.reject(new NoAuthCredsGiven());

    return directusClient.request(deleteItem("recipes", recipeId));
  };

export const deleteIngredient =
  (
    directusClient:
      | (DirectusClient<SchemaTypes> & RestClient<SchemaTypes>)
      | undefined,
  ) =>
  async (ingredientId: string | undefined): Promise<void> => {
    if (!directusClient || !ingredientId) return Promise.reject();

    return directusClient.request(deleteItem("ingredients", ingredientId));
  };

// errors[0].extensions.code === 'TOKEN_EXPIRED'
// TODO rename to handleGlobalDirectusErrors?
// Handling globally errors, e.g. permission denied, token outtdated
export const handleDirectusErrors =
  (router: ExpoRouter.Router) => (errors: BasicDirectusErrorExtensions[]) => {
    if (!errors || errors.length === 0) return;

    const permissionError = errors.find(
      (error) => error.extensions.code === ErrorCode.Forbidden,
    );
    if (permissionError) router.replace("/login");
  };

export const postUser =
  (
    directusClient:
      | (DirectusClient<SchemaTypes> & RestClient<SchemaTypes>)
      | undefined,
  ) =>
  (user: LoginUser): Promise<object> => {
    if (!directusClient) return Promise.reject(new NoAuthCredsGiven());
    if (!process.env.EXPO_PUBLIC_DIRECTUS_LOCAL_USER_CREATE_PUBLIC_TOKEN)
      throw new NoAuthCredsGiven();

    return directusClient.request(
      withToken(
        process.env.EXPO_PUBLIC_DIRECTUS_LOCAL_USER_CREATE_PUBLIC_TOKEN,
        createUser(user),
      ),
    );
  };

export const getUser =
  (
    directusClient:
      | (DirectusClient<SchemaTypes> & RestClient<SchemaTypes>)
      | undefined,
  ) =>
  (): Promise<User> => {
    if (!directusClient) return Promise.reject(new NoAuthCredsGiven());

    return directusClient.request(readMe());
  };

export const deleteUserWithId =
  (
    directusClient:
      | (DirectusClient<SchemaTypes> & RestClient<SchemaTypes>)
      | undefined,
  ) =>
  (userId: string): Promise<void> => {
    if (!directusClient) return Promise.reject(new NoAuthCredsGiven());

    return directusClient.request(deleteUser(userId));
  };

const mapRecipeFormDataToDirectus = (data: RecipeFormValues) => {
  return {
    name: data.name,
    description: data.description,
    cook_time: data.cook_time,
    prep_time: data.prep_time,
    yield: data.yield,
    source: data.source,
    ingredients: data.ingredients.map((ingredient) => {
      return { ...ingredient, collection: "ingredients" };
    }),
    instructions: data.instructions,
  };
};
