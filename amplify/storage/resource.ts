import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "blogDrive",
  access: (allow) => ({
    "blogs/{entity_id}/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "delete", "write"]),
      allow.groups(["admin"]).to(["read", "delete", "write"]),
      allow.groups(["author"]).to(["read", "delete", "write"]),
      allow.entity("identity").to(["read", "delete", "write"]),
    ],
  }),
});
