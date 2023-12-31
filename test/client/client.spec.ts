import { Mock, beforeAll, describe, expect, mock, test } from "bun:test";
import { PipedriveOrmClient, createPipedriveOrmClient } from "src";
import { PipedriveOrmClientConfig } from "src/client";
import axios, { AxiosInstance } from "axios";

describe("client", () => {
  const instance: AxiosInstance = axios.create({
    baseURL: process.env.PIPEDRIVE_URL,
  });
  const config = { axiosInstance: instance } satisfies PipedriveOrmClientConfig;

  describe("Client with empty custom properties", () => {
    let client: PipedriveOrmClient<{}>;
    let fetchMock: Mock<() => Promise<any>>;

    beforeAll(() => {
      client = createPipedriveOrmClient({}, config);
    });
    test("Creating client works", async () => {
      const result = await client.postLead({
        title: "Title lead",
        person_id: 1256,
      });

      expect(result.ok).toBe(true);
    });
  });
  describe("Client with custom properties", () => {
    let client = createPipedriveOrmClient(
      {
        lead: {
          textField: {
            field_type: "text",
          },
        },
      },
      config
    );

    test.only("Creating client works", async () => {
      const result = await client.postLead({
        title: "Title lead",
      });

      expect(result.ok).toBe(true);
    });
  });
  describe("Client with required custom properties", () => {
    let client = createPipedriveOrmClient(
      {
        lead: {
          textField: {
            field_type: "text",
            required: true,
          },
        },
      },
      config
    );

    test("Creating client works", async () => {
      const result = await client.postLead({
        title: "Title lead",
        custom_fields: {
          textField: "whatever",
        },
      });

      expect(result.ok).toBe(true);
    });
  });
});
