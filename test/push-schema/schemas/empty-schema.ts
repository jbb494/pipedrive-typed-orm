import { CustomPipelines, CustomSchema } from "src/types";

export const emptySchema = {
  lead: {},
  person: {},
} satisfies CustomSchema;

export const emptySchemaPipeline = {} satisfies CustomPipelines;
