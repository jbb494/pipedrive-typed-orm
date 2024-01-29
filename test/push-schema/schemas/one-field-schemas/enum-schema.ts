import { SchemaFile } from "src/types";

export const enumSchema = {
  custom_fields: {
    lead: {
      enum: {
        field_type: "enum",
        options: ["A", "B"],
      },
    },
    person: {
      enum: {
        field_type: "enum",
        options: ["A", "B"],
      },
    },
  },
} satisfies SchemaFile;
