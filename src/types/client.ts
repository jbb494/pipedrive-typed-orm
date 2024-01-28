import { Result } from "ga-ts";
import { PropertiesFromSchema } from "./properties";
import { CustomSchema } from "./schema";
import { DeatilsResponse } from "./pipedrive-entities";

export type PipedriveOrmClient<
  CustomSchemaT extends CustomSchema,
  CompleteSchema = PropertiesFromSchema<CustomSchemaT>
> = {
  [P in Extract<keyof CompleteSchema, string> as `post${Capitalize<P>}`]: (
    p: CompleteSchema[P]
  ) => Promise<Result<any, Error>>;
} & {
  [R in Extract<keyof DeatilsResponse, string> as `get${Capitalize<R>}`]: (
    id: number
  ) => Promise<Result<DeatilsResponse[R], Error>>;
};
