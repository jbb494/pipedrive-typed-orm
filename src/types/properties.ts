import {
  BaseFieldsSchema,
  ItemType,
  BaseSchema,
  inferFieldType,
  CustomSchema,
  CustomPipelines,
  SchemaFile,
} from "./schema";
import {
  IsAnyFieldRequired,
  IsEmptyObject,
  IsRequired,
  Not,
  Or,
} from "./utils";

export type CustomProperties = {
  [Property in keyof CustomSchema]: {
    [field: string]: inferFieldType<ItemType>;
  };
};
export type BaseProperties = {
  [Property in keyof BaseSchema]: {
    [field: string]: inferFieldType<ItemType>;
  };
};

export type inferPropertyFromSchema<S extends CustomSchema | BaseSchema> = {
  [Property in keyof S]: {
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

type CustomPropertyBuilder<
  CustomProperty extends CustomProperties[keyof CustomProperties]
> = true extends Or<
  Not<IsAnyFieldRequired<CustomProperty>>,
  IsEmptyObject<CustomProperty>
>
  ? {
      custom_fields?: CustomProperty;
    }
  : {
      custom_fields: CustomProperty;
    };

export type PropertiesBuilder<
  BasePropertiesT extends BaseProperties,
  CustomPropertiesT extends CustomProperties
> = {
  lead: BasePropertiesT["lead"] &
    CustomPropertyBuilder<CustomPropertiesT["lead"]>;
  deal: BasePropertiesT["deal"] &
    CustomPropertyBuilder<CustomPropertiesT["lead"]>;
  person: BasePropertiesT["person"] &
    CustomPropertyBuilder<CustomPropertiesT["person"]>;
};

export type PropertiesFromSchema<CustomSchemaT extends CustomSchema> =
  PropertiesBuilder<
    inferPropertyFromSchema<BaseFieldsSchema>,
    inferPropertyFromSchema<CustomSchemaT>
  >;
