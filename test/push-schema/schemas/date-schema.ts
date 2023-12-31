import { Schema } from "src/types";

export default {
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
