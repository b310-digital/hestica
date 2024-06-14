import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useDirectusGetUser } from "../../hooks/useDirectusGetUser";
import {
  Button,
  Dialog,
  PaperProvider,
  Portal,
  TextInput,
} from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { theme } from "../../theme";
import { useDirectusDeleteUser } from "../../hooks/useDirectusDeleteUser";
import { useDirectusDeleteAuthentification } from "../../hooks/useDirectusDeleteAuthentification";
import { Trans, useTranslation } from "react-i18next";

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  input: {
    marginTop: 10,
    marginBottom: 10,
  },
});

export default function Profile() {
  const router = useRouter();
  const { user } = useDirectusGetUser();
  const { signOut, result: logoutResult } = useDirectusDeleteAuthentification();
  const { removeUser, result: userDeleteResult } = useDirectusDeleteUser();
  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (userDeleteResult || logoutResult) router.navigate("/login");
  }, [userDeleteResult, logoutResult, router]);

  const deleteMe = async () => {
    removeUser();
  };

  const { control, reset } = useForm({
    defaultValues: {
      email: user?.email,
      firstName: user?.first_name,
      lastName: user?.last_name,
    },
  });

  useEffect(() => {
    reset({
      email: user?.email,
    });
  }, [user, reset]);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Portal>
          <Dialog theme={theme} visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>
              <Trans i18nKey="accounts.dialog.delete.title" />
            </Dialog.Title>
            <Dialog.Content>
              <Text>
                <Trans i18nKey="button.delete.account.warn" />
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button theme={theme} onPress={hideDialog}>
                <Trans i18nKey="button.cancel" />
              </Button>
              <Button theme={theme} onPress={deleteMe}>
                <Trans i18nKey="button.delete" />
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={t("accounts.email")}
              disabled={true}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value || ""}
              theme={theme}
              style={{ marginBottom: 20 }}
            />
          )}
          name="email"
        />

        <Button
          theme={theme}
          mode="outlined"
          onPress={() => signOut()}
          style={{ marginBottom: 20 }}
        >
          <Trans i18nKey="logout" />
        </Button>

        <Button theme={theme} mode="outlined" onPress={showDialog}>
          <Trans i18nKey="button.delete.account" />
        </Button>
      </View>
    </PaperProvider>
  );
}
