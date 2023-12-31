import { Schema } from "src/types";

export default {
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
} satisfies Schema;
