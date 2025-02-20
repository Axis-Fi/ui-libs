import * as v from "valibot";
import { typeSchema, schema } from "./schema";

export type MerkletRootTypes = v.InferOutput<typeof typeSchema>;
export type GenerateMerkleTreeParams = v.InferOutput<typeof schema>;
