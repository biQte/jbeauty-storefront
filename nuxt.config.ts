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
      link: [
        {
          rel: "shortcut icon",
          href: "/favicon.ico",
          type: "image/x-icon",
        },
        {
          rel: "apple-touch-icon",
          href: "/apple-touch-icon.png",
        },
        {
          rel: "icon",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          href: "/favicon-16x16.png",
        },
        {
          rel: "manifest",
          href: "/site.webmanifest",
        },
      ],
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
      salesChannelID: process.env.NUXT_SALES_CHANNEL_ID,
      regionID: process.env.NUXT_REGION_ID,
    },
    nitro: {
      envExpansion: true,
    },
  },
  nitro: {
    compressPublicAssets: true,
    minify: true,
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
    "nuxt-gtag",
    "@nuxtjs/sitemap",
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
  gtag: {
    id: "G-CV9TZ8BS61",
  },

  site: {
    url: process.env.NUXT_STORE_URL,
  },

  sitemap: {
    // hostname: 'https://example.com', // Zmień na swoją domenę
    urls: async () => {
      // 1️⃣ Pobierz kategorie i produkty z Medusa, Strapi, itp.
      const { product_categories } = await fetch(
        `${process.env.NUXT_MEDUSA_URL}/store/product-categories`,
        {
          credentials: "include",
          headers: {
            "x-publishable-api-key": process.env.NUXT_MEDUSA_PUBLISHABLE_KEY!,
          },
        }
      ).then((res: any) => res.json());
      const { products } = await fetch(
        `${process.env.NUXT_MEDUSA_URL}/store/products?fields=id,handle`,
        {
          credentials: "include",
          headers: {
            "x-publishable-api-key": process.env.NUXT_MEDUSA_PUBLISHABLE_KEY!,
          },
        }
      ).then((res: any) => res.json());

      // 2️⃣ Generowanie ścieżek URL dla każdej kategorii i produktu
      const categoryUrls = product_categories.map((category: any) => ({
        loc: `/kategoria/${category.handle}`,
        changefreq: "weekly",
        priority: 0.8,
      }));

      const productUrls = products.map((product: any) => ({
        loc: `/produkt/${product.handle}`,
        changefreq: "daily",
        priority: 0.9,
      }));

      // 3️⃣ Zwrócenie pełnej listy linków do sitemapy
      return [
        { loc: "/", changefreq: "daily", priority: 1.0 },
        { loc: "/kontakt", changefreq: "monthly", priority: 0.7 },
        { loc: "/o-nas", changefreq: "monthly", priority: 0.7 },
        { loc: "/konto", changefreq: "monthly", priority: 0.7 },
        { loc: "/login", changefreq: "monthly", priority: 0.7 },
        { loc: "/rejestracja", changefreq: "monthly", priority: 0.7 },
        { loc: "/regulamin", changefreq: "monthly", priority: 0.7 },
        { loc: "/polityka-prywatnosci", changefreq: "monthly", priority: 0.7 },
        ...categoryUrls,
        ...productUrls,
      ];
    },
  },
});
