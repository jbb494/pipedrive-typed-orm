import { AxiosInstance } from "axios";
import { CustomSchema, PropertiesFromSchema } from "src/types";

export const payloadPropertyToPayloadForPipedrive = async <
  CustomSchemaT extends CustomSchema,
  C extends PropertiesFromSchema<CustomSchemaT>,
  P extends C[keyof PropertiesFromSchema<CustomSchemaT>]
>(
  payload: P,
  pathEndpoint: "dealFields" | "personFields",
  axiosInstance: AxiosInstance
) => {
  const response = await axiosInstance.get(`/${pathEndpoint}`, {
    method: "GET",
    headers: {
      "Accept-Encoding": "*",
    },
  });

  const allFields = response.data as any;
  const allCustomFields = allFields.data
    .filter((x: any) => x.edit_flag)
    .reduce((acc: any, elem: any) => ({ ...acc, [elem.name]: elem }), {});

  const { custom_fields, ...fields } = payload;

  const groupBy = (x: any[], key: string) =>
    x.reduce((acc, b) => ({ ...acc, [b[key]]: b }), {});

  const customFieldsPipedrive = Object.entries(custom_fields || {}).reduce(
    (acc, [key, elem]: any) => ({
      ...acc,
      [allCustomFields[key].key]:
        allCustomFields[key].field_type === "enum" ||
        allCustomFields[key].field_type === "set"
          ? Array.isArray(elem)
            ? elem.map(
                (e) => groupBy(allCustomFields[key].options, "label")[e]?.id
              )
            : groupBy(allCustomFields[key].options, "label")[elem]?.id
          : elem,
    }),
    {}
  );

  let finalFields: any = fields;
  if ("pipeline" in fields) {
    const response = await axiosInstance.get(`/pipelines`, {
      method: "GET",
      headers: {
        "Accept-Encoding": "*",
      },
    });

    type Pipeline = { name: string; id: number };
    const pipelines = response.data.data.reduce(
      (acc: Record<string, Pipeline>, elem: Pipeline) => ({
        ...acc,
        [elem.name]: elem,
      }),
      {}
    );
    const pipedriveFieldName: string = fields.pipeline as any;

    if (!Object.keys(pipelines).includes(pipedriveFieldName))
      throw new Error(
        `Pipeline name '${fields.pipeline}' does not exist on Pipedrive.`
      );

    finalFields.pipeline_id = pipelines[pipedriveFieldName].id;
  }
  if ("stage" in fields) {
    const responseStages = await axiosInstance.get(`/stages`, {
      method: "GET",
      headers: {
        "Accept-Encoding": "*",
      },
      params: {
        pipeline_id: finalFields.pipeline_id,
      },
    });

    type Stage = { name: string; id: number };
    const stages = responseStages.data.data.reduce(
      (acc: Record<string, Stage>, elem: Stage) => ({
        ...acc,
        [elem.name]: elem,
      }),
      {}
    );
    const pipedriveStageName: string = fields.stage as any;

    if (!Object.keys(stages).includes(pipedriveStageName))
      throw new Error(
        `Stage name '${fields.stage}' does not exist in pipeline '${finalFields.pipeline_id}' on Pipedrive.`
      );

    finalFields.stage_id = stages[pipedriveStageName].id;
  }

  const finalFieldsAfterPipeline = Object.entries(finalFields).reduce(
    (acc, [key, value]) =>
      ["stage", "pipeline"].includes(key) ? acc : { ...acc, [key]: value },
    {}
  );
  console.log(".");

  const payloadToPipedrive = {
    ...finalFieldsAfterPipeline,
    ...customFieldsPipedrive,
  };
  debugger;
  return payloadToPipedrive;
};
