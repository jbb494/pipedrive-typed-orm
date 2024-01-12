import { Ok, Err } from "ga-ts";

export const getAllFields = async (endpointPath: string) => {
  try {
    return Ok(
      (await (
        await fetch(
          `https://api.pipedrive.com/v1/${endpointPath}?api_token=${process.env.PIPEDRIVE_KEY}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      ).json()) as any
    );
  } catch (e) {
    return Err(new Error("Error fetching allFields", { cause: e }));
  }
};
