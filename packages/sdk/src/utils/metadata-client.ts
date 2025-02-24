import {
  FleekSdk,
  ApplicationAccessTokenService,
} from "@fleek-platform/sdk/browser";

type MetadataClientConfig = {
  fleekApplicationClientId: string;
  authAppsServiceUrl?: string;
  graphqlServiceApiUrl?: string;
  ipfsStorageApiUrl?: string;
  uploadProxyApiUrl?: string;
};

export type SaveParams = {
  metadata: string;
  id?: string;
};

export class MetadataClient {
  private sdk: FleekSdk;

  constructor({
    fleekApplicationClientId,
    authAppsServiceUrl,
    graphqlServiceApiUrl,
    ipfsStorageApiUrl,
    uploadProxyApiUrl,
  }: MetadataClientConfig) {
    if (!fleekApplicationClientId) {
      throw new Error("Fleek application client ID is required");
    }

    const applicationService = new ApplicationAccessTokenService({
      clientId: fleekApplicationClientId,
      authAppsServiceUrl,
    });

    this.sdk = new FleekSdk({
      accessTokenService: applicationService,
      graphqlServiceApiUrl,
      ipfsStorageApiUrl,
      uploadProxyApiUrl,
    });
  }

  async save({ metadata, id }: SaveParams): Promise<string> {
    try {
      JSON.parse(metadata);
    } catch (e) {
      throw new Error("Invalid JSON metadata");
    }

    try {
      const blob = new Blob([metadata], { type: "application/json" });
      const file = new File([blob], id ?? `unknown-${Date.now()}`, {
        type: "application/json",
      });

      const result = await this.sdk.storage().uploadFile({ file });
      return result.pin.cid;
    } catch (error: unknown) {
      throw new Error(`Failed to store metadata: ${error}`);
    }
  }
}

const createMetadataClient = (config: MetadataClientConfig) =>
  new MetadataClient(config);

export { createMetadataClient };
