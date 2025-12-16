import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "sbzov2e3",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});
