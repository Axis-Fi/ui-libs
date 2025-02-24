import { cloakServers, Environment, ipfsServers } from ".";

const getCloakServer = (env?: Environment) =>
  cloakServers[env ?? Environment.PRODUCTION];

const getCuratorServer = (env?: Environment) =>
  ipfsServers[env ?? Environment.PRODUCTION];

export { getCloakServer, getCuratorServer };
