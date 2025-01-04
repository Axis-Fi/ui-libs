import { cloakServers, Environment, ipfsServers } from ".";

const getCloakServer = (env?: Environment) =>
  cloakServers[env ?? Environment.PRODUCTION];

const getMetadataServer = (env?: Environment) =>
  ipfsServers[env ?? Environment.PRODUCTION];

export { getCloakServer, getMetadataServer };
