import { Schema } from "src/types";

export default {
  lead: {
    phone: {
      field_type: "phone",
    },
  },
  person: {
    phone: {
      field_type: "phone",
    },
  },
} satisfies Schema;
