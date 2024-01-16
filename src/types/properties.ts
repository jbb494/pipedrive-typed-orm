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

export type Properties<ExcludeDeal extends boolean = false> = {
  [Property in ExcludeDeal extends true
    ? Exclude<PropertyKeys, "deal">
    : PropertyKeys]: {
    [field: string]: inferFieldType<ItemType>;
  };
};

export type inferPropertyFromSchema<S extends Schema<"">> = {
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
  CustomProperties extends Properties<true>,
  CustomPropertiesDeal extends Properties = CustomProperties & {
    deal: CustomProperties["lead"];
  }
> = {
  [Property in keyof Properties]: BaseProperties[Property] &
    (true extends Or<
      Not<IsAnyFieldRequired<CustomPropertiesDeal[Property]>>,
      IsEmptyObject<CustomPropertiesDeal[Property]>
    >
      ? {
          custom_fields?: CustomPropertiesDeal[Property];
        }
      : {
          custom_fields: CustomPropertiesDeal[Property];
        });
};

export type PropertiesFromSchema<CustomSchema extends Schema> =
  PropertiesBuilder<BaseProperties, inferPropertyFromSchema<CustomSchema>>;
