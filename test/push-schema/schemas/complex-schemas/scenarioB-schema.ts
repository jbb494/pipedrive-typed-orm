import { Schema } from "src/types";

export const scenarioBSchema = {
  lead: {
    numItems: {
      field_type: "double",
    },
    inSale: {
      field_type: "enum",
      options: ["True", "False"],
    },
    amountDiscount: {
      field_type: "double",
    },
  },
  person: {
    birtday: {
      field_type: "date",
    },
  },
} satisfies Schema;
