import { AxiosInstance } from "axios";
import { Err, Ok, Result } from "ga-ts";

export const createAxiosInstanceMock = (scenario: string): AxiosInstance => {
  return {
    get: async (filePath) => {
      const response = await import(
        `test/mock/${scenario}/${filePath
          .replace(/^\//, "")
          .replaceAll("/", "-")}.json`
      );
      return response;
    },
    post: async (filePath, data) => Promise.resolve({ data: {} }),
  } as AxiosInstance;
};

export const deleteLead = async (
  axiosInstance: AxiosInstance,
  id: number
): Promise<Result<undefined, Error>> => {
  let response;
  try {
    response = await axiosInstance.delete(`leads/${id}`);
    return Ok(undefined);
  } catch (e) {
    return Err(new Error("Error deleting lead", { cause: e }));
  }
};

export const deleteDeal = async (
  axiosInstance: AxiosInstance,
  id: number
): Promise<Result<undefined, Error>> => {
  let response;
  try {
    response = await axiosInstance.delete(`deals/${id}`);
    return Ok(undefined);
  } catch (e) {
    return Err(new Error("Error deleting deal", { cause: e }));
  }
};

export const deletePerson = async (
  axiosInstance: AxiosInstance,
  id: number
): Promise<Result<undefined, Error>> => {
  let response;
  try {
    response = await axiosInstance.delete(`persons/${id}`);
    return Ok(undefined);
  } catch (e) {
    return Err(new Error("Error deleting person", { cause: e }));
  }
};
