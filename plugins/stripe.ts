import { loadStripe } from "@stripe/stripe-js";

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();

  const stripe = await loadStripe(config.public.stripePublicKey);
  nuxtApp.provide("stripe", stripe);
});
