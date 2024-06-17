import { useEffect, useState } from "react";
import { DirectusAppClient } from "../lib/directus";

export const useDirectusGetAccessToken = () => {
  const [token, setToken] = useState<string | null | undefined>();

  useEffect(() => {
    DirectusAppClient.getAccessToken().then((token) => {
      setToken(token);
    });
  }, []);

  return { token };
};
