import { loadStripe } from "@stripe/stripe-js";

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig();
  const stripe = await loadStripe(config.public.stripePublicKey);
  console.log(config.public.stripePublicKey);
  return {
    provide: {
      stripe,
    },
  };
});
