<script setup lang="ts">
import { type StoreProduct } from "@medusajs/types";

const route = useRoute();

const nuxtApp = useNuxtApp();

const medusaClient = nuxtApp.$medusaClient;

const config = useRuntimeConfig();

const { width, height } = useWindowSize();

const snackbarStore = useSnackbarStore();

console.log(route.params);

const fetchCategories = async () => {
  const { product_categories } = await medusaClient.store.category.list({
    handle: route.params.category as string,
    // include_descendants_tree: true,
  });

  console.log("categories", product_categories);

  if (product_categories.length > 0) {
    categoryName.value = product_categories[0].name;
    categoryIds.value = [
      product_categories[0].id,
      ...product_categories[0].category_children.map((child) => child.id),
    ];
  }
};

const queryOffset = ref<number>(0);
const currentPage = ref<number>(1);
const totalProducts = ref<number>(0);
const totalPages = ref<number>(1);
const products = ref<StoreProduct[]>([]);
const limit = ref<number>(20);
const categoryIds = ref<string[]>([]);
const categoryName = ref<string>("");

const fetchProducts = async () => {
  try {
    await fetchCategories();

    const result = await medusaClient.store.product.list({
      category_id: categoryIds.value,
      fields: "*variants.calculated_price,+variants.inventory_quantity",
      limit: limit.value,
      offset: queryOffset.value,
    });

    if (result) {
      products.value = result.products;
      totalProducts.value = result.count;
      totalPages.value = calculatePages(totalProducts.value);
    }
  } catch (e: any) {
    snackbarStore.showSnackbar(e.toString(), "error", 5000);
  }
};

const setPage = (page: number) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    queryOffset.value = (page - 1) * limit.value;
    fetchProducts();
  }
};

const calculatePages = (count: number): number => {
  return Math.ceil(count / limit.value);
};

onMounted(() => {
  fetchProducts();
});

watch(currentPage, (newPage) => {
  setPage(newPage);
});

// const { products, count, limit, offset } =
//   await medusaClient.store.product.list({
//     category_id: [product_categories[0].id],
//     fields: "*variants.calculated_price,+variants.inventory_quantity",
//     limit: 20,
//     offset: queryOffset.value,
//     // offset: 20, // apply offset based on current page
//     // include_category_children: true,
//   });

console.log("product on cateogory page: ", products);
</script>

<template>
  <v-sheet
    class="category-page-wrapper"
    :min-height="height * 0.8"
    :width="width * 0.9"
  >
    <h1>{{ categoryName }}</h1>
    <div class="products-container">
      <div class="products-wrapper">
        <v-card v-for="product in products" :key="product.id" width="340px">
          <NuxtLink :to="`/produkt/${product.handle}`">
            <v-img
              :src="product.thumbnail!.replace(
                    'http://localhost:9000',
                    config.public.medusaUrl
                  )"
              cover
              width="340"
              height="340"
            />
            <v-card-item>
              <v-card-title>{{ product.title }}</v-card-title>
              <v-card-subtitle
                >{{
                  new Intl.NumberFormat("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                  }).format(
                    product.variants?.[0].calculated_price?.original_amount!
                  )
                }}
                <b v-if="product.variants?.[0].inventory_quantity! < 1">
                  - Brak w magazynie</b
                ></v-card-subtitle
              >
            </v-card-item>
          </NuxtLink>
        </v-card>
      </div>
    </div>
    <div v-if="totalPages > 1" class="text-center">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="5"
        rounded
      ></v-pagination>
    </div>
  </v-sheet>
</template>

<style lang="scss" scoped>
.category-page-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  // height: 100%;
  width: 100%;
  .products-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    @media only screen and (max-width: 720px) {
      justify-content: start;
    }
    .products-wrapper {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      width: 100%;
      gap: 15px;
      max-width: 90%;

      & > * {
        width: 340px;
        margin-bottom: 0.5rem;
      }
    }
  }
}

h1 {
  font-size: 2rem;
  padding: 0 2rem;
  width: 100%;
  text-align: start;

  @media only screen and (max-width: 720px) {
    padding: 0;
  }
}
</style>
