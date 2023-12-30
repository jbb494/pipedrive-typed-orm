import { beforeAll, describe, expect, test } from "bun:test";
import { PipedriveOrmClient, createPipedriveOrmClient } from "src";

describe("client", () => {
  describe("Client with empty custom properties", () => {
    let client: PipedriveOrmClient<{}>;
    beforeAll(() => {
      client = createPipedriveOrmClient({});
    });
    test("Creating client works", async () => {
      const result = await client.postlead({ title: "Title lead" });

      expect(result.ok).toBe(true);
    });
  });
  describe("Client with custom properties", () => {
    let client = createPipedriveOrmClient({
      lead: {
        textField: {
          field_type: "text",
        },
      },
    });

    test("Creating client works", async () => {
      const result = await client.postlead({
        title: "Title lead",
      });

      expect(result.ok).toBe(true);
    });
  });
  describe("Client with required custom properties", () => {
    let client = createPipedriveOrmClient({
      lead: {
        textField: {
          field_type: "text",
          required: true,
        },
      },
    });

    test("Creating client works", async () => {
      const result = await client.postlead({
        title: "Title lead",
        custom_fields: {
          textField: "whatever",
        },
      });

      expect(result.ok).toBe(true);
    });
  });
});
