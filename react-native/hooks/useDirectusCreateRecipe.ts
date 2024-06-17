import { useEffect, useState } from "react";
import { BasicDirectusErrorExtensions, Recipe } from "../lib/directus";
import { postRecipe } from "../utils/server";
import { RecipeFormValues } from "../components/RecipeInputForm";
import { useDirectusUpdateRecipeImage } from "./useDirectusUpdateRecipeImage";
import { useDirectusGetClient } from "./useDirectusGetClient";

export const useDirectusCreateRecipe = () => {
  const [errors, setErrors] = useState<BasicDirectusErrorExtensions[]>([]);
  const { client, errors: clientErrors } = useDirectusGetClient();
  const [recipe, setRecipe] = useState<Recipe>();
  const {
    updateRecipeImage,
    result: createImageResult,
    errors: createImageErrors,
    loading: createImageLoading,
  } = useDirectusUpdateRecipeImage();

  const createRecipe = (data: RecipeFormValues) => {
    if (!client) return;

    postRecipe(client)(data)
      .then(async (newRecipe) => {
        if (data.recipe_image_asset)
          updateRecipeImage(
            newRecipe,
            data.recipe_image_asset,
            true,
            data.name,
          );
        setErrors([]);
        setRecipe(newRecipe);
      })
      .catch(({ errors: recipeErrors }) => setErrors(recipeErrors));
  };

  useEffect(() => {
    if (clientErrors.length === 0) return;

    setErrors(clientErrors);
  }, [clientErrors]);

  return {
    client,
    createRecipe,
    recipe,
    errors,
    createImageErrors,
    createImageResult,
    createImageLoading,
  };
};
