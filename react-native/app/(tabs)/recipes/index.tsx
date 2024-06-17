import React, { useState } from "react";
import { useEffect } from "react";
import "react-native-url-polyfill/auto";
import { useRouter } from "expo-router";
import { FAB } from "react-native-paper";
import {
  StyleSheet,
  FlatList,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import { RecipeCardLazy } from "../../../components/RecipeCardLazy";
import { Recipe } from "../../../lib/directus";
import { theme } from "../../../theme";
import { handleDirectusErrors } from "../../../utils/server";
import NoData from "../../../components/NoData";
import { useRecipes } from "../../../hooks/useRecipes";
import { Trans } from "react-i18next";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const defaultCardWidth = 200;
const defaultNumberColumns = 2;

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 10,
  },
});

export default function Recipes() {
  const router = useRouter();
  const { recipes, getRecipesErrors } = useRecipes();
  const [numColumns, setNumColumns] = useState<number>(defaultNumberColumns);
  const { width } = useWindowDimensions();

  useEffect(() => {
    setNumColumns(calculateNumberColumns(width));
  }, [width]);

  const calculateNumberColumns = (width: number): number => {
    const cols = Math.floor(width / defaultCardWidth);
    return cols < defaultNumberColumns ? defaultNumberColumns : cols;
  };

  useEffect(() => {
    handleDirectusErrors(router)(getRecipesErrors);
  }, [getRecipesErrors, router]);

  const renderListEntry = ({ item }: { item: Recipe }) => {
    return (
      <RecipeCardLazy
        item={item}
        width={
          numColumns < defaultNumberColumns + 1
            ? Math.floor(width / defaultNumberColumns)
            : defaultCardWidth
        }
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {recipes && recipes?.length !== 0 && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <FlatList
              key={numColumns}
              horizontal={false}
              numColumns={numColumns}
              data={recipes}
              initialNumToRender={8}
              renderItem={renderListEntry}
              scrollEnabled={true}
            />
          </Animated.View>
        )}
        {recipes?.length === 0 && (
          <NoData>
            <Trans i18nKey="recipes.empty" />
          </NoData>
        )}
      </ScrollView>
      <FAB
        icon="plus"
        style={styles.fab}
        theme={theme}
        onPress={() => router.push("recipes/new")}
      />
    </View>
  );
}
