import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Err, Ok, Result } from "ga-ts";
import { PipedriveOrmClient, Schema } from "../types";
import { payloadPropertyToPayloadForPipedrive } from "./payload";

export type PipedriveOrmClientConfig =
  | {
      axiosInstance: AxiosInstance;
    }
  | {
      apiKey: string | undefined;
    };
export const createPipedriveOrmClient = <CustomSchema extends Schema>(
  config: PipedriveOrmClientConfig
): PipedriveOrmClient<CustomSchema> => {
  let axiosInstance;
  if (!("axiosInstance" in config)) {
    if (!("apiKey" in config)) throw new Error("Api key must be set");

    axiosInstance = axios.create({
      baseURL: "https://api.pipedrive.com/v1",
      headers: {
        "Accept-Encoding": "*",
      },
    });
    axiosInstance.defaults.params = {};
    axiosInstance.defaults.params["api_token"] = config.apiKey;
  } else axiosInstance = config.axiosInstance;

  return {
    postLead: async (payload): Promise<Result<any, Error>> => {
      let newPayload;
      try {
        newPayload = await payloadPropertyToPayloadForPipedrive(
          payload as any,
          "dealFields",
          axiosInstance!
        );
      } catch (e) {
        return Err(
          new Error("Error creating payload for pipedrive", { cause: e })
        );
      }

      let responsePost: AxiosResponse;
      try {
        responsePost = await axiosInstance!.post("leads", newPayload);
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
          axiosInstance!
        );
      } catch (e) {
        return Err(
          new Error("Error creating payload for pipedrive", { cause: e })
        );
      }

      let responsePost: AxiosResponse;
      try {
        responsePost = await axiosInstance!.post("persons", newPayload);
      } catch (e) {
        return Err(
          new Error("Error posting person to pipedrive", { cause: e })
        );
      }

      return Ok(responsePost.data);
    },
    postDeal: async (payload) => {
      let newPayload;
      try {
        newPayload = await payloadPropertyToPayloadForPipedrive(
          payload as any,
          "dealFields",
          axiosInstance!
        );
      } catch (e) {
        return Err(
          new Error("Error creating payload for pipedrive", { cause: e })
        );
      }

      let responsePost: AxiosResponse;
      try {
        responsePost = await axiosInstance!.post("deals", newPayload);
      } catch (e) {
        return Err(new Error("Error posting deal to pipedrive", { cause: e }));
      }

      return Ok(responsePost.data);
    },
    getDeal: async (id) => {
      let responseGet;
      try {
        responseGet = await axiosInstance!.get(`deals/${id}`);
      } catch (e) {
        return Err(new Error("Error getting deal frompipedrive", { cause: e }));
      }

      return Ok(responseGet.data);
    },
    getLead: () => {
      throw new Error("Not implemented");
    },
    getPerson: () => {
      throw new Error("Not implemented");
    },
  };
};
