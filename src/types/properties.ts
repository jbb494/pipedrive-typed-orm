import {
  BaseFieldsSchema,
  ItemType,
  PropertyKeys,
  Schema,
  inferFieldType,
} from "./schema";
import {
  IsAnyFieldRequired,
  IsEmptyObject,
  IsRequired,
  Not,
  Or,
} from "./utils";

export type Properties = {
  [Property in PropertyKeys]: {
    [field: string]: inferFieldType<ItemType>;
  };
};

export type inferPropertyFromSchema<S extends Schema> = {
  [Property in PropertyKeys]: {
    [Field in keyof S[Property] as true extends IsRequired<S[Property][Field]>
      ? Field
      : never]: inferFieldType<S[Property][Field]>;
  } & {
    [Field in keyof S[Property] as true extends IsRequired<S[Property][Field]>
      ? never
      : Field]?: inferFieldType<S[Property][Field]>;
  };
};

export type BaseProperties = inferPropertyFromSchema<BaseFieldsSchema>;

export type PropertiesBuilder<
  BaseProperties extends Properties,
  CustomProperties extends Properties
> = {
  [Property in keyof Properties]: BaseProperties[Property] &
    (true extends Or<
      Not<IsAnyFieldRequired<CustomProperties[Property]>>,
      IsEmptyObject<CustomProperties[Property]>
    >
      ? {
          custom_fields?: CustomProperties[Property];
        }
      : {
          custom_fields: CustomProperties[Property];
        });
};
