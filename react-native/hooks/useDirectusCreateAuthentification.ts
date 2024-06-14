import { useState } from "react";
import {
  BasicDirectusErrorExtensions,
  DirectusAppClient,
} from "../lib/directus";
import { AuthenticationData } from "@directus/sdk";

export const useDirectusCreateAuthentification = () => {
  const [authenticationData, setAuthenticationData] =
    useState<AuthenticationData>();
  const [errors, setErrors] = useState<BasicDirectusErrorExtensions[]>([]);

  const signIn = async (email: string, password: string) => {
    await DirectusAppClient.createClient(email, password)
      .then((newAuthenticationData) => {
        setAuthenticationData(newAuthenticationData);
      })
      .catch((error) => {
        setErrors(error?.errors);
      });
  };

  return { errors, signIn, authenticationData };
};
