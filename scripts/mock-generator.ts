import axios, { AxiosInstance } from "axios";
import { pushToPipedrive } from "src/push-schema";
import { complexSchemas, emptySchema } from "test/push-schema/schemas";
import * as R from "ramda";
import fs from "fs";

const mockGenerator = async () => {
  const MOCK_PATH = "test/mock";
  const instance: AxiosInstance = axios.create({
    baseURL: process.env.PIPEDRIVE_URL,
    headers: {
      "Accept-Encoding": "*",
    },
  });
  instance.defaults.params = {};
  instance.defaults.params["api_token"] = process.env.PIPEDRIVE_KEY;

  const pickData = R.pick(["data"]);
  const endpointsToMock = ["dealFields", "personFields"];
  for (const [schemaName, schema] of Object.entries(complexSchemas)) {
    const result = await pushToPipedrive(schema);
    if (!result.ok)
      throw new Error(`Error pushing schema on schema: ${schemaName}`, {
        cause: result.value,
      });

    for (const endpoint of endpointsToMock) {
      const response = await instance.get(`/${endpoint}`);
      if (!fs.existsSync(`${MOCK_PATH}/${schemaName}`)) {
        fs.mkdirSync(`${MOCK_PATH}/${schemaName}`, { recursive: true });
      }

      fs.writeFileSync(
        `${MOCK_PATH}/${schemaName}/${endpoint}.json`,
        JSON.stringify(pickData(response), null, 2)
      );
    }

    const pushToEmptySchemaResult = await pushToPipedrive(emptySchema);
    if (!pushToEmptySchemaResult.ok)
      throw new Error(`Error pushing schema on schema: ${schemaName}`, {
        cause: result.value,
      });
  }
};

mockGenerator();
