// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  ssr: true,
  app: {
    head: {
      meta: [
        {
          "http-equiv": "Content-Security-Policy",
          content: `default-src * data: mediastream: blob: filesystem: about: ws: wss: 'unsafe-eval' 'wasm-unsafe-eval' 'unsafe-inline'; 
script-src * data: blob: 'unsafe-inline' 'unsafe-eval'; 
script-src-elem * data: blob: 'unsafe-inline' 'unsafe-eval';
connect-src * data: blob: 'unsafe-inline'; 
img-src * data: blob: 'unsafe-inline'; 
media-src * data: blob: 'unsafe-inline'; 
frame-src * data: blob: ; 
style-src * data: blob: 'unsafe-inline';
font-src * data: blob: 'unsafe-inline';
frame-ancestors * data: blob:;
          `,
        },
      ],
      // link: [
      //   {
      //     href: "https://geowidget.inpost.pl/inpost-geowidget.css",
      //     rel: "stylesheet",
      //   },
      // ],
      title: "JBeauty",
    },
  },
  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },
  runtimeConfig: {
    public: {
      medusaUrl: process.env.NUXT_MEDUSA_URL,
      medusaPublishableKey:
        String(process.env.NUXT_MEDUSA_PUBLISHABLE_KEY) || undefined,
      stripePublicKey: process.env.NUXT_PUBLIC_STRIPE_KEY,
      storeUrl: process.env.NUXT_STORE_URL,
      productsCategoryID: process.env.NUXT_PRODUCTS_CATEGORY_ID,
      brandsCategoryID: process.env.NUXT_BRANDS_CATEGORY_ID,
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
    "nuxt-delay-hydration",
    "nuxt-anchorscroll",
  ],
  delayHydration: {
    debug: true,
    mode: "init",
  },
  plugins: [
    "~/plugins/medusa.ts",
    // "~/plugins/inpostGeowidget.ts",
    // "~/plugins/stripe.ts"
  ],
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
        compilerOptions: {
          isCustomElement: (tag) => ["inpost-geowidget"].includes(tag),
        },
      },
    },
  },
});
