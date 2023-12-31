import { Schema } from "src/types";

export const dateSchema = {
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
} satisfies Schema;
