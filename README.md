# Pipedrive Typed ORM

This project provides a simplified method for managing custom fields in Pipedrive. It enables you to define your custom fields in a TypeScript schema and then push these changes to Pipedrive. This approach encourages the use of the Pipedrive sandbox environment as a staging area for making changes.

We recommend a workflow where you first define your schema in typescript. Then, push these changes to the Pipedrive sandbox URL for testing. Once you've confirmed everything works as expected, you can push the changes to the production URL.

Additionally, this project includes a client that allows you to make POST requests to send data, such as leads, to Pipedrive in a type-safe manner. This eliminates the need to deal with randomly generated IDs, making your posts more readable and type-safe.

before:

```ts
const response = await(
  await fetch(
    `${process.env.PIPEDRIVE_URL}/lead?api_token=${process.env.PIPEDRIVE_KEY}`,
    {
      method: "POST",
      body: JSON.stringify({
        "859d31b30d784df404a530f1d3e2d4e5d9f328f8": [194, 196],
        "8aa23ca40129abb365dcf2c6173adcb6641c65a5": 191,
        person_id: 1256,
        title: "Title lead",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).json()
);
```

With the client

```ts
const result = await client.postLead({
  title: "Title lead",
  person_id: 1256,
  custom_fields: {
    "Car make": "bmw" /* Type safe */,
    "Kms interested": ["10000", "20000"] /* Type safe  */,
  },
});
```

## Getting started

### Defining the schema

You export your schema from a typescript file.

```ts
/* schema/schema.ts */
import { Schema } from "pipedrive-typed-orm";

export const carDealershipSchema = {
  lead: {
    Campaign: {
      field_type: "text",
    },
    "Car make": {
      field_type: "enum",
      options: ["bmw", "seat", "ferrari"],
    },
    "Kms interested": {
      field_type: "set",
      options: ["10000", "15000", "20000"],
    },
  },
  person: {
    City: {
      field_type: "text",
    },
  },
} as const satisfies Schema;
```

### Setting the environment variables

The environment variables that need to be set are:

```sh
    PIPEDRIVE_URL=https://api.pipedrive.com/v1
    PIPEDRIVE_KEY=pipedrive_api_key
    SCHEMA_PATH=path/to/schema.ts
```

### Pushing the schema to pipedrive

```sh
    bunx pipedrive-typed-orm push-schema
```

### Using the client

```ts
import { schema } from "path/to/schema.ts";

const client = createPipedriveOrmClient<typeof schema>();

const result = await client.postLead({
  title: "Title lead",
  person_id: 1256,
  custom_fields: {
    "Car make": "bmw" /* Type safe */,
    "Kms interested": ["10000", "20000"] /* Type safe  */,
  },
});
```

### Type Utilities

```ts
import { PropertiesFromSchema } from "pipedrive-typed-orm";

const Properties = PropertiesFromSchema<CustomSchema>;

const Lead = Properties["lead"];
/* {
  title: string,
  ...
  custom_properties: {
    ...
  }
} */
```

## Roadmap

### Pushing Schema

- [x] FEATURE - Implementing almost all field_types (text, phone, double, date, monetary, enum, set)
- [ ] OPTIMIZATION - Make deletions in bulk
- [ ] FEATURE - Schema diff option (no pushing to pipedrive)
- [ ] FEATURE - Schema pull from pipedrive

### Client

- [x] FEATURE - Posting leads
- [x] FEATURE - Posting persons
- [ ] FEATURE - Posting organizations
- [ ] REFACTOR - createClient shouldnt work with env variables

## Caveats

- The labels of the fields ARE the keys of the schema object. This means that the labels must be unique within each property.
- Setting a field required only work for type safety purposes. Since pipedrive doesn't allow for setting this option from the api.
- Making any post will do two api calls. One for getting the custom fields and the other to send the post.
