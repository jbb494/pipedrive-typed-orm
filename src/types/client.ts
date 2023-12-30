import { AsyncResult } from "ga-ts";
import {
  BaseProperties,
  Properties,
  PropertiesBuilder,
  inferPropertyFromSchema,
} from "./properties";
import { Schema } from "./schema";

export type PipedriveOrmClient<
  CustomSchema extends Schema,
  CustomProperties extends Properties = inferPropertyFromSchema<CustomSchema>,
  CompleteSchema = PropertiesBuilder<BaseProperties, CustomProperties>
> = {
  [P in Extract<keyof CompleteSchema, string> as `post${P}`]: (
    p: CompleteSchema[P]
  ) => AsyncResult<void, Error>;
};
