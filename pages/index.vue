<script setup lang="ts">
// useHead({
//   title: "JBeauty - Z pasji do paznokci",
//   // meta: [
//   //   {
//   //     name: "description",
//   //     content:
//   //       "JBeauty - Twój sklep z produktami do stylizacji paznokci. Oferujemy lakiery hybrydowe, bazy, topy, akcesoria, narzędzia i wszystko, czego potrzebujesz do pięknego manicure. Sprawdź nasze produkty i zadbaj o swoje paznokcie jak profesjonalistka!",
//   //   },
//   // ],
// });

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
const loading = ref<boolean>(true);

const bestsellingProducts = ref();
const recommendedProducts = ref();
const nuxtApp = useNuxtApp();
const medusaClient = nuxtApp.$medusaClient;

const { width, height } = useWindowSize();

onMounted(async () => {
  loading.value = true;
  bestsellingProducts.value = await loadBestsellingProducts();
  recommendedProducts.value = await loadRecommendedProducts();
  console.log(bestsellingProducts.value);

  loading.value = false;
});

const loadBestsellingProducts = async () => {
  const { products } = await medusaClient.store.product.list({
    fields: "*variants.calculated_price,+variants.inventory_quantity",
    limit: 12,
    order: "-created_at",
    // q: "sweat",
    // fields: "*",
  });
  console.log([products]);

  return products;
};

const loadRecommendedProducts = async () => {
  const { product_categories } = await medusaClient.store.category.list({
    handle: "polecane",
  });

  const { products } = await medusaClient.store.product.list({
    fields: "*variants.calculated_price,+variants.inventory_quantity",
    limit: 12,
    category_id: product_categories[0].id,
  });

  return products;
};
</script>

<template>
  <div class="index-wrapper">
    <TheMainPageCarousel />
    <div class="bestsellers-wrapper">
      <h2>Nowości</h2>
      <!-- <div class="products-wrapper">
        <div
          class="product-wrapper"
          v-for="product in bestsellingProducts"
          :key="product.id"
          v-if="bestsellingProducts"
        >
          <NuxtLink :to="`/produkt/${product.handle}`">
            <v-card
              :diabled="loading"
              :loading="loading"
              min-width="340"
              max-width="340"
            >
              <template v-slot:loader="{ isActive }">
                <v-progress-linear :active="isActive" indeterminate>
                </v-progress-linear>
              </template>
              <v-img :src="product.thumbnail" cover></v-img>
              <v-card-item>
                <v-card-title>
                  {{ product.title }}
                </v-card-title>
                <v-card-subtitle>
                  <span
                    >{{
                      product.variants[0].calculated_price.original_amount
                    }}
                    Zł</span
                  >
                </v-card-subtitle>
              </v-card-item>
            </v-card>
          </NuxtLink>
        </div>
      </div> -->
      <v-lazy>
        <ProductCarousel :products="bestsellingProducts" :loading="loading" />
      </v-lazy>
    </div>
    <TheHomePageBanner />
    <TheHomePageLowerBanner />
    <br />
    <div class="recommended-products bestsellers-wrapper">
      <h2>Polecane</h2>
      <v-lazy>
        <ProductCarousel :products="recommendedProducts" :loading="loading" />
      </v-lazy>
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
