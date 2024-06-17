import React, { useState, useEffect } from "react";
import { Text } from "react-native";
import "react-native-url-polyfill/auto";
import { useRouter } from "expo-router";
import { FAB, IconButton, List, PaperProvider } from "react-native-paper";
import {
  StyleSheet,
  ScrollView,
  View,
  GestureResponderEvent,
} from "react-native";
import { theme } from "../../../theme";
import { handleDirectusErrors } from "../../../utils/server";
import { Ingredient } from "../../../lib/directus";
import IngredientCreator from "../../../components/IngredientCreator";
import { useIngredients } from "../../../hooks/useIngredients";
import NoData from "../../../components/NoData";
import DeleteDialog from "../../../components/DeleteDialog";
import { Trans, useTranslation } from "react-i18next";

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 10,
  },
  container: {},
  item: {
    marginTop: 10,
    marginStart: 10,
    marginEnd: 10,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {},
});

export default function Ingredients() {
  const router = useRouter();
  const [isIngredientCreatorVisible, setIsIngredientCreatorVisible] =
    useState(false);
  const {
    ingredients,
    createIngredient,
    removeIngredient,
    getIngredientErrors,
    updateIngredient,
  } = useIngredients();
  const [selectedIngredientIdToDelete, setSelectedIngredientIdToDelete] =
    useState<string | undefined>();
  const [ingredientToEdit, setIngredientToEdit] = useState<
    Ingredient | undefined
  >();
  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const { t } = useTranslation();

  const deleteIngredient = () => {
    if (!selectedIngredientIdToDelete) return;

    removeIngredient(selectedIngredientIdToDelete);
    hideDialog();
    setSelectedIngredientIdToDelete(undefined);
  };

  const handleIngredientDeleteCancel = () => {
    hideDialog();
    setSelectedIngredientIdToDelete(undefined);
  };

  const renderListEntry = (ingredient: Ingredient): React.ReactElement => {
    return (
      <List.Item
        key={`ingredient-${ingredient.id}`}
        style={styles.item}
        title={ingredient.name}
        right={() => (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <IconButton
              icon="pencil-outline"
              size={20}
              mode="outlined"
              onPress={() => {
                setIngredientToEdit(ingredient);
                setIsIngredientCreatorVisible(true);
              }}
            />
            <IconButton
              icon="trash-can-outline"
              iconColor="red"
              size={20}
              mode="outlined"
              onPress={() => {
                setSelectedIngredientIdToDelete(ingredient.id);
                showDialog();
              }}
            />
          </View>
        )}
      ></List.Item>
    );
  };

  useEffect(() => {
    handleDirectusErrors(router)(getIngredientErrors);
  }, [getIngredientErrors, router]);

  return (
    <PaperProvider>
      <View style={{ height: "100%", width: "100%" }}>
        <ScrollView style={styles.container}>
          <DeleteDialog
            isVisible={visible}
            onCancel={handleIngredientDeleteCancel}
            onDelete={deleteIngredient}
            title={t("button.delete")}
          >
            <Text>
              <Trans i18nKey="button.delete.ingredients.warn" />
            </Text>
          </DeleteDialog>
          <IngredientCreator
            isVisible={isIngredientCreatorVisible}
            onClose={() => {
              setIsIngredientCreatorVisible(false);
              setIngredientToEdit(undefined);
            }}
            defaultValues={ingredientToEdit || {}}
            callback={(data) => {
              if (!data?.name) return;

              if (data?.id) {
                updateIngredient(data.id, data);
              } else {
                createIngredient(data.name);
              }
              setIngredientToEdit(undefined);
              setIsIngredientCreatorVisible(false);
            }}
          />
          <View style={{ height: "100%", width: "100%" }}>
            <ScrollView style={{ height: "100%", width: "100%" }}>
              {ingredients && ingredients?.length !== 0 && (
                <List.Section>
                  {ingredients.map((ingredient) => renderListEntry(ingredient))}
                </List.Section>
              )}
              {ingredients?.length === 0 && (
                <NoData>
                  <Trans i18nKey="ingredients.empty" />
                </NoData>
              )}
            </ScrollView>
          </View>
        </ScrollView>
        <FAB
          icon="plus"
          style={styles.fab}
          theme={theme}
          onPress={(_event: GestureResponderEvent): void => {
            setIngredientToEdit(undefined);
            setIsIngredientCreatorVisible(true);
          }}
        />
      </View>
    </PaperProvider>
  );
}
