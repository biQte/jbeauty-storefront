import { loadStripe } from "@stripe/stripe-js";

export default defineNuxtPlugin(async () => {
  const stripe = await loadStripe(String(process.env.NUXT_PUBLIC_STRIPE_KEY!));
  console.log(process.env.NUXT_PUBLIC_STRIPE_KEY);
  return {
    provide: {
      stripe,
    },
  };
});
