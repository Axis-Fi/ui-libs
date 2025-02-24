import * as dotenv from "dotenv";
import type { RapidTwitterApiResponse } from "./types";

dotenv.config();

if (process.env.TWITTER_RAPID_API_KEY == null) {
  throw Error("process.env.TWITTER_RAPID_API_KEY is not set");
}

if (process.env.TWITTER_ACCOUNT == null) {
  throw Error("process.env.TWITTER_ACCOUNT is not set");
}

const rapidTwitterApiKey = process.env.TWITTER_RAPID_API_KEY;
const twitterAccount = process.env.TWITTER_ACCOUNT;

const fetchAxisFollowing = async (): Promise<string[]> => {
  const url = `https://twttrapi.p.rapidapi.com/user-following?username=${twitterAccount}`;
  const headers = {
    "x-rapidapi-host": "twttrapi.p.rapidapi.com",
    "x-rapidapi-key": rapidTwitterApiKey,
  };

  const response = await fetch(url, { method: "GET", headers });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data: RapidTwitterApiResponse = await response.json();

  return (
    data?.data?.user?.timeline_response?.timeline?.instructions
      ?.find((i) => i.__typename === "TimelineAddEntries")
      ?.entries?.map((e) => e?.content?.content?.userResult?.result)
      ?.filter((user) => user?.rest_id)
      ?.map((user) => user.rest_id) || []
  );
};

let followingCache: string[];
let lastFetchTime = 0;

// cache axis followings for 24 hours
// (the free tier of the twitter rapid api is approx 50 requests per month)
const CACHE_TTL = 24 * 60 * 60 * 1000;

const getTwitterFollowing = async () => {
  try {
    // Use cached following if available and not expired
    const now = Date.now();

    if (followingCache && now - lastFetchTime < CACHE_TTL) {
      return followingCache;
    }

    followingCache = await fetchAxisFollowing();
    lastFetchTime = now;
    return followingCache;
  } catch (error: unknown) {
    console.error("Error getting Axis Twitter following:", error);
    return [];
  }
};

const bustCache = async (pwd: string) => {
  if (pwd !== process.env.FOLLOWING_CACHE_BUST_PWD) {
    console.log("wrong password");
    return "wrong password";
  }
  console.log("Busting cache", { lastFetchTime });
  lastFetchTime = 0;

  return "cache busted";
};

export { getTwitterFollowing, bustCache };
