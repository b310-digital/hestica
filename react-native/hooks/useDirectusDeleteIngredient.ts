import { useEffect, useState } from "react";
import { BasicDirectusErrorExtensions } from "../lib/directus";
import { deleteIngredient } from "../utils/server";
import { useDirectusGetClient } from "./useDirectusGetClient";

export const useDirectusDeleteIngredient = () => {
  const [errors, setErrors] = useState<BasicDirectusErrorExtensions[]>([]);
  const [result, setResult] = useState<string>();
  const { client, errors: clientErrors } = useDirectusGetClient();

  const removeIngredient = (ingredientId: string) => {
    deleteIngredient(client)(ingredientId)
      .then(() => {
        setResult(ingredientId);
      })
      .catch(({ errors }) => setErrors(errors));
  };

  useEffect(() => {
    if (clientErrors.length === 0) return;

    setErrors(clientErrors);
  }, [clientErrors]);

  return { client, removeIngredient, result, errors };
};
