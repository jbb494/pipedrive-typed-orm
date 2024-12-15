import { Result } from "ga-ts";
import { PropertiesFromSchema } from "./properties";
import { CustomPipelines, CustomSchema, SchemaFile } from "./schema";
import { DeatilsResponse } from "./pipedrive-entities";

export type PipedriveOrmClient<
  SchemaFileT extends SchemaFile,
  CompleteSchema extends PropertiesFromSchema<
    SchemaFileT["custom_fields"]
  > = PropertiesFromSchema<SchemaFileT["custom_fields"]>,
  CustomPipelinesT extends CustomPipelines = SchemaFileT["custom_pipelines"] extends undefined
    ? {}
    : NonNullable<SchemaFileT["custom_pipelines"]>
> = {
  postLead: (p: CompleteSchema["lead"]) => Promise<Result<any, Error>>;
  postDeal: <Pipeline extends keyof CustomPipelinesT>(
    p: Omit<CompleteSchema["deal"], "pipeline" | "stage"> & {
      pipeline?: Pipeline;
      stage?: NonNullable<CustomPipelinesT[Pipeline][number]> extends {
        stageName: infer Q;
      }
        ? Q
        : never;
    }
  ) => Promise<Result<any, Error>>;
  postPerson: (p: CompleteSchema["person"]) => Promise<Result<any, Error>>;
} & {
  getLead: (id: number) => Promise<Result<DeatilsResponse["lead"], Error>>;
  getDeal: (id: number) => Promise<Result<DeatilsResponse["deal"], Error>>;
  getPerson: (id: number) => Promise<Result<DeatilsResponse["person"], Error>>;
};
