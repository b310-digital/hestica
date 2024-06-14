import { useEffect, useState } from "react";
import {
  BasicDirectusErrorExtensions,
  DirectusAppClient,
  SchemaTypes,
} from "../lib/directus";
import { DirectusClient, RestClient } from "@directus/sdk";
import { ErrorCode } from "@directus/errors";

export const useDirectusGetClient = () => {
  const [client, setClient] = useState<
    DirectusClient<SchemaTypes> & RestClient<SchemaTypes>
  >();
  const [errors, setErrors] = useState<BasicDirectusErrorExtensions[]>([]);

  useEffect(() => {
    DirectusAppClient.getClient().then((client) => {
      if (client) {
        setClient(client);
      } else {
        setErrors([
          {
            extensions: { code: ErrorCode.Forbidden },
            code: ErrorCode.Forbidden,
            message: "No Authentication Data Available",
          },
        ]);
      }
    });
  }, []);

  return { client, errors };
};
