import identityJson from "../data/restaurant-identity.json";

export const identity = identityJson;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const phones = identity.seo.phone;
