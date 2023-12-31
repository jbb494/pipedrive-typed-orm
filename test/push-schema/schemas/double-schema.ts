import { Schema } from "src/types";

export default {
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
