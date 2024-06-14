import React from "react";
import { Redirect } from "expo-router";
import { useDirectusGetAuthentificationExpiry } from "../hooks/useDirectusGetAuthentificationExpiry";
import "./i18n";

const Index = () => {
  const { expiry } = useDirectusGetAuthentificationExpiry();

  if (expiry && expiry > Date.now()) {
    return <Redirect href="/recipes" />;
  } else {
    return <Redirect href="/login" />;
  }
};

export default Index;
