import axios, { AxiosInstance } from "axios";
import { pushToPipedrive } from "src/push-schema";
import { complexSchemas, emptySchema } from "test/push-schema/schemas";
import * as R from "ramda";
import fs from "fs";
import { scenarioASchema } from "test/push-schema/schemas/complex-schemas";
import { createPipedriveOrmClient } from "..";

const MOCK_PATH = "test/mock";
const pickData = R.pick(["data"]);

const saveResponse = ({
  schemaName,
  endpoint,
  params,
  response,
}: {
  schemaName: string;
  endpoint: string;
  params?: any;
  response: any;
}) => {
  if (!fs.existsSync(`${MOCK_PATH}/${schemaName}`)) {
    fs.mkdirSync(`${MOCK_PATH}/${schemaName}`, { recursive: true });
  }

  fs.writeFileSync(
    `${MOCK_PATH}/${schemaName}/${endpoint.replaceAll("/", "-")}${
      params ? btoa(JSON.stringify(params)) : ""
    }.json`,
    JSON.stringify(pickData(response), null, 2)
  );
};

const mockGenerator = async () => {
  const instance: AxiosInstance = axios.create({
    baseURL: "https://api.pipedrive.com/v1",
    headers: {
      "Accept-Encoding": "*",
    },
  });
  instance.defaults.params = {};
  instance.defaults.params["api_token"] = process.env.PIPEDRIVE_KEY;

  const endpointsToMock = ["dealFields", "personFields"];
  for (const [schemaName, schema] of Object.entries(complexSchemas)) {
    const result = await pushToPipedrive(schema);
    if (!result.ok)
      throw new Error(`Error pushing schema on schema: ${schemaName}`, {
        cause: result.value,
      });

    for (const endpoint of endpointsToMock) {
      const response = await instance.get(`/${endpoint}`);
      saveResponse({ endpoint, response, schemaName });
    }

    const pushToEmptySchemaResult = await pushToPipedrive(emptySchema);
    if (!pushToEmptySchemaResult.ok)
      throw new Error(`Error pushing schema on empty schema`, {
        cause: result.value,
      });
  }

  /* Special scenarios */
  const result = await pushToPipedrive(scenarioASchema);
  const client = createPipedriveOrmClient<typeof scenarioASchema>({
    apiKey: process.env.PIPEDRIVE_KEY,
  });
  if (!result.ok)
    throw new Error(`Error pushing schema on schema scenarioASchema`, {
      cause: result.value,
    });

  const personResult = await client.postPerson({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
    custom_fields: {
      partnerName: "Jane Doe",
      partnerAge: 30,
    },
  });

  if (!personResult.ok)
    throw new Error(`Error posting person `, {
      cause: personResult.value,
    });

  const dealPostedResult = await client.postDeal({
    title: "Deal 1",
    person_id: personResult.value.data.id,
  });

  if (!dealPostedResult.ok)
    throw new Error(`Error posting person or deal`, {
      cause: dealPostedResult.value,
    });

  const person = personResult.value;
  const deal = dealPostedResult.value;

  const personDetails = await instance.get(`/persons/${person.data.id}`);
  const dealsDeatils = await instance.get(`/deals/${deal.data.id}`);

  saveResponse({
    endpoint: `persons/${person.data.id}`,
    response: personDetails,
    schemaName: "scenarioASchema",
  });

  saveResponse({
    endpoint: `deals/${deal.data.id}`,
    response: dealsDeatils,
    schemaName: "scenarioASchema",
  });

  const pushToEmptySchemaResult = await pushToPipedrive(emptySchema);
  if (!pushToEmptySchemaResult.ok)
    throw new Error(`Error pushing schema on schema empty schema`, {
      cause: result.value,
    });
};

mockGenerator();
