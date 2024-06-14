import { useEffect, useState } from "react";
import { BasicDirectusErrorExtensions } from "../lib/directus";
import { deleteRecipe } from "../utils/server";
import { useDirectusGetClient } from "./useDirectusGetClient";

export const useDirectusDeleteRecipe = () => {
  const [errors, setErrors] = useState<BasicDirectusErrorExtensions[]>([]);
  const [result, setResult] = useState<boolean>();
  const { client, errors: clientErrors } = useDirectusGetClient();

  const removeRecipe = (recipeId: string) => {
    if (!client) return;

    deleteRecipe(client)(recipeId)
      .then(() => {
        setResult(true);
      })
      .catch(({ errors }) => setErrors(errors));
  };

  useEffect(() => {
    if (clientErrors.length === 0) return;

    setErrors(clientErrors);
  }, [clientErrors]);

  return { client, removeRecipe, result, errors };
};
