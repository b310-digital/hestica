import { Card, Text } from "react-native-paper";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Recipe } from "../lib/directus";
import { useDirectusGetRecipeImage } from "../hooks/useDirectusGetRecipeImage";
import { theme } from "../theme";
import { useDirectusGetAccessToken } from "../hooks/useDirectusGetAccessToken";
import { Image } from "expo-image";

export const RecipeCardLazy = ({
  item,
  width,
}: {
  item: Recipe;
  width: number;
}) => {
  const router = useRouter();
  const { recipeImageUrl } = useDirectusGetRecipeImage(item.image as string);
  const { token } = useDirectusGetAccessToken();

  return (
    <View
      style={{
        width: width,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Card
        style={{
          flex: 1,
          margin: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
        theme={theme}
        mode="elevated"
        elevation={2}
        onPress={() => router.push(`/recipes/${item.id}`)}
      >
        <Card.Content style={{ padding: 5 }}>
          <Image
            source={{
              uri: recipeImageUrl,
              headers: { Authorization: `Bearer ${token}` },
            }}
            contentFit="cover"
            style={{ height: 200, borderRadius: 5 }}
          />
          <View style={{ padding: 5 }}>
            <Text variant="titleMedium">{item.name}</Text>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};
