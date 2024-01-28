import { CustomSchema } from "src/types";

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
    birthday: {
      field_type: "date",
    },
  },
} as const satisfies CustomSchema;
