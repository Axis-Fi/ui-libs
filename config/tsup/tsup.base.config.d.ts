import type { Options } from "tsup";

declare function createConfig(
  overrides?: Partial<Options>,
): ReturnType<typeof import("tsup").defineConfig>;

export default createConfig;
