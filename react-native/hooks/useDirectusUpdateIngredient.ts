import { useEffect, useState } from "react";
import { BasicDirectusErrorExtensions, Ingredient } from "../lib/directus";
import { putIngredient } from "../utils/server";
import { useDirectusGetClient } from "./useDirectusGetClient";

export const useDirectusUpdateIngredient = () => {
  const [errors, setErrors] = useState<BasicDirectusErrorExtensions[]>([]);
  const [ingredient, setIngredient] = useState<Ingredient>();
  const { client, errors: clientErrors } = useDirectusGetClient();

  const updateIngredient = (
    ingredientId: string,
    data: Partial<Ingredient>,
  ) => {
    if (!client) return;

    putIngredient(client)(ingredientId, data)
      .then((updatedIngredient) => {
        setErrors([]);
        setIngredient(updatedIngredient);
      })
      .catch(({ errors: ingredientErrors }) => setErrors(ingredientErrors));
  };

  useEffect(() => {
    if (clientErrors.length === 0) return;

    setErrors(clientErrors);
  }, [clientErrors]);

  return { client, updateIngredient, ingredient, errors };
};
