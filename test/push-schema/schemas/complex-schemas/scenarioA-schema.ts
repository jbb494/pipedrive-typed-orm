import { Schema } from "src/types";

export const scenarioASchema = {
  lead: {
    campaign: {
      field_type: "text",
    },
    carMake: {
      field_type: "enum",
      options: ["bmw", "seat", "ferrari"],
    },
    kmsInterested: {
      field_type: "set",
      options: ["10000", "15000", "20000"],
    },
  },
  person: {
    partnerName: {
      field_type: "text",
    },
    partnerAge: {
      field_type: "text",
    },
  },
} satisfies Schema;