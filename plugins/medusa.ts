import Medusa from "@medusajs/js-sdk";

// const config = useRuntimeConfig();

// console.log("dziala ale sie pruje", config.public.medusaUrl);

// export const medusaClient = new Medusa({
//   baseUrl: config.public.medusaUrl,
//   debug: true,
//   publishableKey: config.public.medusaUrl,
//   auth: {
//     type: "session",
//     jwtTokenStorageMethod: "session",
//   },
// });

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const medusaClient = new Medusa({
    baseUrl: config.public.medusaUrl,
    debug: true,
    publishableKey: config.public.medusaPublishableKey,
    auth: {
      type: "session",
      jwtTokenStorageMethod: "session",
    },
  });

  // Użyj nuxtApp.provide, aby udostępnić medusaClient w całej aplikacji
  nuxtApp.provide("medusaClient", medusaClient);
});
