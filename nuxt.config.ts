// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          href: "https://geowidget.inpost.pl/inpost-geowidget.css",
          rel: "stylesheet",
        },
      ],
      script: [
        {
          src: "https://geowidget.inpost.pl/inpost-geowidget.js",
          defer: true,
          async: true,
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      medusaUrl: process.env.NUXT_MEDUSA_URL,
      medusaPublishableKey: process.env.NUXT_MEDUSA_PUBLISHABLE_KEY,
      stripePublicKey: process.env.NUXT_PUBLIC_STRIPE_KEY,
      storeUrl: process.env.NUXT_STORE_URL,
    },
    nitro: {
      envExpansion: true,
    },
  },
  compatibilityDate: "2024-07-09",
  debug: false,
  imports: {
    dirs: ["stores"],
  },
  build: {
    transpile: ["vuetify"],
  },
  devtools: { enabled: true },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "@pinia/nuxt",
    "@vueuse/nuxt",
  ],
  plugins: ["~/plugins/medusa.ts", "~/plugins/stripe.ts"],
  css: ["~/assets/css/main.css", "@/assets/css/base.scss"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/css/colors.scss" as *;',
        },
      },
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});
