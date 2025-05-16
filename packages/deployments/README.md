# Axis Deployments

This repo contains all the data that describes an Axis Deployment per chain. This includes Axis contract addresses, chain and token metadata and a subgraph configuration.

For chains we extend [viem's chain definition](https://viem.sh/docs/chains/introduction.html)

## Adding a new chain deployment

1. Obtain the deployment configuration for the [core](https://github.com/Axis-Fi/axis-core/tree/master/deployments), [periphery](https://github.com/Axis-Fi/axis-periphery/tree/master/deployments), and [utils](https://github.com/Axis-Fi/axis-registry) contracts from the linked repos.

2. Copy the deployment configs into `./src/axis-core`, `./src/axis-periphery`, and `./src/axis-utils`

3. Create a new file with the network name in the corresponding dir on the project root (`./src/chains/testnet` or `./src/chains/mainnet`)

4. Add the chain information including RPC and subgraph URLs

5. Add your file to the `index.ts` barrel file in the same directory

6. Commit a changeset for this package from the monorepo root with `pnpm build && pnpm cs-version`

7. Approve the changeset on Github to trigger an npm release
