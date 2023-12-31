import * as R from "ramda";
import { pushToPipedrive } from "src/push-schema";

export const removeDynamicFieldsBase = R.pickBy(
  (_value, key) =>
    !["add_time", "key", "id", "order_nr", "parent_id"].includes(key)
);

export const removeDynamicFieldsFromOptions = ({ options, ...rest }: any) => ({
  ...rest,
  options: options.map(removeDynamicFieldsBase),
});

export const removeDynamicFields = R.compose(
  removeDynamicFieldsBase,
  (object) => (object.options ? removeDynamicFieldsFromOptions(object) : object)
);

export const pushSchemaToPipedrive = async (schemaName: string) => {
  process.env.SCHEMA_PATH = `${import.meta.dir}/schemas/${schemaName}.ts`;
  return await pushToPipedrive();
};

export const removeAllCustomFieldsPipedrive = async () => {
  return pushSchemaToPipedrive("empty-schema");
};
