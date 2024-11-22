import Medusa from "@medusajs/js-sdk";

// const config = useRuntimeConfig();

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
    baseUrl: String(config.public.medusaUrl),
    debug: true,
    publishableKey: String(config.public.medusaPublishableKey),
    auth: {
      type: "session",
      jwtTokenStorageMethod: "session",
    },
  });

  // Użyj nuxtApp.provide, aby udostępnić medusaClient w całej aplikacji
  nuxtApp.provide("medusaClient", medusaClient);
});
