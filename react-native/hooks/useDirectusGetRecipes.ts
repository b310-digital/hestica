import { useEffect, useState } from "react";
import { BasicDirectusErrorExtensions, Recipe } from "../lib/directus";
import { useDirectusGetClient } from "./useDirectusGetClient";
import { fetchRecipes } from "../utils/server";

export const useDirectusGetRecipes = () => {
  const [errors, setErrors] = useState<BasicDirectusErrorExtensions[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const { client, errors: clientErrors } = useDirectusGetClient();

  useEffect(() => {
    if (!client) return;

    fetchRecipes(client)()
      .then((recipes) => {
        setRecipes(recipes);
      })
      .catch(({ errors: newErrors }) => {
        setErrors(newErrors);
      });
  }, [client]);

  useEffect(() => {
    if (clientErrors.length === 0) return;

    setErrors(clientErrors);
  }, [clientErrors]);

  return { client, recipes, errors };
};
