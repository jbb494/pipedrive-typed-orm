import { AxiosInstance } from "axios";
import { PropertyKeys } from "src/types";
import { Properties } from "src/types/properties";

export const payloadPropertyToPayloadForPipedrive = async <
  P extends Properties[PropertyKeys]
>(
  payload: P,
  pathEndpoint: "dealFields" | "personFields",
  axiosInstance: AxiosInstance
) => {
  const response = await axiosInstance.get(
    `/${pathEndpoint}?api_token=${process.env.PIPEDRIVE_KEY}`,
    {
      method: "GET",
      headers: {
        "Accept-Encoding": "*",
      },
    }
  );

  console.log({ response: JSON.stringify(response.data) });

  const allFields = response.data as any;
  const allCustomFields = allFields.data
    .filter((x: any) => x.edit_flag)
    .reduce((acc: any, elem: any) => ({ ...acc, [elem.name]: elem }), {});

  const { custom_fields, ...fields } = payload;

  const groupBy = (x: any[], key: string) =>
    x.reduce((acc, b) => ({ ...acc, [b[key]]: b }), {});

  const customFieldsPipedrive = Object.entries(custom_fields || {}).reduce(
    (acc, [key, elem]) => ({
      ...acc,
      [allCustomFields[key].key]: allCustomFields[key].options
        ? groupBy(allCustomFields[key].options, "label")[elem]?.id
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
