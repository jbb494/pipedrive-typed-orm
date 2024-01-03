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
  deleteLead,
  deletePerson,
} from "./helper-client.spec";
import { scenarioASchema } from "test/push-schema/schemas/complex-schemas";
import { emptySchema } from "test/push-schema/schemas";
import { pushToPipedrive } from "src/push-schema";

describe("client", () => {
  const instance: AxiosInstance = createAxiosInstanceMock("scenarioASchema");

  const config = { axiosInstance: instance } satisfies PipedriveOrmClientConfig;

  describe("Client with scenarioA", () => {
    const client = createPipedriveOrmClient<typeof scenarioASchema>(config);
    const postSpy = spyOn(instance, "post");

    it("should post lead no custom fields", async () => {
      const result = await client.postLead({
        title: "Title lead",
        person_id: 1256,
      });

      expect(postSpy.mock.lastCall).toMatchSnapshot();
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
      expect(result.ok).toBe(true);
    });
  });

  describe("Non mocked client (post operations)", () => {
    const axiosInstance = axios.create({
      baseURL: process.env.PIPEDRIVE_URL,
      headers: {
        "Accept-Encoding": "*",
      },
    });
    axiosInstance.defaults.params = {};
    axiosInstance.defaults.params["api_token"] = process.env.PIPEDRIVE_KEY;

    describe("empty schema", () => {
      const client = createPipedriveOrmClient<typeof emptySchema>();

      it("should post lead no custom fields", async () => {
        const resultPerson = await client.postPerson({
          name: "Test Bob",
        });
        expect(resultPerson.ok).toBe(true);

        const resultLead = await client.postLead({
          title: "Title lead",
          person_id: resultPerson.value.data.id,
        });
        expect(resultLead.ok).toBe(true);

        const deleteLeadResult = await deleteLead(
          axiosInstance,
          resultLead.value.data.id
        );
        const deletePersonResult = await deletePerson(
          axiosInstance,
          resultPerson.value.data.id
        );

        expect(deleteLeadResult.ok).toBe(true);
        expect(deletePersonResult.ok).toBe(true);
      });
    });
    describe("Scenario A", () => {
      const client = createPipedriveOrmClient<typeof scenarioASchema>();

      beforeAll(async () => {
        await pushToPipedrive(scenarioASchema);
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
        expect(resultPerson.ok).toBe(true);

        const resultLead = await client.postLead({
          title: "Title lead",
          person_id: resultPerson.value.data.id,
        });
        expect(resultLead.ok).toBe(true);

        const deleteLeadResult = await deleteLead(
          axiosInstance,
          resultLead.value.data.id
        );
        const deletePersonResult = await deletePerson(
          axiosInstance,
          resultPerson.value.data.id
        );

        expect(deleteLeadResult.ok).toBe(true);
        expect(deletePersonResult.ok).toBe(true);
      });
    });
  });
});
