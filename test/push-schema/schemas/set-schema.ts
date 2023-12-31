import { Schema } from "src/types";

export default {
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
