export type PropertyKeys = "lead" | "person";

export type ItemType<Options = readonly string[]> = (
  | {
      field_type: "text";
    }
  | {
      field_type: "phone";
    }
  | {
      field_type: "double";
    }
  | {
      field_type: "boolean";
    }
  | {
      field_type: "date";
    }
  | {
      field_type: "value-object";
    }
  | {
      field_type: "enum";
      options: Options;
    }
  | {
      field_type: "array";
      elem_type: "text";
    }
) & { required?: boolean };

export type Schema = {
  [property in PropertyKeys]?: { [field: string]: ItemType };
};

export const BaseFieldsSchema = {
  lead: {
    title: {
      field_type: "text",
      required: true,
    },
    owner_id: {
      field_type: "double",
    },
    label_ids: { field_type: "array", elem_type: "text" },
    person_id: { field_type: "double" },
    organization_id: { field_type: "double" },
    value: {
      field_type: "value-object",
    } /* { amount: number; currency: "USD" | "EUR" } */,
    expected_close_date: { field_type: "date" },
    visible_to: { field_type: "text" },
    was_seen: { field_type: "boolean" },
  },
  person: {
    name: { field_type: "text" },
    email: { field_type: "text" },
    phone: { field_type: "text" },
    owner_id: { field_type: "text" },
    org_id: { field_type: "text" },
  },
} as const satisfies Schema;

export type BaseFieldsSchema = typeof BaseFieldsSchema;

export type inferFieldType<T extends ItemType> = T extends {
  field_type: "text" | "phone";
}
  ? string
  : T extends {
      field_type: "double";
    }
  ? number
  : T extends {
      field_type: "date";
    }
  ? Date
  : T extends {
      field_type: "boolean";
    }
  ? boolean
  : T extends {
      field_type: "value-object";
    }
  ? { amount: number; currency: "USD" | "EUR" }
  : T extends { field_type: "enum"; options: infer Options }
  ? Options extends readonly string[]
    ? Options[number]
    : never
  : T extends { field_type: "array"; elem_type: infer ElemType }
  ? ElemType extends "text"
    ? inferFieldType<{ field_type: ElemType }>
    : never
  : never;

/* 
  # Schema

  ItemType

  Schema 

  BaseSchema



  # Properties
  
  PropertyKeys (Lead, Person)
  
  Properties  # Infered from Schema

  BuildProperties < BaseProperties, CustomProperties> (which are of type Properties)



*/
