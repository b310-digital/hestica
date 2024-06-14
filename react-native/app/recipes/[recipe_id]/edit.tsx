import React, { useEffect, useState } from "react";
import { Query } from "@directus/sdk";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ErrorCode } from "@directus/errors";
import {
  BasicDirectusErrorExtensions,
  Recipe,
  SchemaTypes,
} from "../../../lib/directus";
import {
  DirtyProps,
  RecipeFormValues,
  RecipeInputForm,
} from "../../../components/RecipeInputForm";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text } from "react-native";
import { Button, PaperProvider } from "react-native-paper";
import { theme } from "../../../theme";
import { useDirectusGetRecipeImage } from "../../../hooks/useDirectusGetRecipeImage";
import { useDirectusGetRecipe } from "../../../hooks/useDirectusGetRecipe";
import { useDirectusDeleteRecipe } from "../../../hooks/useDirectusDeleteRecipe";
import { useDirectusUpdateRecipe } from "../../../hooks/useDirectusUpdateRecipe";
import { handleDirectusErrors } from "../../../utils/server";
import DeleteDialog from "../../../components/DeleteDialog";
import { Trans, useTranslation } from "react-i18next";

const recipeFields = Object.freeze([
  "*",
  "ingredients.*",
  "ingredients.item.*",
  "instructions.*",
]) as Query<SchemaTypes, Recipe>["fields"];

export default function RecipeEdit() {
  const { t } = useTranslation();
  const { recipe_id, error_code } = useLocalSearchParams<{
    recipe_id: string;
    error_code: ErrorCode;
  }>();
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeFormValues>();
  const navigation = useNavigation();
  const [serverErrors, setServerErrors] = useState<
    BasicDirectusErrorExtensions[]
  >([]);
  const { recipe: fetchedRecipe, errors: fetchedRecipeErrors } =
    useDirectusGetRecipe(recipe_id, recipeFields);
  const {
    recipeImageUrl,
    setImageId,
    errors: fetchRecipeImageErrors,
  } = useDirectusGetRecipeImage(undefined);
  const {
    removeRecipe,
    result: deleteResult,
    errors: deletedRecipeErrors,
  } = useDirectusDeleteRecipe();
  const {
    updateRecipe,
    errors: updateRecipeErrors,
    recipe: updatedRecipe,
    updateImageErrors,
    updateImageLoading,
  } = useDirectusUpdateRecipe();

  const [deleteDialogVisible, setDeleteDialogVisible] = React.useState(false);
  const showDeleteDialog = () => setDeleteDialogVisible(true);
  const hideDeleteDialog = () => setDeleteDialogVisible(false);

  useEffect(() => {
    const newImageId =
      typeof fetchedRecipe?.image === "string"
        ? fetchedRecipe.image
        : undefined;
    setImageId(newImageId);
  }, [fetchedRecipe?.image, setImageId]);

  useEffect(() => {
    const defaultServerErrors = error_code
      ? [
          {
            code: error_code,
            message: "",
            extensions: { code: error_code },
          },
        ]
      : [];
    setServerErrors([
      ...updateRecipeErrors,
      ...deletedRecipeErrors,
      ...updateImageErrors,
      ...defaultServerErrors,
    ]);
  }, [
    updateImageErrors,
    deletedRecipeErrors,
    updateRecipeErrors,
    setServerErrors,
    error_code,
  ]);

  useEffect(() => {
    const errors = [
      ...updateRecipeErrors,
      ...fetchRecipeImageErrors,
      ...fetchedRecipeErrors,
      ...updateImageErrors,
      ...deletedRecipeErrors,
    ];
    handleDirectusErrors(router)(errors);
  }, [
    fetchRecipeImageErrors,
    fetchedRecipeErrors,
    updateImageErrors,
    deletedRecipeErrors,
    updateRecipeErrors,
    router,
  ]);

  useEffect(() => {
    if (!recipe) return;

    navigation.setOptions({
      title: t("recipes.title.edit", { name: recipe.name }),
      headerLeft: () => (
        <Ionicons
          style={{ marginLeft: 11, marginRight: 11, padding: 3 }}
          name="arrow-back"
          size={24}
          onPress={() => router.replace(`/recipes/${recipe.id}`)}
        />
      ),
    });
  }, [navigation, router, recipe, t]);

  useEffect(() => {
    if (deleteResult) router.replace("/recipes");
  }, [deleteResult, router]);

  useEffect(() => {
    if (fetchedRecipe && recipeImageUrl) {
      setRecipe({
        ...fetchedRecipe,
        ...{ recipe_image_asset: recipeImageUrl },
      } as RecipeFormValues);
    } else {
      setRecipe(fetchedRecipe as RecipeFormValues);
    }
  }, [fetchedRecipe, recipeImageUrl]);

  useEffect(() => {
    if (
      updatedRecipe?.id &&
      !updateImageLoading &&
      updateImageErrors.length === 0 &&
      updateRecipeErrors.length === 0
    )
      router.replace(`/recipes/${updatedRecipe.id}`);
  }, [
    updatedRecipe,
    updateRecipeErrors,
    updateImageErrors,
    router,
    updateImageLoading,
  ]);

  const onSubmit = async (
    data: RecipeFormValues,
    dirtyFields: Partial<Readonly<DirtyProps<RecipeFormValues>>>,
  ) => {
    if (!recipe_id) return;

    updateRecipe(recipe_id, data, dirtyFields);
  };

  const onDelete = async () => {
    hideDeleteDialog();
    if (recipe_id) removeRecipe(recipe_id);
  };

  if (recipe) {
    return (
      <PaperProvider>
        <View style={{ flex: 1 }}>
          <DeleteDialog
            isVisible={deleteDialogVisible}
            onCancel={hideDeleteDialog}
            onDelete={onDelete}
            title={t("recipes.delete")}
          >
            <Text>
              <Trans i18nKey="button.delete.recipes.warn" />
            </Text>
          </DeleteDialog>
          <RecipeInputForm
            defaultValues={recipe}
            onSuccessfulSubmit={onSubmit}
            submitButtonLabel={t("button.update")}
            serverErrors={serverErrors}
          >
            <Button
              onPress={showDeleteDialog}
              theme={theme}
              mode="contained"
              buttonColor={theme.colors.dangerBackground}
              textColor={theme.colors.onDanger}
            >
              <Trans i18nKey="button.delete" />
            </Button>
          </RecipeInputForm>
        </View>
      </PaperProvider>
    );
  } else {
    return (
      <View>
        <Text>
          <Trans i18nKey="recipes.selected.none" />
        </Text>
      </View>
    );
  }
}
