import createConfig from "@axis-finance/tsup-config";

export default createConfig({
  format: ["esm"],
  dts: true,
  platform: "node",
  // The Fleek SDK depdendency seems to be calling require() in an ESM module
  // so this code banner hack is a workaround to prevent it breaking the build
  esbuildOptions(options) {
    options.banner = {
      js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
    };
  },
});
