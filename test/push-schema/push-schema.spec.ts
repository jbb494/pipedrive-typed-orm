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
  pushSchemaToPipedrive,
  removeAllCustomFieldsPipedrive,
  removeDynamicFields,
} from "./push-schema.helper";

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
    ["date", "double", "enum", "monetary", "phone", "set", "text"].map(
      (fieldType) => {
        it(`Should push the ${fieldType} schema to pipedrive (add one field to person and to lead)`, async () => {
          const results = await pushSchemaToPipedrive(`${fieldType}-schema`);

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
      }
    );
  });
  describe("Testing actions", () => {
    it("After applying a schema, the second time shouldnt add nor remove anything", async () => {
      const results = await pushSchemaToPipedrive(`text-schema`);

      expect(results.ok).toEqual(true);

      expect(results.value.resultLead.added).toEqual(1);
      expect(results.value.resultLead.removed).toEqual(0);
      expect(results.value.resultPerson.added).toEqual(1);
      expect(results.value.resultPerson.removed).toEqual(0);

      const resultsSecondTime = await pushSchemaToPipedrive(`text-schema`);

      expect(resultsSecondTime.ok).toEqual(true);

      expect(resultsSecondTime.value.resultLead.added).toEqual(0);
      expect(resultsSecondTime.value.resultLead.removed).toEqual(0);
      expect(resultsSecondTime.value.resultPerson.added).toEqual(0);
      expect(resultsSecondTime.value.resultPerson.removed).toEqual(0);
    });
    it("After applying a schema, the second should remove one and add one", async () => {
      const results = await pushSchemaToPipedrive(`text-schema`);

      expect(results.ok).toEqual(true);

      expect(results.value.resultLead.added).toEqual(1);
      expect(results.value.resultLead.removed).toEqual(0);
      expect(results.value.resultPerson.added).toEqual(1);
      expect(results.value.resultPerson.removed).toEqual(0);

      const resultsSecondTime = await pushSchemaToPipedrive(`double-schema`);

      expect(resultsSecondTime.ok).toEqual(true);

      expect(resultsSecondTime.value.resultLead.added).toEqual(1);
      expect(resultsSecondTime.value.resultLead.removed).toEqual(1);
      expect(resultsSecondTime.value.resultPerson.added).toEqual(1);
      expect(resultsSecondTime.value.resultPerson.removed).toEqual(1);
    });
  });
});
