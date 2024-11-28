import { defineConfig } from "tsup";

export default function createConfig(overrides = {}) {
  return defineConfig({
    entry: ["src/index.ts"],
    format: ["esm"],
    sourcemap: true,
    clean: true,
    platform: "browser",
    splitting: false,
    dts: {
      outDir: "dist",
      ...overrides.dts,
    },
    outDir: "dist",
    ...overrides,
  });
}
