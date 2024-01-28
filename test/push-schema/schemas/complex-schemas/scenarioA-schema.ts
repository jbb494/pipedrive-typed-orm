import { CustomPipelines, CustomSchema } from "src/types";

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
      required: true,
    },
    partnerAge: {
      field_type: "double",
    },
  },
} as const satisfies CustomSchema;

export const schenarioAPipelineSchema = {
  pipelineA: [{ stageName: "Stage1" }, { stageName: "Stage2" }],
  pipelineB: [{ stageName: "Stage3" }, { stageName: "Stage4" }],
} as const satisfies CustomPipelines;
