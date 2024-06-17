import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { SafeAreaView, StyleSheet, ScrollView, View } from "react-native";
import {
  Card,
  Divider,
  FAB,
  Icon,
  List,
  SegmentedButtons,
  Text,
} from "react-native-paper";
import { Query } from "@directus/sdk";
import { Recipe, SchemaTypes } from "../../../lib/directus";
import Ionicons from "@expo/vector-icons/Ionicons";
import { theme } from "../../../theme";
import { useDirectusGetRecipe } from "../../../hooks/useDirectusGetRecipe";
import { useDirectusGetRecipeImage } from "../../../hooks/useDirectusGetRecipeImage";
import { handleDirectusErrors } from "../../../utils/server";
import { useDirectusGetAccessToken } from "../../../hooks/useDirectusGetAccessToken";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import { Image } from "expo-image";

const recipeFields = Object.freeze([
  "*",
  "ingredients.*",
  "ingredients.item.*",
  "instructions.*",
]) as Query<SchemaTypes, Recipe>["fields"];

export default function RecipeDetailScreen() {
  const { t } = useTranslation();
  const { token } = useDirectusGetAccessToken();
  const { recipe_id } = useLocalSearchParams<{ recipe_id: string }>();
  const [currentView, setCurrentView] = useState<string>("ingredients");
  const router = useRouter();
  const navigation = useNavigation();
  const { recipe, errors: fetchRecipeErrors } = useDirectusGetRecipe(
    recipe_id,
    recipeFields,
  );
  const {
    recipeImageUrl,
    setImageId,
    errors: imageErrors,
  } = useDirectusGetRecipeImage(undefined);
  const [formatter] = useState<Intl.NumberFormat>(
    new Intl.NumberFormat(i18n.language),
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
    },
    fab: {
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 10,
    },
  });

  useEffect(() => {
    const newImageId =
      typeof recipe?.image === "string" ? recipe.image : undefined;
    setImageId(newImageId);
  }, [recipe, setImageId]);

  useEffect(() => {
    const errors = [...fetchRecipeErrors, ...imageErrors];
    handleDirectusErrors(router)(errors);
  }, [router, fetchRecipeErrors, imageErrors]);

  useEffect(() => {
    if (!recipe) return;

    navigation.setOptions({
      title: recipe.name,
      headerLeft: () => (
        <Ionicons
          style={{ marginLeft: 11, marginRight: 11, padding: 3 }}
          name="arrow-back"
          size={24}
          onPress={() => router.replace(`/recipes`)}
        />
      ),
    });
  }, [navigation, router, recipe]);

  const renderTime = (time: number | null | undefined) => {
    if (!time) return t("time.none");
    return t("time.minutes", { time });
  };

  const renderInstructions = (
    instructions: Recipe["instructions"],
  ): ReactElement[] => {
    if (!instructions || instructions.length === 0)
      return [
        <List.Item key={`instruction-0`} title={t("instructions.list.none")} />,
      ];

    return instructions.map((instruction, index) => {
      if (typeof instruction === "number" || !instruction.description)
        return (
          <List.Item
            key={`instruction-${index}`}
            title={t("instructions.list.none")}
          />
        );

      return (
        <List.Item
          key={`instruction-${instruction.id}`}
          style={{
            borderTopWidth: 1,
            borderColor: theme.colors.border,
          }}
          title={instruction.title}
          description={instruction.description}
          descriptionNumberOfLines={10}
          left={(props) => (
            <Text style={{ fontWeight: "bold", alignContent: "center" }}>
              {index + 1}.
            </Text>
          )}
        />
      );
    });
  };

  const renderIngredientEntries = (
    ingredients: Recipe["ingredients"],
  ): ReactNode => {
    const ingredientNodes = ingredients
      ?.filter((ingredient) => {
        return (
          typeof ingredient !== "number" &&
          typeof ingredient.item !== "string" &&
          ingredient?.item?.name
        );
      })
      .map((ingredient) => {
        if (
          typeof ingredient === "number" ||
          typeof ingredient.item === "string"
        )
          return <List.Item title={t("ingredients.list.none")}></List.Item>;
        return (
          <List.Item
            key={`ingredient-${ingredient.id}`}
            title={`${ingredient?.item?.name}${ingredient.amount || ingredient.unit ? ":" : ""} ${formatter.format(ingredient.amount || 0) || ""} ${t(`units.${ingredient.unit}`) || ""}${ingredient.description ? `, ${ingredient.description}` : ""}`}
            style={{ borderTopWidth: 1, borderColor: theme.colors.border }}
          />
        );
      });

    if (ingredientNodes && ingredientNodes.length > 0) return ingredientNodes;

    return [
      <List.Item
        key="ingredient-0"
        title={t("ingredients.list.none")}
      ></List.Item>,
    ];
  };

  if (!recipe) return <></>;
  return (
    <View style={{ height: "100%", width: "100%" }}>
      <ScrollView>
        <Card style={{ flex: 1, minHeight: "100%" }} theme={theme}>
          <Card.Content style={{ padding: 0 }}>
            <Image
              source={{
                uri: recipeImageUrl,
                headers: { Authorization: `Bearer ${token}` },
              }}
              contentFit="cover"
              style={{ height: 200 }}
            />
            <View style={{ padding: 10 }}>
              <Text
                variant="titleLarge"
                style={{ marginBottom: 20 }}
              >{`${recipe.name}${recipe.description ? ":" : ""} ${recipe.description || ""}`}</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginRight: 20,
                  }}
                >
                  <Icon source="abacus" size={20} />
                  <Text style={{ marginLeft: 5 }}>
                    {recipe.yield || t("recipes.yield.none")}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginRight: 20,
                  }}
                >
                  <Icon source="knife" size={20} />
                  <Text style={{ marginLeft: 5 }}>
                    {renderTime(recipe.prep_time)}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Icon source="timer" size={20} />
                  <Text style={{ marginLeft: 5 }}>
                    {renderTime(recipe.cook_time)}
                  </Text>
                </View>
              </View>
              <SafeAreaView style={styles.container}>
                <SegmentedButtons
                  value={currentView}
                  onValueChange={setCurrentView}
                  theme={theme}
                  style={{ marginBottom: 10, width: "100%" }}
                  buttons={[
                    {
                      value: "ingredients",
                      icon: "basket",
                      label: t("ingredients"),
                    },
                    {
                      value: "instructions",
                      icon: "view-list-outline",
                      label: t("instructions"),
                    },
                  ]}
                />
              </SafeAreaView>

              {currentView === "instructions" && (
                <List.Section>
                  {renderInstructions(recipe.instructions)}
                </List.Section>
              )}

              {currentView === "ingredients" && (
                <List.Section>
                  {renderIngredientEntries(recipe.ingredients)}
                </List.Section>
              )}
              <Divider />
              <View
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Icon source="source-commit" size={20} />
                <Text>{recipe.source || t("recipes.source.none")}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
      <FAB
        icon="pencil"
        style={styles.fab}
        theme={theme}
        onPress={() => router.push(`recipes/${recipe_id}/edit`)}
      />
    </View>
  );
}
