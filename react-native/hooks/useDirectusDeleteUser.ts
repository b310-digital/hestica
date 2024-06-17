import { useCallback, useEffect, useState } from "react";
import {
  BasicDirectusErrorExtensions,
  DirectusAppClient,
} from "../lib/directus";
import { deleteUserWithId } from "../utils/server";
import { useDirectusGetUser } from "./useDirectusGetUser";
import { useDirectusGetClient } from "./useDirectusGetClient";

export const useDirectusDeleteUser = () => {
  const { user } = useDirectusGetUser();
  const [errors, setErrors] = useState<BasicDirectusErrorExtensions[]>([]);
  const [result, setResult] = useState<boolean>();
  const { client, errors: clientErrors } = useDirectusGetClient();

  const removeUser = useCallback(() => {
    if (!user || !client) return;

    deleteUserWithId(client)(user.id)
      .then(() => {
        DirectusAppClient.deleteLocalAuthData();
        setResult(true);
      })
      .catch(({ errors }) => setErrors(errors));
  }, [client, user]);

  useEffect(() => {
    if (clientErrors.length === 0) return;

    setErrors(clientErrors);
  }, [clientErrors]);

  return { client, removeUser, result, errors };
};
