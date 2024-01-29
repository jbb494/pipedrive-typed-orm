import { SchemaFile } from "src/types";

export const emptySchema = {
  custom_fields: {
    lead: {},
    person: {},
  },
  custom_pipelines: {},
} satisfies SchemaFile;
