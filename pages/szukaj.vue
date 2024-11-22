<script setup lang="ts">
import { type StoreProduct } from "@medusajs/types";
import { useRoute } from "vue-router";

const route = useRoute();
const nuxtApp = useNuxtApp();
const medusaClient = nuxtApp.$medusaClient;
const config = useRuntimeConfig();

const { width, height } = useWindowSize();

const snackbarStore = useSnackbarStore();

const query = ref(route.query.q as string) || ""; // Pobieramy parametr wyszukiwania z URL

useSeoMeta({
  title: `JBeauty - Wyniki wyszukiwania: ${query.value}`,
  ogTitle: `JBeauty - Wyniki wyszukiwania: ${query.value}`,
});

const queryOffset = ref<number>(0);
const currentPage = ref<number>(1);
const totalProducts = ref<number>(0);
const totalPages = ref<number>(1);
const products = ref<StoreProduct[]>([]);
const limit = ref<number>(20);

const fetchProducts = async () => {
  try {
    const result = await medusaClient.store.product.list({
      q: query.value, // Filtrowanie produktów po tytule (search term)
      limit: limit.value,
      offset: queryOffset.value,
      fields: "*variants.calculated_price,+variants.inventory_quantity",
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

watch(
  () => route.query.q,
  (newQuery) => {
    queryOffset.value = 0; // Resetujemy offset przy zmianie zapytania
    currentPage.value = 1;
    query.value = newQuery as string;
    fetchProducts(); // Ponownie pobieramy produkty
  }
);

watch(currentPage, (newPage) => {
  setPage(newPage);
});
</script>

<template>
  <v-sheet
    class="search-page-wrapper"
    :min-height="height * 0.8"
    :width="width * 0.9"
  >
    <h1>Wyniki wyszukiwania: "{{ query }}"</h1>
    <div class="products-container">
      <div class="products-wrapper">
        <v-card v-for="product in products" :key="product.id" width="340px">
          <NuxtLink :to="`/produkt/${product.handle}`">
            <v-img :src="product.thumbnail!" cover width="340" height="340" />
            <v-card-item>
              <v-card-title>{{ product.title }}</v-card-title>
              <v-card-subtitle
                ><span
                  class="product-price"
                  :class="{
                      strike:
                        product.variants?.[0].calculated_price?.calculated_price
                          ?.price_list_type === 'sale' && product.variants?.[0].inventory_quantity! > 0,
                    }"
                >
                  {{
                    new Intl.NumberFormat("pl-PL", {
                      style: "currency",
                      currency: "PLN",
                    }).format(
                      product.variants?.[0].calculated_price?.original_amount!
                    )
                  }}
                </span>
                <span
                  v-if="
                      product.variants?.[0].calculated_price?.calculated_price
                        ?.price_list_type === 'sale' && product.variants?.[0].inventory_quantity! > 0
                    "
                  class="sale-price"
                >
                  &nbsp;{{
                    new Intl.NumberFormat("pl-PL", {
                      style: "currency",
                      currency: "PLN",
                    }).format(
                      Number(
                        product.variants?.[0].calculated_price
                          ?.calculated_amount
                      )
                    )
                  }}
                </span>
                <b v-if="product.variants?.[0].inventory_quantity! < 1">
                  - Chwilowo niedostępny</b
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
.search-page-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: 100%;
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

.strike {
  text-decoration: line-through;
}

.sale-price {
  font-size: 1.2rem;
  color: $primary-color;
}
</style>
