import { useEffect, useState } from "react";
import { BasicDirectusErrorExtensions, User } from "../lib/directus";
import { getUser } from "../utils/server";
import { useDirectusGetClient } from "./useDirectusGetClient";

export const useDirectusGetUser = () => {
  const [errors, setErrors] = useState<BasicDirectusErrorExtensions[]>([]);
  const [user, setUser] = useState<User>();
  const { client, errors: clientErrors } = useDirectusGetClient();

  useEffect(() => {
    if (!client) return;

    getUser(client)()
      .then((user) => setUser(user))
      .catch(({ errors }) => setErrors(errors));
  }, [client]);

  useEffect(() => {
    if (clientErrors.length === 0) return;

    setErrors(clientErrors);
  }, [clientErrors]);

  return { client, errors, user };
};
