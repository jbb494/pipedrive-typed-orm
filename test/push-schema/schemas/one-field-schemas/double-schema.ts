import { Schema } from "src/types";

export const doubleSchema = {
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
} satisfies Schema;
