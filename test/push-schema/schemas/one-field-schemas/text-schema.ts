import { SchemaFile } from "src/types";

export const textSchema = {
  custom_fields: {
    lead: {
      text: {
        field_type: "text",
      },
    },
    person: {
      text: {
        field_type: "text",
      },
    },
  },
} satisfies SchemaFile;
