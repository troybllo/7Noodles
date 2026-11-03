import "server-only";
import Stripe from "stripe";
import { stripeEnv } from "./env";

let client: Stripe | undefined;

/** The Stripe API client, created on first use with the restaurant's secret key. */
export function stripe(): Stripe {
  client ??= new Stripe(stripeEnv().secretKey, {
    appInfo: { name: "Seven Noodles online ordering" },
  });
  return client;
}
