import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";
import { Button, HelperText, TextInput } from "react-native-paper";
import { theme } from "../theme";
import logo from "../assets/hestica.png";
import { useDirectusGetUser } from "../hooks/useDirectusGetUser";
import { useDirectusCreateAuthentification } from "../hooks/useDirectusCreateAuthentification";
import { Trans } from "react-i18next";
import { ErrorCode } from "@directus/errors";
import { useTranslation } from "react-i18next";
import ErrorFormMessage from "../components/ErrorFormMessage";

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  input: {
    marginTop: 10,
    marginBottom: 10,
  },
});

export default function LoginScreen() {
  const router = useRouter();
  const { user } = useDirectusGetUser();
  const {
    signIn,
    authenticationData,
    errors: loginErrors,
  } = useDirectusCreateAuthentification();
  const { t } = useTranslation();

  useEffect(() => {
    if (user || authenticationData) {
      router.replace("/recipes");
    }
  }, [user, authenticationData, router]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (
      loginErrors.filter(
        (error) => error.extensions.code === ErrorCode.InvalidCredentials,
      ).length > 0
    ) {
      setError("password", {
        type: "invalid",
        message: "account.errors.invalid",
      });
      setError("email", {
        type: "invalid",
        message: "account.errors.invalid",
      });
    }
  }, [loginErrors, setError, t]);

  // Outline mode has some issues with prefilled values
  // https://github.com/callstack/react-native-paper/issues/3757
  return (
    <ScrollView style={styles.container}>
      <View style={{ flex: 1, marginBottom: 20 }}>
        <Image
          source={logo}
          style={{ width: 300, height: 370, marginHorizontal: "auto" }}
        />
        <Text style={{ fontSize: 16, textAlign: "center" }}>
          <Trans i18nKey="header.subtitle" />
        </Text>
      </View>

      <View>{Object.keys(errors).length > 0 && <ErrorFormMessage />}</View>
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
      {errors?.email && (
        <HelperText type="error" visible={!!errors?.email}>
          <Trans i18nKey={`errors.${errors.email.type}`} />
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
          <View>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              secureTextEntry={true}
              mode="outlined"
              theme={theme}
              onChangeText={onChange}
              value={value}
            />
            {errors?.password && (
              <HelperText type="error" visible={!!errors?.password}>
                <Trans i18nKey={`errors.${errors.password.type}`} />
              </HelperText>
            )}
          </View>
        )}
        name="password"
      />
      <Button
        theme={theme}
        onPress={handleSubmit((data) => signIn(data.email, data.password))}
        mode="contained"
        style={{ marginBottom: 20 }}
      >
        <Trans i18nKey="login" />
      </Button>
      <Link href="/signup" asChild>
        <Button theme={theme} mode="outlined">
          <Trans i18nKey="signup" />
        </Button>
      </Link>
    </ScrollView>
  );
}
