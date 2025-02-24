import { type Hex, toHex } from "viem";

/** Converts a Date to a Unix timestamp (seconds) */
export const getTimestamp = (date: Date) => Math.floor(date.getTime() / 1000);

export const toKeycode = (keycode: string): Hex => {
  return toHex(keycode, { size: 5 });
};
