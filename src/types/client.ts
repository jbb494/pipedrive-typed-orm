import { Result } from "ga-ts";
import { PropertiesFromSchema } from "./properties";
import { Schema } from "./schema";

export type PipedriveOrmClient<
  CustomSchema extends Schema,
  CompleteSchema = PropertiesFromSchema<CustomSchema>
> = {
  [P in Extract<keyof CompleteSchema, string> as `post${Capitalize<P>}`]: (
    p: CompleteSchema[P]
  ) => Promise<Result<void, Error>>;
};
