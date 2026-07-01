import type { PostConfirmationTriggerHandler } from "aws-lambda";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import { env } from "$amplify/env/post-confirmation";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../data/resource";

const { resourceConfig, libraryOptions } =
  await getAmplifyDataClientConfig(env);
Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

export const handler: PostConfirmationTriggerHandler = async (event) => {
  await client.models.UserProfile.create({
    id: event.request.userAttributes.sub,
    email: event.request.userAttributes.email,
    fullname: event.request.userAttributes.name,
    type: "author",
  });
  return event;
};
