import { AxiosInstance } from "axios";
import { Ok, Result } from "ga-ts";
import { PipedriveOrmClient, Schema } from "../types";
import { payloadPropertyToPayloadForPipedrive } from "./payload";

export type PipedriveOrmClientConfig = {
  axiosInstance: AxiosInstance;
};

export const createPipedriveOrmClient = <CustomSchema extends Schema>(
  customFieldsSchema: CustomSchema,
  { axiosInstance }: PipedriveOrmClientConfig
): PipedriveOrmClient<CustomSchema> => {
  return {
    postLead: async (payload): Promise<Result<void, Error>> => {
      const newPayload = await payloadPropertyToPayloadForPipedrive(
        payload as any,
        "dealFields",
        axiosInstance
      );
      console.log({ newPayload });
      return Ok(undefined);
    },
    postPerson: async (payload) => {
      const newPayload = await payloadPropertyToPayloadForPipedrive(
        payload as any,
        "dealFields",
        axiosInstance
      );
      console.log({ newPayload });
      return Ok(undefined);
    },
  };
};
