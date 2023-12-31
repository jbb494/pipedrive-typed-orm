import { Schema } from "src/types";

export default {
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
