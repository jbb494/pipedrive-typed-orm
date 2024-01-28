import { Result } from "ga-ts";
import { PropertiesFromSchema } from "./properties";
import { CustomPipelines, CustomSchema } from "./schema";
import { DeatilsResponse } from "./pipedrive-entities";

export type PipedriveOrmClient<
  CustomSchemaT extends CustomSchema,
  CustomPipelinesT extends CustomPipelines = {},
  CompleteSchema extends PropertiesFromSchema<CustomSchemaT> = PropertiesFromSchema<CustomSchemaT>
> = {
  postLead: (p: CompleteSchema["lead"]) => Promise<Result<any, Error>>;
  postDeal: <Pipeline extends keyof CustomPipelinesT>(
    p: CompleteSchema["deal"] & {
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
