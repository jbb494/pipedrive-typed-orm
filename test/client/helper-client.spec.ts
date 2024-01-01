import { AxiosInstance } from "axios";

export const createAxiosInstanceMock = (scenario: string): AxiosInstance => {
  return {
    get: async (filePath) => {
      const response = await import(`test/mock/${scenario}/${filePath}.json`);
      return response;
    },
    post: async (filePath, data) => Promise.resolve({ data: {} }),
  } as AxiosInstance;
};
