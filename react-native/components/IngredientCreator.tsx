import React from "react";
import { View, Text } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { Ingredient } from "../lib/directus";
import { Button, Modal, Portal, TextInput } from "react-native-paper";
import { theme } from "../theme";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function IngredientCreator({
  isVisible,
  onClose,
  defaultValues,
  callback,
}: {
  isVisible: boolean;
  onClose: () => void;
  defaultValues: Partial<Ingredient>;
  callback: (ingredient: Partial<Ingredient>) => void;
}) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Ingredient>({
    defaultValues,
  });
  const { t } = useTranslation();

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const containerStyle = {
    backgroundColor: "white",
    justifyContent: "flex-start" as const,
    padding: 20,
    margin: 20,
  };

  const onSubmit = handleSubmit((ingredient: Partial<Ingredient>) => {
    callback(ingredient);
  });

  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={onClose}
        contentContainerStyle={[containerStyle]}
      >
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={t("ingredients.name")}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value || ""}
            />
          )}
          name="name"
        />
        {errors.name && <Text>This is required.</Text>}
        <View style={{ marginTop: 10 }}>
          <Button onPress={onSubmit} theme={theme} mode="contained">
            {defaultValues?.id && <Text>Update</Text>}
            {!defaultValues?.id && <Text>Create</Text>}
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}
