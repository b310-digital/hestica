import { useState } from "react";
import {
  BasicDirectusErrorExtensions,
  DirectusAppClient,
} from "../lib/directus";

export const useDirectusDeleteAuthentification = () => {
  const [errors, setErrors] = useState<BasicDirectusErrorExtensions[]>([]);
  const [result, setResult] = useState<boolean>();

  const signOut = async () => {
    await DirectusAppClient.logout()
      .then(() => setResult(true))
      .catch((error) => {
        setErrors([error]);
      });
  };

  return { errors, signOut, result };
};
