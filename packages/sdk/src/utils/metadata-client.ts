import {
  FleekSdk,
  ApplicationAccessTokenService,
} from "@fleek-platform/sdk/browser";

export type MetadataClientConfig = {
  fleekApplicationClientId: string;
};

export type SaveParams = {
  metadata: string;
  id?: string;
};

export class MetadataClient {
  private sdk: FleekSdk;

  constructor({ fleekApplicationClientId }: MetadataClientConfig) {
    if (!fleekApplicationClientId) {
      throw new Error("Fleek application client ID is required");
    }

    const applicationService = new ApplicationAccessTokenService({
      clientId: fleekApplicationClientId,
    });

    this.sdk = new FleekSdk({
      accessTokenService: applicationService,
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
