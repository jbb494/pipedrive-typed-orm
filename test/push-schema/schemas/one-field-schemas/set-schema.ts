import { SchemaFile } from "src/types";

export const setSchema = {
  custom_fields: {
    lead: {
      set: {
        field_type: "set",
        options: ["A", "B"],
      },
    },
    person: {
      set: {
        field_type: "set",
        options: ["A", "B"],
      },
    },
  },
} satisfies SchemaFile;
