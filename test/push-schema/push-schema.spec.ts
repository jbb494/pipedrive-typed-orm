import { sleep } from "bun";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "bun:test";
import { pushToPipedrive } from "src/push-schema";
import { getAllFields } from "src/push-schema/utils";
import {
  removeAllCustomFieldsPipedrive,
  removeDynamicFields,
} from "./push-schema.helper";

import { oneFieldSchemas } from "./schemas";

describe("Push schema", () => {
  beforeAll(async () => {
    const results = await removeAllCustomFieldsPipedrive();

    expect(results.ok).toEqual(true);
  });
  beforeEach(() => {
    process.env.SCHEMA_PATH = undefined;
  });
  afterEach(async () => {
    const results = await removeAllCustomFieldsPipedrive();

    expect(results.ok).toEqual(true);
  });

  describe("Testing fields", () => {
    Object.entries(oneFieldSchemas).map(([key, schema]) => {
      it(`Should push the ${key} schema to pipedrive (add one field to person and to lead)`, async () => {
        const results = await pushToPipedrive(schema);

        const resultDealState = await getAllFields("dealFields");
        sleep(100);
        const resultPersonState = await getAllFields("personFields");

        expect(resultDealState.ok).toBeTrue();
        expect(resultPersonState.ok).toBeTrue();

        expect(results.ok).toEqual(true);

        expect(results.value.resultLead.added).toEqual(1);
        expect(results.value.resultLead.removed).toEqual(0);
        expect(results.value.resultPerson.added).toEqual(1);
        expect(results.value.resultPerson.removed).toEqual(0);

        expect(
          resultDealState.value.data
            .filter((x: any) => x.edit_flag)
            .map(removeDynamicFields)
        ).toMatchSnapshot();
        expect(
          resultPersonState.value.data
            .filter((x: any) => x.edit_flag)
            .map(removeDynamicFields)
        ).toMatchSnapshot();
      });
    });
  });
  describe("Testing actions", () => {
    it("After applying a schema, the second time shouldnt add nor remove anything", async () => {
      const results = await pushToPipedrive(oneFieldSchemas.textSchema);

      expect(results.ok).toEqual(true);

      expect(results.value.resultLead.added).toEqual(1);
      expect(results.value.resultLead.removed).toEqual(0);
      expect(results.value.resultPerson.added).toEqual(1);
      expect(results.value.resultPerson.removed).toEqual(0);

      const resultsSecondTime = await pushToPipedrive(
        oneFieldSchemas.textSchema
      );

      expect(resultsSecondTime.ok).toEqual(true);

      expect(resultsSecondTime.value.resultLead.added).toEqual(0);
      expect(resultsSecondTime.value.resultLead.removed).toEqual(0);
      expect(resultsSecondTime.value.resultPerson.added).toEqual(0);
      expect(resultsSecondTime.value.resultPerson.removed).toEqual(0);
    });
    it("After applying a schema, the second should remove one and add one", async () => {
      const results = await pushToPipedrive(oneFieldSchemas.textSchema);

      expect(results.ok).toEqual(true);

      expect(results.value.resultLead.added).toEqual(1);
      expect(results.value.resultLead.removed).toEqual(0);
      expect(results.value.resultPerson.added).toEqual(1);
      expect(results.value.resultPerson.removed).toEqual(0);

      const resultsSecondTime = await pushToPipedrive(
        oneFieldSchemas.doubleSchema
      );

      expect(resultsSecondTime.ok).toEqual(true);

      expect(resultsSecondTime.value.resultLead.added).toEqual(1);
      expect(resultsSecondTime.value.resultLead.removed).toEqual(1);
      expect(resultsSecondTime.value.resultPerson.added).toEqual(1);
      expect(resultsSecondTime.value.resultPerson.removed).toEqual(1);
    });
  });
});
