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
      field_type: "date";
    }
  | {
      field_type: "monetary";
    }
  | {
      field_type: "enum";
      options: Options;
    }
  | {
      field_type: "set";
      options: Options;
    }
  | {
      field_type: "array";
    }
) & { required?: boolean };

export type BaseSchema = {
  lead: Record<string, ItemType>;
  person: Record<string, ItemType>;
  deal: Record<string, ItemType>;
};

export type CustomSchema = {
  lead: Record<string, ItemType>;
  person: Record<string, ItemType>;
};

export type SchemaFile = {
  custom_fields: CustomSchema;
  custom_pipelines?: CustomPipelines;
};

export type CustomPipelines = {
  [pipelineName: string]: Array<{
    stageName: string;
  }>;
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
    person_id: { field_type: "double" },
    organization_id: { field_type: "double" },
    value: {
      field_type: "monetary",
    },
    expected_close_date: { field_type: "date" },
    visible_to: { field_type: "text" },
    label_ids: { field_type: "array" },
  },
  person: {
    name: { field_type: "text" },
    email: { field_type: "text" },
    phone: { field_type: "text" },
    owner_id: { field_type: "double" },
    org_id: { field_type: "double" },
  },
  deal: {
    title: { field_type: "text", required: true },
    value: { field_type: "monetary" },
    currency: { field_type: "text" },
    user_id: { field_type: "double" },
    person_id: { field_type: "double", required: true },
    org_id: { field_type: "double" },
    pipeline_id: { field_type: "double" },
    stage_id: { field_type: "double" },
    status: { field_type: "text" },
    add_time: { field_type: "text" },
    expected_close_date: { field_type: "text" },
    probability: { field_type: "double" },
    lost_reason: { field_type: "text" },
    label_ids: { field_type: "array" },
  },
} as const satisfies BaseSchema;

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
      field_type: "monetary";
    }
  ? { amount: number; currency: "USD" | "EUR" }
  : T extends {
      field_type: "array";
    }
  ? string[]
  : T extends { field_type: "enum"; options: infer Options }
  ? Options extends readonly string[]
    ? Options[number]
    : never
  : T extends { field_type: "set"; options: infer Options }
  ? Options extends readonly string[]
    ? Options[number][]
    : never
  : never;
