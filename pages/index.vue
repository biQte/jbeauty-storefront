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
    immediate: true,
  }
);

bestsellingProducts.value = newProducts.value;

// return products.value;
// };

// const loadRecommendedProducts = async () => {
const { data: recommendedProductsQuery, error: recommendedProductsError } =
  await useFetch(`/api/products/recommended`, {
    server: true,
    immediate: true,
  });

recommendedProducts.value = recommendedProductsQuery.value;

// return products.value;
// };
</script>

<template>
  <div class="index-wrapper">
    <TheMainPageCarousel />
    <div class="bestsellers-wrapper">
      <h2>Nowości</h2>
      <v-lazy>
        <ProductCarousel :products="bestsellingProducts" :loading="loading" />
      </v-lazy>
    </div>
    <TheHomePageBanner />
    <TheHomePageLowerBanner />
    <br />
    <div class="recommended-products bestsellers-wrapper">
      <h2>Polecane</h2>
      <ProductCarousel :products="recommendedProducts" :loading="loading" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.index-wrapper {
  .bestsellers-wrapper {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-top: 2rem;

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
