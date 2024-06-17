import { useCallback, useEffect, useState } from "react";
import { BasicDirectusErrorExtensions, Ingredient } from "../lib/directus";
import { postIngredient } from "../utils/server";
import { useDirectusGetClient } from "./useDirectusGetClient";

export const useDirectusCreateIngredient = () => {
  const [errors, setErrors] = useState<BasicDirectusErrorExtensions[]>([]);
  const [ingredient, setIngredient] = useState<Ingredient>();
  const { client, errors: clientErrors } = useDirectusGetClient();

  const createIngredient = useCallback(
    (name: string) => {
      if (!client) return;

      postIngredient(client)(name)
        .then((newIngredient) => {
          setIngredient(newIngredient);
        })
        .catch(({ errors }) => setErrors(errors));
    },
    [client, setIngredient, setErrors],
  );

  useEffect(() => {
    if (clientErrors.length === 0) return;

    setErrors(clientErrors);
  }, [clientErrors]);

  return { client, createIngredient, ingredient, errors };
};
