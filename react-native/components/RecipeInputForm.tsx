import { ReactElement, useEffect, useState, useCallback, useRef } from "react";
import { View, Text, GestureResponderEvent, ScrollView } from "react-native";
import {
  Button,
  Divider,
  HelperText,
  IconButton,
  PaperProvider,
  SegmentedButtons,
  TextInput,
} from "react-native-paper";
import { theme } from "../theme";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  BasicDirectusErrorExtensions,
  Ingredient,
  Instruction,
  Overwrite,
  Recipe,
  RecipeIngredient,
} from "../lib/directus";
import { dropDownStyles, styles } from "./styles";
import { Dropdown } from "react-native-element-dropdown";
import IngredientCreator from "./IngredientCreator";
import { ErrorCode } from "@directus/errors";
import { ImagePickerInput } from "./ImagePickerInput";
import { useIngredients } from "../hooks/useIngredients";
import { Trans, useTranslation } from "react-i18next";
import ErrorFormMessage from "./ErrorFormMessage";
import UnitDropdown from "./UnitDropdown";

export type DirtyProps<T> = {
  [Property in keyof T]: boolean;
};

// Use a custom type here instead of the recipe type as the M2M relationship can contain either id or the whole object.
// But in this form case we dont want to consider the id.
// recipe_image_asset is temporary field to be used for the raw files
export type RecipeFormValues = Omit<
  Overwrite<
    Recipe,
    {
      ingredients: Overwrite<RecipeIngredient, { item: Ingredient | null }>[];
      instructions: Instruction[];
    } & { recipe_image_asset?: string }
  >,
  "user_created" | "image"
>;

interface RecipeInputFormProps {
  defaultValues: RecipeFormValues;
  // Partial<DirtyProps<RecipeFormValues>> somehow does not work here, so using object as a fallback
  onSuccessfulSubmit: (data: RecipeFormValues, dirtyFields: object) => void;
  submitButtonLabel: string;
  children?: ReactElement;
  serverErrors: BasicDirectusErrorExtensions[];
}

export const RecipeInputForm = ({
  defaultValues,
  onSuccessfulSubmit,
  submitButtonLabel,
  children,
  serverErrors,
}: RecipeInputFormProps) => {
  const [contentSelection, setContentSelection] =
    useState<string>("ingredients");
  const [isIngredientCreatorVisible, setIsIngredientCreatorVisible] =
    useState(false);
  const [lastSelectedIngredient, setLastSelectedIngredient] =
    useState<number>();
  const {
    ingredients,
    recentIngredientCreated: ingredient,
    createIngredient,
  } = useIngredients();
  const { t } = useTranslation();
  const scrollRef = useRef();

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    getValues,
    reset,
    formState: { errors: formErrors, dirtyFields },
  } = useForm<RecipeFormValues>({
    defaultValues,
  });
  const {
    fields: ingredientsFields,
    append: ingredientsAppend,
    remove: ingredientsRemove,
  } = useFieldArray({
    control,
    name: "ingredients",
  });
  const {
    fields: instructionsFields,
    append: instructionsAppend,
    remove: instructionsRemove,
  } = useFieldArray({
    control,
    name: "instructions",
  });

  const scrollToTop = () => {
    scrollRef?.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const loadServerErrors = useCallback(() => {
    if (!serverErrors || serverErrors.length === 0) return;

    if (
      serverErrors.find(
        (error) => error.extensions.code === ErrorCode.ContentTooLarge,
      )
    )
      setError("recipe_image_asset", {
        type: "custom",
        message: t("recipes.errors.file.size"),
      });
  }, [setError, serverErrors, t]);

  useEffect(() => {
    if (typeof lastSelectedIngredient === "number" && ingredient?.name) {
      setValue(`ingredients.${lastSelectedIngredient}.item`, ingredient);
    }
  }, [ingredient, lastSelectedIngredient, setValue]);

  useEffect(() => {
    reset(defaultValues);
    loadServerErrors();
  }, [reset, defaultValues, serverErrors, loadServerErrors]);

  const renderInstructions = (): ReactElement[] => {
    return instructionsFields.map((field, index) => (
      <View key={field.id} style={styles.instructions}>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{ fontWeight: "bold", alignSelf: "center", marginRight: 10 }}
          >
            <Trans
              i18nKey="recipes.instructions.number"
              values={{ i: index + 1 }}
            />
          </Text>
          <IconButton
            icon="trash-can-outline"
            iconColor="red"
            size={20}
            mode="outlined"
            onPress={() => instructionsRemove(index)}
          />
        </View>
        <View>
          <Controller
            control={control}
            name={`instructions.${index}.description`}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label={t("instructions.description")}
                mode="outlined"
                multiline={true}
                numberOfLines={3}
                onBlur={onBlur}
                theme={theme}
                onChange={onChange}
                value={value || ""}
              />
            )}
          />
        </View>
      </View>
    ));
  };

  const renderIngredients = (): ReactElement[] => {
    return ingredientsFields.map((field, index) => (
      <View key={field.id} style={styles.ingredients}>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Text
            style={{ fontWeight: "bold", alignSelf: "center", marginRight: 10 }}
          >
            <Trans
              i18nKey="recipes.ingredients.number"
              values={{ i: index + 1 }}
            />
          </Text>
          <IconButton
            icon="trash-can-outline"
            iconColor="red"
            size={20}
            mode="outlined"
            onPress={() => ingredientsRemove(index)}
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <Controller
            control={control}
            name={`ingredients.${index}.item`}
            render={({ field: { onChange, onBlur, value } }) => (
              <Dropdown
                search
                onBlur={onBlur}
                data={ingredients}
                labelField="name"
                valueField="id"
                searchField="name"
                style={dropDownStyles.dropdown}
                value={value}
                searchPlaceholder={t("search")}
                placeholder={t("ingredient")}
                placeholderStyle={dropDownStyles.placeholderStyle}
                selectedTextStyle={dropDownStyles.selectedTextStyle}
                inputSearchStyle={dropDownStyles.inputSearchStyle}
                iconStyle={dropDownStyles.iconStyle}
                onChange={onChange}
              />
            )}
          />
          <View>
            <IconButton
              icon="plus"
              size={20}
              mode="outlined"
              theme={theme}
              onPress={(_event: GestureResponderEvent): void => {
                setIsIngredientCreatorVisible(true);
                setLastSelectedIngredient(index);
              }}
            ></IconButton>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <Controller
              control={control}
              name={`ingredients.${index}.amount`}
              rules={{
                validate: (value, _formValues) => !!value && value >= 0,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextInput
                    style={[styles.inputSplitted, styles.inputSplittedStart]}
                    label={t("ingredients.amount")}
                    inputMode="decimal"
                    mode="outlined"
                    onBlur={onBlur}
                    theme={theme}
                    onChangeText={(text) => {
                      onChange(text);
                    }}
                    value={value?.toString() || ""}
                  />
                  {formErrors.ingredients && formErrors.ingredients[index] && (
                    <HelperText
                      type="error"
                      visible={
                        formErrors.ingredients && formErrors.ingredients[index]
                          ? true
                          : false
                      }
                    >
                      <Trans i18nKey="errors.format.bad" />
                    </HelperText>
                  )}
                </View>
              )}
            />
          </View>
          <View style={{ flex: 1 }}>
            <UnitDropdown
              control={control}
              name={`ingredients.${index}.unit`}
            />
          </View>
        </View>
        <View>
          <Controller
            control={control}
            name={`ingredients.${index}.description`}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.inputSplitted, styles.inputSplittedStart]}
                label={t("ingredients.description")}
                mode="outlined"
                onBlur={onBlur}
                theme={theme}
                onChangeText={(text) => {
                  onChange(text);
                }}
                value={value?.toString() || ""}
              />
            )}
          />
        </View>
        {index < ingredientsFields.length - 1 && (
          <Divider style={{ marginTop: 20 }}></Divider>
        )}
      </View>
    ));
  };

  return (
    <PaperProvider>
      <ScrollView style={styles.container} ref={scrollRef}>
        <IngredientCreator
          isVisible={isIngredientCreatorVisible}
          onClose={() => setIsIngredientCreatorVisible(false)}
          defaultValues={{}}
          callback={(data: Partial<Ingredient>) => {
            if (!data?.name) return;

            createIngredient(data.name);
            setIsIngredientCreatorVisible(false);
          }}
        />
        {Object.keys(formErrors).length > 0 && <ErrorFormMessage />}
        <View style={[{ flex: 1 }, styles.margin]}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[styles.inputSplitted, styles.inputSplittedStart]}>
                <TextInput
                  label={t("recipes.name")}
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  theme={theme}
                />
                {!!formErrors?.name && (
                  <HelperText type="error" visible={!!formErrors?.name}>
                    <Trans i18nKey="form.errors.field.required" />
                  </HelperText>
                )}
              </View>
            )}
            name="name"
          />
        </View>

        <View style={[{ flex: 1 }, { marginBottom: 40 }]}>
          <ImagePickerInput
            control={control}
            name="recipe_image_asset"
            defaultValue={getValues().recipe_image_asset}
          />
        </View>

        <Controller
          control={control}
          rules={{
            maxLength: 100,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              label={t("recipes.description")}
              mode="outlined"
              onBlur={onBlur}
              theme={theme}
              onChangeText={onChange}
              value={value || ""}
            />
          )}
          name="description"
        />
        <View style={{ flexDirection: "row", flex: 1, marginBottom: 40 }}>
          <View style={{ flex: 1 }}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.inputSplitted, styles.inputSplittedStart]}
                  onBlur={onBlur}
                  label={t("recipes.time.prepare")}
                  mode="outlined"
                  multiline={false}
                  inputMode="numeric"
                  right={<TextInput.Icon icon="clock" />}
                  theme={theme}
                  onChangeText={(text) => onChange(parseInt(text, 10) || null)}
                  value={value?.toString() || ""}
                />
              )}
              name="prep_time"
            />

            <HelperText type="info">
              <Trans i18nKey="recipes.hints.time.prepare" />
            </HelperText>
          </View>
          <View style={{ flex: 1 }}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.inputSplitted, styles.inputSplittedEnd]}
                  onBlur={onBlur}
                  label={t("recipes.time.cook")}
                  right={<TextInput.Icon icon="clock" />}
                  mode="outlined"
                  inputMode="numeric"
                  theme={theme}
                  onChangeText={(text) => onChange(parseInt(text, 10) || null)}
                  value={value?.toString() || ""}
                />
              )}
              name="cook_time"
            />
            <HelperText type="info">
              <Trans i18nKey="recipes.hints.time.cook" />
            </HelperText>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.inputSplitted, styles.inputSplittedEnd]}
                onBlur={onBlur}
                label={t("recipes.yield")}
                right={<TextInput.Icon icon="abacus" />}
                mode="outlined"
                inputMode="numeric"
                theme={theme}
                onChangeText={(text) => onChange(parseInt(text, 10) || null)}
                value={value?.toString() || ""}
              />
            )}
            name="yield"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.inputSplitted, styles.inputSplittedEnd]}
                onBlur={onBlur}
                label={t("recipes.source")}
                right={<TextInput.Icon icon="source-commit" />}
                mode="outlined"
                theme={theme}
                onChangeText={onChange}
                value={value || ""}
              />
            )}
            name="source"
          />
        </View>
        <SegmentedButtons
          value={contentSelection}
          onValueChange={setContentSelection}
          style={{ marginBottom: 20, marginTop: 20 }}
          theme={theme}
          buttons={[
            {
              value: "ingredients",
              label: t("ingredients"),
            },
            {
              value: "instructions",
              label: t("instructions"),
            },
          ]}
        />

        {contentSelection === "ingredients" && renderIngredients()}
        {contentSelection === "instructions" && renderInstructions()}

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <IconButton
            icon="plus"
            theme={theme}
            size={40}
            mode="outlined"
            onPress={() => {
              if (contentSelection === "ingredients")
                ingredientsAppend({ unit: "", item: null });
              if (contentSelection === "instructions") instructionsAppend({});
            }}
          />
        </View>
        <Button
          onPress={handleSubmit(
            (data: RecipeFormValues) => onSuccessfulSubmit(data, dirtyFields),
            scrollToTop,
          )}
          theme={theme}
          mode="contained"
          style={{ marginBottom: 10 }}
        >
          {submitButtonLabel}
        </Button>
        {children}
      </ScrollView>
    </PaperProvider>
  );
};
