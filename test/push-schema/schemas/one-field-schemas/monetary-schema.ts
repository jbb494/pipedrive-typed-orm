import { Schema } from "src/types";

export const monetarySchema = {
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
