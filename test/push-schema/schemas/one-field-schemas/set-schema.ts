import { Schema } from "src/types";

export const setSchema = {
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
} satisfies Schema;
