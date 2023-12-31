import { Schema } from "src/types";

export default {
  lead: {
    monetary: {
      field_type: "monetary",
    },
  },
  person: {
    monetary: {
      field_type: "monetary",
    },
  },
} satisfies Schema;
