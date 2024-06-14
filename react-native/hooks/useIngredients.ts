import { useEffect } from "react";
import { useDirectusCreateIngredient } from "./useDirectusCreateIngredient";
import { useDirectusGetIngredients } from "./useDirectusGetIngredients";
import { useDirectusDeleteIngredient } from "./useDirectusDeleteIngredient";
import { useDirectusUpdateIngredient } from "./useDirectusUpdateIngredient";

export const useIngredients = () => {
  const {
    ingredients,
    getIngredients,
    errors: getIngredientErrors,
  } = useDirectusGetIngredients();
  const { createIngredient, ingredient: recentIngredientCreated } =
    useDirectusCreateIngredient();
  const { removeIngredient, result: removeResult } =
    useDirectusDeleteIngredient();
  const { updateIngredient, ingredient: recentIngredientUpdated } =
    useDirectusUpdateIngredient();

  useEffect(() => {
    getIngredients();
  }, [
    recentIngredientCreated,
    recentIngredientUpdated,
    removeResult,
    getIngredients,
  ]);

  return {
    ingredients,
    createIngredient,
    recentIngredientCreated,
    recentIngredientUpdated,
    removeIngredient,
    removeResult,
    updateIngredient,
    getIngredientErrors,
  };
};
