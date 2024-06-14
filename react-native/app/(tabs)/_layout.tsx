import React from "react";
import { Image } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import logo from "../../assets/logo-small.png";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      initialRouteName="recipes/index"
      backBehavior="history"
      screenOptions={{ tabBarActiveTintColor: "black" }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={20} name="home" color={color} />
          ),
          href: null,
        }}
      />
      <Tabs.Screen
        name="recipes/index"
        options={{
          title: t("recipes"),
          headerLeft: () => (
            <Image
              source={logo}
              style={{ marginLeft: 10, width: 30, height: 32 }}
            />
          ),
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={20} name="file" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ingredients/index"
        options={{
          title: t("ingredients"),
          headerShown: true,
          headerLeft: () => (
            <Image
              source={logo}
              style={{ marginLeft: 10, width: 30, height: 32 }}
            />
          ),
          tabBarIcon: ({ color }) => (
            <FontAwesome size={20} name="shopping-basket" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("profile"),
          headerShown: true,
          headerLeft: () => (
            <Image
              source={logo}
              style={{ marginLeft: 10, width: 30, height: 32 }}
            />
          ),
          tabBarIcon: ({ color }) => (
            <FontAwesome size={20} name="cog" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
