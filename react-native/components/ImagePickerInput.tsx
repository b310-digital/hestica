import { ReactElement } from "react";
import { UseControllerProps, useController } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { View } from "react-native";
import { HelperText, IconButton } from "react-native-paper";
import { styles } from "./styles";
import { theme } from "../theme";
import { Trans } from "react-i18next";
import { RecipeFormValues } from "./RecipeInputForm";
import { useDirectusGetAccessToken } from "../hooks/useDirectusGetAccessToken";
import { Image } from "expo-image";

export const ImagePickerInput = (
  props: UseControllerProps<RecipeFormValues>,
) => {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController(props);
  const { token } = useDirectusGetAccessToken();

  const pickImage = async () => {
    const newImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });

    if (
      Array.isArray(newImage?.assets) &&
      newImage.assets.length > 0 &&
      newImage.assets[0].uri
    ) {
      const base64uri = newImage.assets[0]?.uri;
      onChange(base64uri);
    }
  };

  const deleteImage = async () => {
    onChange(null);
  };

  const hasErrors = (): boolean => {
    return !!error;
  };

  const renderImage = (): ReactElement => {
    if (!value) return <View style={styles.recipeImage}></View>;
    return (
      <View style={styles.recipeImage}>
        <Image
          source={{
            uri: value as string,
            headers: { Authorization: `Bearer ${token}` },
          }}
          contentFit="cover"
          style={styles.recipeImage}
        />
      </View>
    );
  };

  const renderDeleteIcon = (): ReactElement => {
    if (value) {
      return (
        <IconButton
          icon="trash-can-outline"
          iconColor="red"
          size={20}
          mode="outlined"
          onPress={deleteImage}
        />
      );
    }
    return <View></View>;
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignContent: "center",
        marginBottom: 15,
      }}
    >
      <View style={{ width: 75, height: 150 }}>
        <IconButton
          icon="camera"
          theme={theme}
          size={20}
          mode="outlined"
          onPress={pickImage}
        />
        {renderDeleteIcon()}
      </View>
      <View>
        {renderImage()}
        <HelperText type="error" visible={hasErrors()}>
          <Trans i18nKey="recipes.erorrs.file.size" />
        </HelperText>
      </View>
    </View>
  );
};
