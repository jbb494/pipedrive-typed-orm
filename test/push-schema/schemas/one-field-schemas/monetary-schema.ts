import { CustomSchema, SchemaFile } from "src/types";

export const monetarySchema = {
  custom_fields: {
    lead: {
      monetary: {
        field_type: "monetary",
      },
    },
    person: {
      monetary: {
        field_type: "monetary",
      },
    },
  },
} satisfies SchemaFile;
