import { cloakServers, Environment } from "@axis-finance/env";
import { ConfigsApi, Configuration, KeysApi } from ".";

const cloakApiUrl = cloakServers[Environment.PRODUCTION].url;

const defaultConfig = new Configuration({
  basePath: cloakApiUrl,
});

export class CloakClient {
  keysApi: KeysApi;
  configsApi: ConfigsApi;

  constructor(config: Configuration = defaultConfig) {
    this.keysApi = new KeysApi(config);
    this.configsApi = new ConfigsApi(config);
  }
}

export const createCloakClient = (config?: Configuration) =>
  new CloakClient(config);

export const cloakClient = new CloakClient();
