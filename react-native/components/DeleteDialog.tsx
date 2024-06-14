import React from "react";
import { Button, Dialog, Portal } from "react-native-paper";
import { theme } from "../theme";
import { Text } from "react-native";
import { Trans } from "react-i18next";

interface DeleteDialogProps {
  isVisible: boolean;
  onDelete: () => void;
  onCancel: () => void;
  children: React.ReactElement;
  title: string;
}

export default function DeleteDialog({
  isVisible,
  onCancel,
  onDelete,
  children,
  title,
}: DeleteDialogProps) {
  return (
    <Portal>
      <Dialog theme={theme} visible={isVisible} onDismiss={onCancel}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text>{children}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button theme={theme} onPress={onCancel}>
            <Trans i18nKey="button.cancel" />
          </Button>
          <Button theme={theme} onPress={onDelete}>
            <Trans i18nKey="button.delete" />
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
