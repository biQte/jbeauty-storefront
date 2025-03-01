<script setup lang="ts">
useSeoMeta({
  title: "JBeauty - Z pasji do paznokci",
  ogTitle: "JBeauty - Z pasji do paznokci",
  description:
    "JBeauty - Twój sklep z produktami do stylizacji paznokci. Oferujemy lakiery hybrydowe, bazy, topy, akcesoria, narzędzia i wszystko, czego potrzebujesz do pięknego manicure. Sprawdź nasze produkty i zadbaj o swoje paznokcie jak profesjonalistka!",
  ogDescription:
    "JBeauty - Twój sklep z produktami do stylizacji paznokci. Oferujemy lakiery hybrydowe, bazy, topy, akcesoria, narzędzia i wszystko, czego potrzebujesz do pięknego manicure. Sprawdź nasze produkty i zadbaj o swoje paznokcie jak profesjonalistka!",
  // ogImage: ""
});

useHead({
  link: [
    {
      as: "image",
      rel: "preload",
      href: "/_nuxt/public/web.webp",
    },
  ],
});

definePageMeta({
  isAccessibleAfterLogin: true,
});
const loading = ref<boolean>(false);

const bestsellingProducts = ref();
const recommendedProducts = ref();
const nuxtApp = useNuxtApp();
const medusaClient = nuxtApp.$medusaClient;

const { width, height } = useWindowSize();

// onMounted(async () => {
//   loading.value = true;
//   bestsellingProducts.value = await loadBestsellingProducts();
//   recommendedProducts.value = await loadRecommendedProducts();

//   loading.value = false;
// });

// const loadBestsellingProducts = async () => {
const { data: newProducts, error: newProductsError } = await useFetch(
  `/api/products/new`,
  {
    server: true,
  }
);

bestsellingProducts.value = newProducts.value;

// return products.value;
// };

// const loadRecommendedProducts = async () => {
const { data: recommendedProductsQuery, error: recommendedProductsError } =
  await useFetch(`/api/products/recommended`, {
    server: true,
  });

recommendedProducts.value = recommendedProductsQuery.value;

const { recentlyViewed } = useRecentlyViewed();

const recentlyViewedFiltered = recentlyViewed.value.slice(0, 12);

const { data: recentlyViewedProducts, error: recentlyViewedProductsError } =
  await useFetch(`/api/products/by-ids`, {
    server: true,
    query: {
      productIds: recentlyViewedFiltered,
    },
  });

// return products.value;
// };
const carouselHeight = computed(() => Math.round(width.value * (3 / 10)));
</script>

<template>
  <div class="index-wrapper">
    <div
      class="carousel-placeholder"
      :style="{ minHeight: carouselHeight + 'px' }"
    >
      <TheMainPageCarousel />
    </div>
    <div class="bestsellers-wrapper">
      <h2>Nowości</h2>
      <!--<v-lazy>-->
      <Suspense>
        <template #default>
          <ProductCarousel :products="bestsellingProducts" :loading="loading" />
        </template>
        <template #fallback>
          <ProductCarouselSkeletonLoader />
        </template>
      </Suspense>
      <!--</v-lazy>-->
    </div>
    <TheHomePageBanner />
    <Suspense>
      <template #default>
        <LazyTheHomePageLowerBanner />
      </template>
      <template #fallback> Ładowanie... </template>
    </Suspense>
    <br />
    <div class="recommended-products bestsellers-wrapper">
      <h2>Polecane</h2>
      <Suspense>
        <template #default>
          <LazyProductCarousel
            :products="recommendedProducts"
            :loading="loading"
          />
        </template>
        <template #fallback> <ProductCarouselSkeletonLoader /> </template>
      </Suspense>
    </div>
    <br />
    <div class="recently-viewed-wrapper">
      <h2>Ostatnio przeglądane:</h2>
      <Suspense>
        <template #default>
          <!-- @vue-expect-error -->
          <LazyProductCarousel
            :products="recentlyViewedProducts.products"
            :loading="false"
            v-if="recentlyViewedProducts"
          />
          <p v-else>
            Zacznij przeglądać produkty aby zaczęły się tutaj pojawiać
          </p>
        </template>
        <template #fallback>
          <ProductCarouselSkeletonLoader />
        </template>
      </Suspense>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.index-wrapper {
  .carousel-placeholder {
    width: 100%;
    min-height: 400px;

    @media only screen and (max-width: 720px) {
      min-height: 100px;
    }
  }
  .bestsellers-wrapper,
  .recently-viewed-wrapper {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-top: 2rem;
    min-height: 500px;

    p {
      margin-left: 15%;
      font-size: 1.2rem;
      font-weight: 400;
    }

    .products-wrapper {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 2rem;
    }
  }
}
h2 {
  margin-left: 10%;
  font-size: 2rem;
}
</style>
