import { CodegenConfig } from "@graphql-codegen/cli";

const ENDPOINT =
  "https://api.goldsky.com/api/public/project_clu16lu24lqh201x9f0qh135t/subgraphs/axis-origin-base-sepolia/1.0.4/gn";

const config: CodegenConfig = {
  schema: ENDPOINT,
  documents: ["queries/**/*.graphql"],
  generates: {
    "./src/generated/index.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-query",
      ],
      config: {
        reactQueryVersion: 5,
        fetcher: "fetch",

        namingConvention: {
          enumValues: "change-case-all#titleCase", // Avoids conflicts with enum values, e.g. AuctionLot_OrderBy
        },
        strictScalars: true,
        skipTypename: true,
        scalars: {
          Timestamp: {
            input: "string",
            output: "string",
          },
          Int: {
            input: "string",
            output: "string",
          },
          Int8: {
            input: "string",
            output: "string",
          },
          Float: {
            input: "string",
            output: "string",
          },
          BigDecimal: {
            input: "string",
            output: "string",
          },
          BigInt: {
            input: "string",
            output: "string",
          },
          Bytes: {
            input: "string",
            output: "string",
          },
        },
      },
    },
  },
  hooks: {
    afterAllFileWrite: ["prettier --write"],
  },
};

export default config;
