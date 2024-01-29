import { SchemaFile } from "src/types";

export const phoneSchema = {
  custom_fields: {
    lead: {
      phone: {
        field_type: "phone",
      },
    },
    person: {
      phone: {
        field_type: "phone",
      },
    },
  },
} satisfies SchemaFile;
