import { SchemaFile } from "src/types";

export const doubleSchema = {
  custom_fields: {
    lead: {
      double: {
        field_type: "double",
      },
    },
    person: {
      double: {
        field_type: "double",
      },
    },
  },
} satisfies SchemaFile;
