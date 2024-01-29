import { SchemaFile } from "src/types";

export const dateSchema = {
  custom_fields: {
    lead: {
      date: {
        field_type: "date",
      },
    },
    person: {
      date: {
        field_type: "date",
      },
    },
  },
} satisfies SchemaFile;
