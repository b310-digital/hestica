import { useEffect, useState } from "react";
import { BasicDirectusErrorExtensions, Recipe } from "../lib/directus";
import { putRecipe } from "../utils/server";
import { DirtyProps, RecipeFormValues } from "../components/RecipeInputForm";
import { useDirectusUpdateRecipeImage } from "./useDirectusUpdateRecipeImage";
import { useDirectusGetClient } from "./useDirectusGetClient";

export const useDirectusUpdateRecipe = () => {
  const [errors, setErrors] = useState<BasicDirectusErrorExtensions[]>([]);
  const [recipe, setRecipe] = useState<Recipe>();
  const { client, errors: clientErrors } = useDirectusGetClient();
  const {
    updateRecipeImage,
    result: updateImageResult,
    errors: updateImageErrors,
    loading: updateImageLoading,
  } = useDirectusUpdateRecipeImage();

  const updateRecipe = (
    recipeId: string,
    data: RecipeFormValues,
    dirtyFields: Partial<Readonly<DirtyProps<RecipeFormValues>>>,
  ) => {
    if (!client) return;

    putRecipe(client)(recipeId, data)
      .then(async (updatedRecipe) => {
        updateRecipeImage(
          updatedRecipe,
          data.recipe_image_asset,
          dirtyFields.recipe_image_asset,
          data.name,
        );
        setErrors([]);
        setRecipe(updatedRecipe);
      })
      .catch(({ errors: recipeErrors }) => setErrors(recipeErrors));
  };

  useEffect(() => {
    if (clientErrors.length === 0) return;

    setErrors(clientErrors);
  }, [clientErrors]);

  return {
    client,
    updateRecipe,
    recipe,
    errors,
    updateImageErrors,
    updateImageResult,
    updateImageLoading,
  };
};
