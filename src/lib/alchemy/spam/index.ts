// The Alchemy hooks in the codebase automatically filter out these spam tokens

import { Network } from "../config";
import { INITIAL_SPAM_TOKENS } from "./initial-spam-tokens";
import { ADDITIONAL_SPAM_TOKENS } from "./additional-spam-tokens";

export const isSpamToken = (network: Network, address?: string | null) => {
  if (!address) return false;
  return INITIAL_SPAM_TOKENS[network]?.[address.toLowerCase()] 
    || ADDITIONAL_SPAM_TOKENS[network]?.[address.toLowerCase()];
};