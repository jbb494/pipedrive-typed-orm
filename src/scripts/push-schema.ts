#!/usr/bin/env node

import { pushToPipedrive } from "src/push-schema";

const main = async () => {
  const schemaPath = process.env.SCHEMA_PATH;
  if (!schemaPath)
    throw new Error("Environmenet variable SCHEMA_PATH is not defined");

  const schema = await import(schemaPath);
  const exportedSchema = Object.values(schema)[0];

  const result = await pushToPipedrive(exportedSchema);

  if (!result.ok) throw new Error("Error pushing schema to Pipedrive");
};

main();
