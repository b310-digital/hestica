import { useEffect, useState } from "react";
import { DirectusAppClient } from "../lib/directus";

export const useDirectusGetAuthentificationExpiry = () => {
  const [expiry, setExpiry] = useState<number | null | undefined>();

  useEffect(() => {
    DirectusAppClient.getTokenExpiryTime().then((expiry) => {
      setExpiry(expiry);
    });
  }, []);

  return { expiry };
};
