<script setup lang="ts">
useSeoMeta({
  title: "JBeauty - Z pasji do paznokci",
  ogTitle: "JBeauty - Z pasji do paznokci",
  description:
    "JBeauty - Twój sklep z produktami do stylizacji paznokci. Oferujemy lakiery hybrydowe, bazy, topy, akcesoria, narzędzia i wszystko, czego potrzebujesz do pięknego manicure. Sprawdź nasze produkty i zadbaj o swoje paznokcie jak profesjonalistka!",
  ogDescription:
    "JBeauty - Twój sklep z produktami do stylizacji paznokci. Oferujemy lakiery hybrydowe, bazy, topy, akcesoria, narzędzia i wszystko, czego potrzebujesz do pięknego manicure. Sprawdź nasze produkty i zadbaj o swoje paznokcie jak profesjonalistka!",
});

definePageMeta({
  isAccessibleAfterLogin: true,
});
const loading = ref<boolean>(false);

const bestsellingProducts = ref();
const recommendedProducts = ref();
const recentlyViewedProducts = ref();
const nuxtApp = useNuxtApp();
const width = ref();

const { recentlyViewed } = useRecentlyViewed();

const recentlyViewedFiltered = recentlyViewed.value.slice(0, 12);

const results = await Promise.allSettled([
  useFetch(`/api/products/new`, { server: true, credentials: "include" }),
  useFetch(`/api/products/recommended`, {
    server: true,
    credentials: "include",
  }),
  useFetch(`/api/products/by-ids`, {
    server: true,
    credentials: "include",
    query: { productIds: recentlyViewedFiltered },
  }),
]);

if (results[0].status === "fulfilled") {
  bestsellingProducts.value = results[0].value.data.value;
}
if (results[1].status === "fulfilled") {
  recommendedProducts.value = results[1].value.data.value;
}
if (results[2].status === "fulfilled") {
  recentlyViewedProducts.value = results[2].value.data.value;
}

const config = useRuntimeConfig();
const route = useRoute();

useHead({
  link: [
    {
      rel: "canonical",
      href: `${config.public.storeUrl}${route.path}`,
    },
  ],
});

onMounted(() => {
  width.value = useWindowSize().width;
});

const carouselHeight = computed(() => Math.round(width.value * (3 / 10)));
</script>

<template>
  <div class="index-wrapper">
    <div class="carousel-placeholder">
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
        <TheHomePageLowerBanner />
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
    width: 100vw;
    // min-height: 600px;

    height: calc(100vw * (3 / 10));

    // @media only screen and (max-width: 1400px) {
    //   min-height: 300px;
    // }

    // @media only screen and (max-width: 720px) {
    //   min-height: 100px;
    // }
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
