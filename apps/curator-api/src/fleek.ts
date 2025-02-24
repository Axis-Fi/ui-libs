import * as dotenv from "dotenv";
import { FleekSdk, PersonalAccessTokenService } from "@fleek-platform/sdk/node";

dotenv.config();

const getCredentials = () => {
  if (!process.env.FLEEK_PAT || !process.env.FLEEK_PROJECT_ID) {
    throw new Error("Missing Fleek credentials in .env");
  }

  return {
    personalAccessToken: process.env.FLEEK_PAT!,
    projectId: process.env.FLEEK_PROJECT_ID!,
  };
};

const accessTokenService = new PersonalAccessTokenService(getCredentials());

export const fleekSdk = new FleekSdk({ accessTokenService });

export async function getCidForData(input: {
  data: string;
  key: string;
}): Promise<string> {
  const blob = new Blob([input.data], { type: "application/json" });
  const file = new File([blob], input.key ?? `unknown-${Date.now()}`, {
    type: "application/json",
  });

  const result = await fleekSdk.storage().uploadFile({ file });

  return result.pin.cid;
}

export async function unpin(cid: string) {
  console.log("Unpinning CID", cid);
  return fleekSdk.storage().delete({ cid });
}
