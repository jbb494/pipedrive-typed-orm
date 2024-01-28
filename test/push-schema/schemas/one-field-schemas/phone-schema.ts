import { CustomSchema } from "src/types";

export const phoneSchema = {
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
} satisfies CustomSchema;
