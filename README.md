# Axis Frontend libraries

Monorepo for Axis Finance frontend libraries, using [turbo](https://turbo.build/repo).

# SDK

This monorepo contains an [SDK](./packages/sdk) for interacting with the Axis deployments. If you want to use that library, go to the [SDK README](./packages/sdk/README.md) for more information.

## Dev Setup

- run `pnpm install` to install dependencies for all packages

### Other Useful Commands

- `pnpm build` - Build all packages
- `pnpm dev` - Run all packages locally
- `pnpm dev --filter=<project_name>` - Run a specific package locally
- `pnpm lint` - Lint all packages
- `pnpm format` - Format all packages
- `pnpm clean` - Clean up all `node_modules` and `dist` folders (runs each package's clean script)

## Apps & Packages

This repo includes the following packages and applications:

- `packages/abis`: Protocol's contract abis
- `packages/cloak`: Key management API
- `packages/deployments`: Metadata and configuration for the protocol's chain deployments
- `packages/env`: Shared environment configuration
- [`packages/sdk`](./packages/sdk/README.md): JS Library for interacting with Axis contracts and subgraphs
- `packages/subgraph-client`: Subgraph client and queries
- `packages/types`: Common TS types
- `config/typescript-config`: Shared `tsconfig.json`s used throughout the Turborepo
- `config/eslint-config`: ESLint preset
