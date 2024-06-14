import { useEffect, useState } from "react";
import { useDirectusGetClient } from "./useDirectusGetClient";
import { BasicDirectusErrorExtensions } from "../lib/directus";

export const useDirectusGetRecipeImage = (
  initialImageId: string | undefined,
) => {
  const [errors, setErrors] = useState<BasicDirectusErrorExtensions[]>([]);
  const [recipeImageUrl, setRecipeImageUrl] = useState<string>();
  const [imageId, setImageId] = useState<string | undefined>(initialImageId);
  const { client, errors: clientErrors } = useDirectusGetClient();

  useEffect(() => {
    if (!imageId || !client) return;

    setRecipeImageUrl(
      `${process.env.EXPO_PUBLIC_DIRECTUS_URL}/assets/${imageId}?key=system-large-cover`,
    );
  }, [client, imageId]);

  useEffect(() => {
    if (!clientErrors || clientErrors.length === 0) return;

    setErrors(clientErrors);
  }, [clientErrors]);

  return { client, recipeImageUrl, errors, setImageId };
};
