#!/usr/bin/env bun

import { pushToPipedrive } from "src/push-schema";
import path from "path";

const main = async () => {
  process.env.SCHEMA_PATH = process.argv[2];
  process.env.PIPEDRIVE_KEY = process.argv[3];

  if (!process.argv[2]) throw new Error("Param schema_path is not defined");

  if (!process.argv[3]) throw new Error("Param pipedrive_key is not defined");
  const schema = await import(
    path.join(process.cwd(), process.env.SCHEMA_PATH)
  );
  const exportedSchema = Object.values(schema)[0];

  const result = await pushToPipedrive(exportedSchema as any);

  if (!result.ok) throw new Error("Error pushing schema to Pipedrive");
};

main();
