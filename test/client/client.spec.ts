import { AxiosInstance } from "axios";
import { describe, expect, it, mock, spyOn } from "bun:test";
import { createPipedriveOrmClient } from "src";
import { PipedriveOrmClientConfig } from "src/client";
import { createAxiosInstanceMock } from "./helper-client.spec";
import { scenarioASchema } from "test/push-schema/schemas/complex-schemas";

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
});
