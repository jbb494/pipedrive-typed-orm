import { Ok } from "ga-ts";
import { PipedriveOrmClient, Schema } from "./types";

export const createPipedriveOrmClient = <CustomSchema extends Schema>(
  customFieldsSchema: CustomSchema
): PipedriveOrmClient<CustomSchema> => {
  return new Proxy({} as PipedriveOrmClient<CustomSchema>, {
    get: function (target, prop, receiver) {
      if (typeof prop === "string" && prop.startsWith("post")) {
        return function (p: any) {
          console.log({ p, prop });
          return Promise.resolve(Ok({}));
        };
      }
      return Reflect.get(target, prop, receiver);
    },
  });
};
