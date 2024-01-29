import {
  BaseSchema,
  CustomPipelines,
  CustomSchema,
  SchemaFile,
} from "src/types";
import { Ok, Err, Result } from "ga-ts";
import { getAllFields } from "./utils";

const sleepTime = 200;

const overWriteProperty = async (
  schema: BaseSchema[keyof BaseSchema],
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

const pushPipelineSchema = async (
  pipelineSchema: CustomPipelines
): Promise<
  Result<
    Record<"pipelines" | "stages", { added: number; removed: number }>,
    Error
  >
> => {
  let q = 0;
  /* Post pipeline with name*/
  const postPipeline = async (name: string): Promise<{ id: number }> =>
    (
      (await (
        await fetch(
          `https://api.pipedrive.com/v1/pipelines?api_token=${process.env.PIPEDRIVE_KEY}`,
          {
            method: "POST",
            body: JSON.stringify({
              name: name,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      ).json()) as any
    ).data;

  /* Post stage with name and pipelineId*/
  const postStage = async (name: string, pipelineId: number): Promise<void> =>
    (
      (await (
        await fetch(
          `https://api.pipedrive.com/v1/stages?api_token=${process.env.PIPEDRIVE_KEY}`,
          {
            method: "POST",
            body: JSON.stringify({
              name: name,
              pipeline_id: pipelineId,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      ).json()) as any
    ).data;

  /* Get all  pipelines */
  const getPipelines = async (): Promise<Array<{ id: number; name: string }>> =>
    (
      (await (
        await fetch(
          `https://api.pipedrive.com/v1/pipelines?api_token=${process.env.PIPEDRIVE_KEY}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      ).json()) as any
    ).data;

  /* Get stages from one pipelines */
  const getStages = async (
    pipelineId: number
  ): Promise<Array<{ name: string; id: string }>> =>
    (
      (await (
        await fetch(
          `https://api.pipedrive.com/v1/stages?api_token=${process.env.PIPEDRIVE_KEY}&pipeline_id=${pipelineId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      ).json()) as any
    ).data;

  /* Remove pipeliine with id */
  const removePipeline = async (id: number): Promise<void> =>
    (
      (await (
        await fetch(
          `https://api.pipedrive.com/v1/pipelines?api_token=${process.env.PIPEDRIVE_KEY}`,
          {
            method: "DELETE",
            body: JSON.stringify({
              id,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      ).json()) as any
    ).data;

  /* Remove stages from pipelineId */
  const removeStages = async (ids: Array<string>): Promise<void> =>
    (
      (await (
        await fetch(
          `https://api.pipedrive.com/v1/stages?api_token=${process.env.PIPEDRIVE_KEY}`,
          {
            method: "DELETE",
            body: JSON.stringify({
              ids,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      ).json()) as any
    ).data;

  const pipelineNamesFromSchema = Object.keys(pipelineSchema);

  const pipelinesFromPipedrive = await getPipelines();

  const pipelineNamesFromPipedrive = pipelinesFromPipedrive.map((p) => p.name);

  const pipelinesToAdd = pipelineNamesFromSchema.filter(
    (p) => !pipelineNamesFromPipedrive.includes(p)
  );
  const pipelinesToRemove = pipelinesFromPipedrive.filter(
    (p) => !pipelineNamesFromSchema.includes(p.name)
  );
  const pipelinesUnchanged = pipelinesFromPipedrive.filter((p) =>
    pipelineNamesFromSchema.includes(p.name)
  );

  let addedPipelines = 0;
  let removedPipelines = 0;
  let addedStages = 0;
  let removedStages = 0;

  for (const pipelineName of pipelinesToAdd) {
    try {
      const pipeline = await postPipeline(pipelineName);
      addedPipelines++;
      console.log(`Added pipeline: ${pipelineName}`);

      const stagesFromSchema = pipelineSchema[pipelineName];
      for (const stage of stagesFromSchema) {
        await postStage(stage.stageName, pipeline.id);
        addedStages++;
        console.log(
          `Added stage: ${stage.stageName} to pipeline: ${pipelineName}`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, sleepTime)
        ); /* sleep */
      }
    } catch (error) {
      return Err(
        new Error(`Error adding pipeline or stages for ${pipelineName}`, {
          cause: error,
        })
      );
    }
  }

  /* Pipeline to be removed */
  for (const pipeline of pipelinesToRemove) {
    try {
      const stagesFromPipedrive = (await getStages(pipeline.id)) || [];
      await new Promise((resolve) =>
        setTimeout(resolve, sleepTime)
      ); /* sleep */

      removedStages += stagesFromPipedrive.length;

      await removeStages(stagesFromPipedrive.map((s) => s.id));
      console.log(
        `Removed stages (${stagesFromPipedrive.join(",")}) from pipeline: ${
          pipeline.name
        }`
      );
      await new Promise((resolve) =>
        setTimeout(resolve, sleepTime)
      ); /* sleep */
      await removePipeline(pipeline.id);
      console.log(`Removed pipeline: ${pipeline.id}`);
      await new Promise((resolve) =>
        setTimeout(resolve, sleepTime)
      ); /* sleep */

      removedPipelines++;
    } catch (error) {
      return Err(
        new Error(`Error removing pipeline or stages for ${pipeline.id}`, {
          cause: error,
        })
      );
    }
  }

  /* Pipelines that were unchanged */
  for (const pipeline of pipelinesUnchanged) {
    try {
      const stagesFromPipedrive = (await getStages(pipeline.id)) || [];
      await new Promise((resolve) =>
        setTimeout(resolve, sleepTime)
      ); /* sleep */

      const stagesFromSchema = pipelineSchema[pipeline.name];

      const stagesToAdd = stagesFromSchema.filter(
        (s) => !stagesFromPipedrive.map((p) => p.name).includes(s.stageName)
      );
      const stagesToRemove = stagesFromPipedrive.filter(
        (p) => !stagesFromSchema.map((s) => s.stageName).includes(p.name)
      );

      for (const stage of stagesToAdd) {
        await postStage(stage.stageName, pipeline.id);
        addedStages++;
        console.log(
          `Added stage: ${stage.stageName} to pipeline: ${pipeline.name}`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, sleepTime)
        ); /* sleep */
      }

      await removeStages(stagesToRemove.map((x) => x.id));
      console.log(
        `Removed stages (${stagesToRemove.join(",")}) from pipeline: ${
          pipeline.name
        }`
      );
      await new Promise((resolve) =>
        setTimeout(resolve, sleepTime)
      ); /* sleep */
      removedStages += stagesToRemove.length;
    } catch (error) {
      return Err(
        new Error(`Error adding or removing stages for ${pipeline.name}`, {
          cause: error,
        })
      );
    }
  }

  return Ok({
    pipelines: { added: addedPipelines, removed: removedPipelines },
    stages: { added: addedStages, removed: removedStages },
  });
};

type DeltaType = { added: number; removed: number };

export async function pushToPipedrive(schemaFile: SchemaFile): Promise<
  Result<
    {
      resultLead: DeltaType;
      resultPerson: DeltaType;
      resultPipeline: { stages: DeltaType; pipelines: DeltaType };
    },
    Error
  >
> {
  const schemaOverwrite = schemaFile.custom_fields;
  const pipelineSchema = schemaFile.custom_pipelines;
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

  if (!pipelineSchema)
    return Ok({
      resultLead: resultLead.value,
      resultPerson: resultPerson.value,
      resultPipeline: {
        pipelines: {
          added: 0,
          removed: 0,
        },
        stages: {
          added: 0,
          removed: 0,
        },
      },
    });

  const resultPipeline = await pushPipelineSchema(pipelineSchema);

  if (!resultPipeline.ok) {
    return Err(
      new Error("Error pushing pipelines", { cause: resultPipeline.error })
    );
  }
  return Ok({
    resultLead: resultLead.value,
    resultPerson: resultPerson.value,
    resultPipeline: resultPipeline.value,
  });
}
