import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { DirectusAppClient, LoginUser } from "../lib/directus";
import { Button, HelperText, TextInput } from "react-native-paper";
import { theme } from "../theme";
import { postUser } from "../utils/server";
import { useDirectusGetUser } from "../hooks/useDirectusGetUser";
import { Trans } from "react-i18next";

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  input: {
    marginTop: 10,
    marginBottom: 10,
  },
});

export default function SignupScreen() {
  const router = useRouter();
  const { user } = useDirectusGetUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      router.replace("/recipes");
    }
  }, [user, router]);

  const signup = async (data: LoginUser) => {
    const client = await postUser(DirectusAppClient.getPublicClient())(
      data,
    ).catch((error) => {
      console.error(error);
      return;
    });
    if (client) router.replace("/login");
  };

  // Outline mode has some issues with prefilled values
  // https://github.com/callstack/react-native-paper/issues/3757
  return (
    <View style={styles.container}>
      <Text>
        <Trans i18nKey="accounts.email" />
      </Text>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            theme={theme}
            mode="outlined"
          />
        )}
        name="email"
      />
      {errors.email && (
        <HelperText type="error" visible={errors !== undefined}>
          <Trans i18nKey="form.errors.field.required" />
        </HelperText>
      )}

      <Text>
        <Trans i18nKey="accounts.password" />
      </Text>
      <Controller
        control={control}
        rules={{
          maxLength: 100,
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            secureTextEntry={true}
            theme={theme}
            mode="outlined"
            onChangeText={onChange}
            value={value}
          />
        )}
        name="password"
      />
      {errors.password && (
        <HelperText type="error" visible={errors !== undefined}>
          <Trans i18nKey="form.errors.field.required" />
        </HelperText>
      )}
      <Button
        theme={theme}
        onPress={handleSubmit((data) => signup(data))}
        mode="contained"
      >
        <Trans i18nKey="button.create" />
      </Button>
    </View>
  );
}
