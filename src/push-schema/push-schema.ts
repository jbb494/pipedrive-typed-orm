import { Schema } from "src/types";
import { Ok, Err, Result } from "ga-ts";
import { getAllFields } from "./utils";

const sleepTime = 200;

const overWriteProperty = async (
  schema: Schema,
  endpointPath: string
): Promise<Result<{ added: number; removed: number }, Error>> => {
  const allFields = await getAllFields(endpointPath);

  if (!allFields.ok) {
    return Err(new Error("tap", { cause: allFields.error }));
  }
  const allCustomFields = allFields.value.data.filter((x: any) => x.edit_flag);
  const pipedriveNames = allCustomFields.map((x: any) => x.name);

  const addedFields = Object.entries(schema).filter(
    ([name, _elem]) => !pipedriveNames.includes(name)
  );

  const removedFields = allCustomFields.filter(
    ({ name }: any) => !Object.keys(schema).includes(name)
  );
  try {
    for (let i = 0; i < addedFields.length; i++) {
      const [name, field] = addedFields[i];

      console.log(`Adding: ${name}`);
      const data = await (
        await fetch(
          `https://api.pipedrive.com/v1/${endpointPath}?api_token=${process.env.PIPEDRIVE_KEY}`,
          {
            method: "POST",
            body: JSON.stringify({
              name: name,
              ...field,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      ).json();
      await new Promise((resolve) =>
        setTimeout(resolve, sleepTime)
      ); /* sleep */
    }
  } catch (e) {
    return Err(new Error("Error pushing added fields", { cause: e }));
  }

  try {
    for (let i = 0; i < removedFields.length; i++) {
      const { name, id } = removedFields[i];
      console.log(`Removing: ${name}`);
      const data = await (
        await fetch(
          `https://api.pipedrive.com/v1/${endpointPath}/${id}?api_token=${process.env.PIPEDRIVE_KEY}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      ).json();
      await new Promise((resolve) =>
        setTimeout(resolve, sleepTime)
      ); /* sleep */
    }
  } catch (e) {
    return Err(new Error("Error removing added fields", { cause: e }));
  }

  return Ok({ added: addedFields.length, removed: removedFields.length });
};

export const pushToPipedrive = async (schemaOverwrite: any) => {
  const resultLead = await overWriteProperty(
    schemaOverwrite.lead,
    "dealFields"
  );
  const resultPerson = await overWriteProperty(
    schemaOverwrite.person,
    "personFields"
  );
  if (!resultLead.ok || !resultPerson.ok)
    return Err(
      new Error("Error pushing properties", {
        cause: { resultLead, resultPerson },
      })
    );
  return Ok({ resultLead: resultLead.value, resultPerson: resultPerson.value });
};
