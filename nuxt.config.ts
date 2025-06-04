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
  routeRules: {
    "/produkt/pb-nails-lakier-hybrydowy-ge383-bluetiful-10ml": {
      redirect: {
        to: "/kategoria/lakiery-hybrydowe",
        statusCode: 301,
      },
    },
    "/produkt/pb-nails-lakier-hybrydowy-max-white-5ml": {
      redirect: {
        to: "/kategoria/lakiery-hybrydowe",
        statusCode: 301,
      },
    },
    "/produkt/pb-nails-top-do-hybryd-i-zeli-fancy-top-coat-10ml": {
      redirect: {
        to: "/kategoria/bazy-i-topy",
        statusCode: 301,
      },
    },
    "/produkt/excellent-pro-blok-polerski-czterostronny-premium-biay": {
      redirect: {
        to: "/kategoria/narzedzia",
        statusCode: 301,
      },
    },
    "/produkt/excellent-pro-mini-buffer-100150-50szt": {
      redirect: {
        to: "/kategoria/narzedzia",
        statusCode: 301,
      },
    },
    "/produkt/excellent-pro-builder-gel-with-thixotropy-natural-look-rose-30g":
      {
        redirect: {
          to: "/kategoria/zele-budujace",
          statusCode: 301,
        },
      },
    "/produkt/victoria-vynn-brillant-gel-16-rose-quartz-5g": {
      redirect: {
        to: "/kategoria/zele-kolorowe",
        statusCode: 301,
      },
    },
    "/produkt/victoria-vynn-brillant-gel-17-eternal-pink-5g": {
      redirect: {
        to: "/kategoria/zele-kolorowe",
        statusCode: 301,
      },
    },
    "/produkt/victoria-vynn-brillant-gel-25-quartz-crystal-5g": {
      redirect: {
        to: "/kategoria/zele-kolorowe",
        statusCode: 301,
      },
    },
    "/produkt/victoria-vynn-brillant-gel-53-triffle-5g": {
      redirect: {
        to: "/kategoria/zele-kolorowe",
        statusCode: 301,
      },
    },
    "/produkt/victoria-vynn-brillant-gel-26-calcite-8ml": {
      redirect: {
        to: "/kategoria/zele-kolorowe",
        statusCode: 301,
      },
    },
    "/produkt/victoria-vynn-brillant-gel-37-heliodor-5g": {
      redirect: {
        to: "/kategoria/zele-kolorowe",
        statusCode: 301,
      },
    },
    "/produkt/pb-nails-limitowany-lakier-hybrydowy-drop-10-golden-hour-5ml": {
      redirect: {
        to: "/kategoria/lakiery-hybrydowe",
        statusCode: 301,
      },
    },
    "/produkt/pb-nails-lakier-hybrydowy-ge343-elf-5ml": {
      redirect: {
        to: "/kategoria/lakiery-hybrydowe",
        statusCode: 301,
      },
    },
    "/kody-rabatowe": {
      redirect: {
        to: "/",
        statusCode: 301,
      },
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
      recommendedByCategoryID: process.env.NUXT_RECOMMENDED_BY_CATEGORY_ID,
      metapixel: {
        default: {
          id: "536919092577032",
          pageView: "/",
        },
      },
    },
    nitro: {
      envExpansion: true,
    },
  },
  nitro: {
    compressPublicAssets: true,
    minify: true,
    routeRules: {
      "/api/**": { cors: true },
    },
    prerender: {
      routes: [
        "/",
        "/regulamin",
        "/kontakt",
        "/login",
        "/rejestracja",
        "/polityka-prywatnosci",
        "/nie-pamietam-hasla",
        "/konto",
        "/resetowanie-hasla",
        "/wyprzedaz",
        "/nowosci",
        "/blog",
        "/blog/manicure-dla-poczatkujacych-co-jest-niezbedne-na-start",
        "/blog/manicure-hybrydowy-krok-po-kroku",
        "/blog/tiksotropia-w-zelach-do-stylizacji-paznokci",
        "/blog/zzadbane-dlonie-jak-skutecznie-pielegnowac-skorki-wokol-paznokci"
      ],
    },
    // baseURL: process.env.NUXT_STORE_URL,
  },
  compatibilityDate: "2024-07-09",
  // debug: true,
  // components: true,
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
    "@nuxtjs/sitemap",
    "@nuxtjs/robots",
    // "nuxt-seo-utils",
    // "nuxt-og-image",
    // "nuxt-schema-org",npm i nuxt-link-checker
    "nuxt-link-checker",
    "nuxt-site-config",
    "@nuxt/content",
    "@nuxt/image",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "nuxt-delay-hydration",
    "nuxt-anchorscroll",
    "nuxt-gtag",
    "@zadigetvoltaire/nuxt-gtm",
    "nuxt-meta-pixel",
  ],
  delayHydration: {
    debug: false,
    mode: "init",
  },

  site: {
    enabled: true,
    url: process.env.NUXT_STORE_URL,
    name: "JBeauty",
  },

  linkChecker: {
    report: {
      html: true,
      markdown: true,
      publish: true,
    },
  },

  gtm: {
    id: "GTM-T5WDWSX3"
  },

  image: {
    provider: "ipx",
    domains: ["api.jbeautysklep.pl", "https://api.jbeautysklep.pl"],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },

  // seo: {
  //   enabled: true,
  // },

  plugins: [
    "~/plugins/stripe.client.ts",
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
  // image: {
  //   // quality: 80,
  //   provider: "ipx",
  //   quality: 80,
  //   format: ["webp"],
  //   domains: [
  //     "www.jbeautysklep.pl",
  //     "jbeautysklep.pl",
  //     "api.jbeautysklep.pl",
  //     "localhost",
  //   ],
  // },
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
    // build: {
    //   rollupOptions: {
    //     output: {
    //       manualChunks(id) {
    //         if (id.includes("node_modules")) {
    //           // dziel paczki zależności
    //           if (id.includes("vue")) return "vue";
    //           if (id.includes("lodash")) return "lodash";
    //           if (id.includes("@headlessui")) return "headlessui";
    //           return "vendor";
    //         }
    //       },
    //     },
    //   },
    // },
  },
  gtag: {
    id:
      process.env.NUXT_NODE_ENV !== "development" ? "G-CV9TZ8BS61" : undefined,
  },

  // site: {
  //   url: process.env.NUXT_STORE_URL,
  // },

  sitemap: {
    discoverImages: true,
    enabled: true,
    // hostname: 'https://example.com', // Zmień na swoją domenę
    urls: async () => {
      // 1️⃣ Pobierz kategorie i produkty z Medusa, Strapi, itp.

      let categoryUrls: any[] = [];
      let productUrls: any[] = [];

      let hasMoreCategories = true;
      let categoryOffset = 0;
      const categoryLimit = 50;

      while (hasMoreCategories) {
        console.log(`📦 Pobieranie kategorii: offset = ${categoryOffset}`);

        const response = await fetch(
          `${process.env.NUXT_MEDUSA_URL}/store/product-categories?limit=${categoryLimit}&offset=${categoryOffset}`,
          {
            credentials: "include",
            headers: {
              "x-publishable-api-key": process.env.NUXT_MEDUSA_PUBLISHABLE_KEY!,
            },
          }
        ).then((res) => res.json());

        const categories = response.product_categories || [];
        categoryUrls.push(
          ...categories.map((category: any) => ({
            loc: `/kategoria/${category.handle}`,
            changefreq: "weekly",
            priority: 0.8,
          }))
        );

        // Jeśli zwrócono mniej rekordów niż `categoryLimit`, to znaczy, że to ostatnia strona
        if (categories.length < categoryLimit) {
          hasMoreCategories = false;
        } else {
          categoryOffset += categoryLimit;
        }
      }

      let hasMoreProducts = true;
      let productOffset = 0;
      const productLimit = 50;

      while (hasMoreProducts) {
        console.log(`🛒 Pobieranie produktów: offset = ${productOffset}`);

        const response = await fetch(
          `${process.env.NUXT_MEDUSA_URL}/store/products?limit=${productLimit}&offset=${productOffset}&fields=id,handle`,
          {
            credentials: "include",
            headers: {
              "x-publishable-api-key": process.env.NUXT_MEDUSA_PUBLISHABLE_KEY!,
            },
          }
        ).then((res) => res.json());

        const products = response.products || [];
        productUrls.push(
          ...products.map((product: any) => ({
            loc: `/produkt/${product.handle}`,
            changefreq: "daily",
            priority: 0.9,
          }))
        );

        // Jeśli zwrócono mniej rekordów niż `productLimit`, to znaczy, że to ostatnia strona
        if (products.length < productLimit) {
          hasMoreProducts = false;
        } else {
          productOffset += productLimit;
        }
      }

      console.log(
        `✅ Załadowano ${categoryUrls.length} kategorii i ${productUrls.length} produktów!`
      );

      // 3️⃣ Zwrócenie pełnej listy linków do sitemapy
      return [
        { loc: "/", changefreq: "daily", priority: 1.0 },
        { loc: "/kontakt", changefreq: "monthly", priority: 0.7 },
        { loc: "/konto", changefreq: "monthly", priority: 0.7 },
        { loc: "/login", changefreq: "monthly", priority: 0.7 },
        { loc: "/rejestracja", changefreq: "monthly", priority: 0.7 },
        { loc: "/regulamin", changefreq: "monthly", priority: 0.7 },
        { loc: "/polityka-prywatnosci", changefreq: "monthly", priority: 0.7 },
        ...categoryUrls,
        ...productUrls,
      ];
    },
    exclude: ["/content/*"],
  },
  robots: {
    enabled: true,
    robotsTxt: true,
    metaTag: true,
    sitemap: `${process.env.NUXT_STORE_URL}/sitemap.xml`,
    // disableNuxtContentIntegration: true,
    // disallow: "https://www.*",
    disallow: ["https://jbeautysklep.pl/szukaj*"],
  },
});
