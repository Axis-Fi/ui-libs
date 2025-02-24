import { z } from "zod";

export const CuratorProfileSchema = z.object({
  curatorProfilePayload: z.string(),
  ipfsCid: z.string(),
});

export type CuratorProfile = z.infer<typeof CuratorProfileSchema>;
