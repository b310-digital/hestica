import { useEffect, useState } from "react";
import { BasicDirectusErrorExtensions, Recipe } from "../lib/directus";
import { putRecipeImage } from "../utils/server";
import { useDirectusGetClient } from "./useDirectusGetClient";

export const useDirectusUpdateRecipeImage = () => {
  const [errors, setErrors] = useState<BasicDirectusErrorExtensions[]>([]);
  const [result, setResult] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>();
  const { client, errors: clientErrors } = useDirectusGetClient();

  const updateRecipeImage = (
    recipe: Recipe,
    imageUrl: string | undefined,
    dirty: boolean | undefined,
    name: string | undefined,
  ) => {
    if (!client) return;

    setLoading(true);
    putRecipeImage(client)(recipe, imageUrl, dirty, name)
      .then((_result) => {
        setResult(true);
        setErrors([]);
        setLoading(false);
      })
      .catch(({ errors }) => {
        setResult(false);
        setErrors(errors);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (clientErrors.length === 0) return;

    setErrors(clientErrors);
  }, [clientErrors]);

  return { client, updateRecipeImage, result, errors, loading };
};
