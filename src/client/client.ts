import { AxiosInstance, AxiosResponse } from "axios";
import { Err, Ok, Result } from "ga-ts";
import { PipedriveOrmClient, Schema } from "../types";
import { payloadPropertyToPayloadForPipedrive } from "./payload";

export type PipedriveOrmClientConfig = {
  axiosInstance: AxiosInstance;
};

export const createPipedriveOrmClient = <CustomSchema extends Schema>({
  axiosInstance,
}: PipedriveOrmClientConfig): PipedriveOrmClient<CustomSchema> => {
  return {
    postLead: async (payload): Promise<Result<any, Error>> => {
      let newPayload;
      try {
        newPayload = await payloadPropertyToPayloadForPipedrive(
          payload as any,
          "dealFields",
          axiosInstance
        );
      } catch (e) {
        return Err(
          new Error("Error creating payload for pipedrive", { cause: e })
        );
      }

      let responsePost: AxiosResponse;
      try {
        responsePost = await axiosInstance.post("lead", newPayload);
      } catch (e) {
        return Err(new Error("Error posting lead to pipedrive", { cause: e }));
      }

      return Ok(responsePost.data);
    },
    postPerson: async (payload) => {
      let newPayload;
      try {
        newPayload = await payloadPropertyToPayloadForPipedrive(
          payload as any,
          "personFields",
          axiosInstance
        );
      } catch (e) {
        return Err(
          new Error("Error creating payload for pipedrive", { cause: e })
        );
      }

      let responsePost: AxiosResponse;
      try {
        responsePost = await axiosInstance.post("person", newPayload);
      } catch (e) {
        return Err(
          new Error("Error posting person to pipedrive", { cause: e })
        );
      }

      return Ok(responsePost.data);
    },
  };
};
