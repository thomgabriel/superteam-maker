export * from "./types";
export * from "./editorial";

import { AI_IDEAS } from "./ai";
import { CONSUMPTION_IDEAS } from "./consumption";
import { DEFI_IDEAS } from "./defi";
import { DEPIN_IDEAS } from "./depin";
import { GAMING_IDEAS } from "./gaming";
import { GOVERNANCE_IDEAS } from "./governance";
import { INFRA_IDEAS } from "./infra";
import { PAYMENTS_IDEAS } from "./payments";

export const CURATED_IDEAS = [
  ...PAYMENTS_IDEAS,
  ...CONSUMPTION_IDEAS,
  ...DEFI_IDEAS,
  ...DEPIN_IDEAS,
  ...AI_IDEAS,
  ...INFRA_IDEAS,
  ...GAMING_IDEAS,
  ...GOVERNANCE_IDEAS,
];
