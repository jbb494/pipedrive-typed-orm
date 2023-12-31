import * as R from "ramda";
import { pushToPipedrive } from "src/push-schema";
import { Schema } from "src/types";
import { emptySchema } from "./schemas";

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

export const removeAllCustomFieldsPipedrive = async () => {
  return pushToPipedrive(emptySchema);
};
