import axios, { AxiosInstance } from "axios";
import { pushToPipedrive } from "src/push-schema";
import { complexSchemas } from "test/push-schema/schemas";

const mockGenerator = async () => {
  const mockPath = "test/mock";
  const instance: AxiosInstance = axios.create({
    baseURL: process.env.PIPEDRIVE_URL,
    headers: {
      "Accept-Encoding": "*",
    },
  });
  instance.defaults.params = {};
  instance.defaults.params["api_token"] = process.env.PIPEDRIVE_KEY;

  /* The idea is
  
  first we push a schema to pipedrive
  then we get dealFields y personFields
  we save them to test/mock/schema-name.json
  
  */

  for (const [key, schema] of Object.entries(complexSchemas)) {
    const result = await pushToPipedrive(schema);
    if (!result.ok)
      throw new Error(`Error pushing schema on schema: ${key}`, {
        cause: result.value,
      });

    const response = await instance.get("/dealFields");
    console.log({ response });
  }
};

mockGenerator();
