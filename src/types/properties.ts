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
    [Field in keyof S[Property] as true extends (
      S[Property][Field] extends ItemType
        ? IsRequired<S[Property][Field]>
        : never
    )
      ? Field
      : never]: S[Property][Field] extends ItemType
      ? inferFieldType<S[Property][Field]>
      : never;
  } & {
    [Field in keyof S[Property] as true extends (
      S[Property][Field] extends ItemType
        ? IsRequired<S[Property][Field]>
        : never
    )
      ? never
      : Field]?: S[Property][Field] extends ItemType
      ? inferFieldType<S[Property][Field]>
      : never;
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

export type PropertiesFromSchema<CustomSchema extends Schema> =
  PropertiesBuilder<BaseProperties, inferPropertyFromSchema<CustomSchema>>;
