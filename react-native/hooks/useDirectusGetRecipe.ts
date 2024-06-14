import { useEffect, useState } from "react";
import {
  BasicDirectusErrorExtensions,
  Recipe,
  SchemaTypes,
} from "../lib/directus";
import { Query } from "@directus/sdk";
import { fetchRecipe } from "../utils/server";
import { useDirectusGetClient } from "./useDirectusGetClient";

export const useDirectusGetRecipe = (
  recipeId: string | undefined,
  recipeFields?: Query<SchemaTypes, Recipe>["fields"],
) => {
  const [errors, setErrors] = useState<BasicDirectusErrorExtensions[]>([]);
  const [recipe, setRecipe] = useState<Recipe>();
  const { client, errors: clientErrors } = useDirectusGetClient();

  useEffect(() => {
    if (!recipeId || !client) return;

    fetchRecipe(client)(recipeId, recipeFields)
      .then((recipe) => {
        setRecipe(recipe);
      })
      .catch(({ errors }) => {
        console.log(errors);
        setErrors(errors);
      });
  }, [client, recipeId, recipeFields]);

  useEffect(() => {
    if (!clientErrors || clientErrors.length === 0) return;

    setErrors(clientErrors);
  }, [clientErrors]);

  return { client, recipe, errors };
};
