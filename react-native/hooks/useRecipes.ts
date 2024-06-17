import { useDirectusCreateRecipe } from "./useDirectusCreateRecipe";
import { useDirectusGetRecipes } from "./useDirectusGetRecipes";
import { useDirectusDeleteRecipe } from "./useDirectusDeleteRecipe";
import { useDirectusUpdateRecipe } from "./useDirectusUpdateRecipe";

// Convenience hook which combines multiple commently used recipe hooks.
// Attention: Upon mount, recipes are directly fetched!
export const useRecipes = () => {
  const { recipes, errors: getRecipesErrors } = useDirectusGetRecipes();
  const { createRecipe, recipe: recentRecipeCreated } =
    useDirectusCreateRecipe();
  const { removeRecipe, result: removeResult } = useDirectusDeleteRecipe();
  const { updateRecipe, recipe: recentRecipeUpdated } =
    useDirectusUpdateRecipe();

  return {
    recipes,
    createRecipe,
    recentRecipeCreated,
    recentRecipeUpdated,
    removeRecipe,
    removeResult,
    updateRecipe,
    getRecipesErrors,
  };
};
