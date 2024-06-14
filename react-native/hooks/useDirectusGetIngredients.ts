import { useCallback, useEffect, useState } from "react";
import { BasicDirectusErrorExtensions, Ingredient } from "../lib/directus";
import { fetchIngredients } from "../utils/server";
import { useDirectusGetClient } from "./useDirectusGetClient";

export const useDirectusGetIngredients = () => {
  const [errors, setErrors] = useState<BasicDirectusErrorExtensions[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const { client, errors: clientErrors } = useDirectusGetClient();

  const getIngredients = useCallback(() => {
    if (!client) return;

    fetchIngredients(client)()
      .then((ingredients) => {
        setIngredients(ingredients);
      })
      .catch(({ errors }) => setErrors(errors));
  }, [client, setIngredients]);

  useEffect(() => {
    getIngredients();
  }, [getIngredients]);

  useEffect(() => {
    if (clientErrors.length === 0) return;

    setErrors(clientErrors);
  }, [clientErrors]);

  return { client, ingredients, errors, getIngredients };
};
