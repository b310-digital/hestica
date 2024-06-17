import { Stack } from "expo-router/stack";
import { router } from "expo-router";
import React from "react";
import { Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import logo from "../assets/logo-small.png";
import { useTranslation } from "react-i18next";

export default function AppLayout() {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          title: t("recipes"),
        }}
      />
      <Stack.Screen
        name="recipes/[recipe_id]/index"
        options={{
          headerShown: true,
          headerLeft: () => (
            <Ionicons
              style={{ marginLeft: 11, marginRight: 11, padding: 3 }}
              name="arrow-back"
              size={24}
              onPress={() => router.navigate("/recipes")}
            />
          ),
        }}
      />
      <Stack.Screen
        name="recipes/[recipe_id]/edit"
        options={{
          headerShown: true,
          headerLeft: () => (
            <Ionicons
              style={{ marginLeft: 11, marginRight: 11, padding: 3 }}
              name="arrow-back"
              size={24}
              onPress={() => router.back()}
            />
          ),
        }}
      />
      <Stack.Screen
        name="recipes/new"
        options={{
          headerShown: true,
          title: t("recipes.new"),
          headerLeft: () => (
            <Ionicons
              style={{ marginLeft: 11, marginRight: 11, padding: 3 }}
              name="arrow-back"
              size={24}
              onPress={() => router.navigate("/recipes")}
            />
          ),
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: true,
          title: t("login"),
          headerLeft: () => (
            <Image
              source={logo}
              style={{ marginLeft: 10, width: 30, height: 32 }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          headerShown: true,
          title: t("signup"),
          headerLeft: () => (
            <Ionicons
              style={{ marginLeft: 11, marginRight: 11, padding: 3 }}
              name="arrow-back"
              size={24}
              onPress={() => router.navigate("/login")}
            />
          ),
        }}
      />
    </Stack>
  );
}
