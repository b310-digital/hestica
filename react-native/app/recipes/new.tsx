import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  RecipeFormValues,
  RecipeInputForm,
} from "../../components/RecipeInputForm";
import { useDirectusCreateRecipe } from "../../hooks/useDirectusCreateRecipe";
import { BasicDirectusErrorExtensions } from "../../lib/directus";
import { useTranslation } from "react-i18next";

export default function RecipeNew() {
  const router = useRouter();
  const [serverErrors, setServerErrors] = useState<
    BasicDirectusErrorExtensions[]
  >([]);
  const {
    createRecipe,
    errors: createRecipeErrors,
    recipe: createdRecipe,
    createImageErrors,
    createImageLoading,
  } = useDirectusCreateRecipe();
  const { t } = useTranslation();

  useEffect(() => {
    // Either image result is undefined (no image provided) or true/false depending if the upload succeeded
    if (createdRecipe && !createImageLoading && createRecipeErrors.length === 0)
      router.push(`recipes/${createdRecipe.id}`);

    // If the recipe was created successfuly but the image wasn't, redirect to edit page with default error messages
    if (createdRecipe && createImageErrors.length > 0)
      router.push({
        pathname: `recipes/${createdRecipe.id}/edit`,
        params: {
          error_code: createImageErrors[0]?.extensions?.code,
        },
      });
  }, [
    router,
    createdRecipe,
    createRecipeErrors,
    createImageErrors,
    createImageLoading,
  ]);

  useEffect(() => {
    setServerErrors([...createRecipeErrors]);
  }, [createRecipeErrors, setServerErrors]);

  const defaultValues = {
    name: "",
    description: "",
    instructions: [{}],
    ingredients: [{ item: null }],
  };

  const onSubmit = (data: RecipeFormValues) => {
    createRecipe(data);
  };

  return (
    <RecipeInputForm
      defaultValues={defaultValues}
      onSuccessfulSubmit={onSubmit}
      serverErrors={serverErrors}
      submitButtonLabel={t("button.create")}
    />
  );
}
