import axios, { AxiosInstance } from "axios";
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import { createPipedriveOrmClient } from "src";
import { PipedriveOrmClientConfig } from "src/client";
import {
  createAxiosInstanceMock,
  deleteDeal,
  deleteLead,
  deletePerson,
} from "./helper-client.spec";
import { scenarioASchema } from "test/push-schema/schemas/complex-schemas";
import { emptySchema } from "test/push-schema/schemas";
import { pushToPipedrive } from "src/push-schema";
import { schenarioAPipelineSchema } from "test/push-schema/schemas/complex-schemas/scenarioA-schema";
import { sleep } from "bun";

describe("client", () => {
  const instance: AxiosInstance = createAxiosInstanceMock("scenarioASchema");

  const config = {
    axiosInstance: instance,
  } satisfies PipedriveOrmClientConfig;

  const client = createPipedriveOrmClient<typeof scenarioASchema>(config);
  const postSpy = spyOn(instance, "post");

  describe("Client with scenarioA", () => {
    describe("Post", () => {
      it("should post lead no custom fields", async () => {
        const result = await client.postLead({
          title: "Title lead",
          person_id: 1256,
        });

        expect(postSpy.mock.lastCall).toMatchSnapshot();
        if (!result.ok) console.error(result.error);
        expect(result.ok).toBe(true);
      });
      it("should post lead with custom fields", async () => {
        const result = await client.postLead({
          title: "Title lead",
          person_id: 1256,
          custom_fields: {
            carMake: "bmw",
            kmsInterested: ["10000", "20000"],
          },
        });

        expect(postSpy.mock.lastCall).toMatchSnapshot();
        if (!result.ok) console.error(result.error);
        expect(result.ok).toBe(true);
      });
      it("should post deal with custom fields", async () => {
        const result = await client.postDeal({
          title: "Title lead",
          person_id: 1256,
          label_ids: ["a", "b"],
          custom_fields: {
            carMake: "bmw",
            kmsInterested: ["10000", "20000"],
          },
        });

        expect(postSpy.mock.lastCall).toMatchSnapshot();
        if (!result.ok) console.error(result.error);
        expect(result.ok).toBe(true);
      });
      it("should post person with custom fields", async () => {
        const result = await client.postPerson({
          name: "Whatever",
          email: "whatever@whatever.es",
          custom_fields: {
            partnerName: "whatever",
            partnerAge: 2,
          },
        });

        expect(postSpy.mock.lastCall).toMatchSnapshot();
        if (!result.ok) console.error(result.error);
        expect(result.ok).toBe(true);
      });
    });
  });
  describe("Get", () => {
    it("Should get deal", async () => {
      const id = 7;
      const result = await client.getDeal(id);

      expect(result.value.data).toMatchSnapshot();
      expect(result.value.success).toBe(true);
      if (!result.ok) console.error(result.error);
      expect(result.ok).toBe(true);
    });
  });

  describe("Non mocked client (post operations)", () => {
    const axiosInstance = axios.create({
      baseURL: "https://api.pipedrive.com/v1",
      headers: {
        "Accept-Encoding": "*",
      },
    });
    axiosInstance.defaults.params = {};
    axiosInstance.defaults.params["api_token"] = process.env.PIPEDRIVE_KEY;

    describe("empty schema", () => {
      const client = createPipedriveOrmClient<typeof emptySchema>({
        apiKey: process.env.PIPEDRIVE_KEY,
      });

      it("should post lead no custom fields", async () => {
        const resultPerson = await client.postPerson({
          name: "Test Bob",
        });
        if (!resultPerson.ok) console.error(resultPerson.error);
        expect(resultPerson.ok).toBe(true);

        const resultLead = await client.postLead({
          title: "Title lead",
          person_id: resultPerson.value.data.id,
        });
        if (!resultLead.ok) console.error(resultLead.error);
        expect(resultLead.ok).toBe(true);

        const deleteLeadResult = await deleteLead(
          axiosInstance,
          resultLead.value.data.id
        );
        const deletePersonResult = await deletePerson(
          axiosInstance,
          resultPerson.value.data.id
        );

        if (!resultLead.ok) console.error(resultLead.error);
        expect(deleteLeadResult.ok).toBe(true);
        if (!deletePersonResult.ok) console.error(deletePersonResult.error);
        expect(deletePersonResult.ok).toBe(true);
      });
    });
    describe("Scenario A", () => {
      const client = createPipedriveOrmClient<
        typeof scenarioASchema,
        typeof schenarioAPipelineSchema
      >({
        apiKey: process.env.PIPEDRIVE_KEY,
      });

      beforeAll(async () => {
        await pushToPipedrive(scenarioASchema, schenarioAPipelineSchema);
      });
      afterAll(async () => {
        await pushToPipedrive(emptySchema);
      });
      it("Should post lead with custom fields", async () => {
        const resultPerson = await client.postPerson({
          name: "Test Bob",
          custom_fields: {
            partnerName: "Maria",
          },
        });
        if (!resultPerson.ok) console.error(resultPerson.error);
        expect(resultPerson.ok).toBe(true);

        const resultLead = await client.postLead({
          title: "Title lead",
          person_id: resultPerson.value.data.id,
          custom_fields: {
            carMake: "bmw",
          },
        });

        if (!resultLead.ok) console.error(resultLead.error);
        expect(resultLead.ok).toBe(true);

        const deleteLeadResult = await deleteLead(
          axiosInstance,
          resultLead.value.data.id
        );
        const deletePersonResult = await deletePerson(
          axiosInstance,
          resultPerson.value.data.id
        );

        if (!deleteLeadResult.ok) console.error(deleteLeadResult.error);
        expect(deleteLeadResult.ok).toBe(true);

        if (!deletePersonResult.ok) console.error(deletePersonResult.error);
        expect(deletePersonResult.ok).toBe(true);
      });
      it("should post deal to pipeline and stage", async () => {
        const resultPerson = await client.postPerson({
          name: "Test Bob",
          custom_fields: {
            partnerName: "Maria",
          },
        });

        if (!resultPerson.ok) console.error(resultPerson.error);
        expect(resultPerson.ok).toBe(true);

        const resultDeal = await client.postDeal({
          title: "Test Bob deal in pipeline",
          person_id: resultPerson.value.data.id,
          pipeline: "pipelineB",
          stage: "Stage3",
        });

        if (!resultDeal.ok) console.error(resultDeal.error);
        expect(resultDeal.ok).toBe(true);

        const delateDealResult = await deleteDeal(
          axiosInstance,
          resultDeal.value.data.id
        );
        const deletePersonResult = await deletePerson(
          axiosInstance,
          resultPerson.value.data.id
        );

        if (!delateDealResult.ok) console.error(delateDealResult.error);
        expect(delateDealResult.ok).toBe(true);
        if (!deletePersonResult.ok) console.error(deletePersonResult.error);
        expect(deletePersonResult.ok).toBe(true);
      });
    });
  });
});
