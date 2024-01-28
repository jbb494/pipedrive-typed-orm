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

  const payloadToPipedrive = {
    ...fields,
    ...customFieldsPipedrive,
  };
  return payloadToPipedrive;
};
