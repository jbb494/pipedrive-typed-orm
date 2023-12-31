import { Schema } from "src/types";

export const textSchema = {
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
} satisfies Schema;
