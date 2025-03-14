<script setup lang="ts">
import { type StoreProduct } from "@medusajs/types";
import { useRoute } from "vue-router";

const route = useRoute();
const nuxtApp = useNuxtApp();
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
const limit = ref<number>(40);
const allLoaded = ref<boolean>(false);
const loading = ref<boolean>(false);

const { data: searchProducts, error } = await useFetch(`/api/products`, {
  credentials: "include",
  query: {
    q: query.value,
    limit: limit.value,
    offset: queryOffset.value,
  },
  server: true,
  immediate: true,
});

// @ts-expect-error
products.value = searchProducts.value.products;

queryOffset.value += limit.value;
// @ts-expect-error
totalProducts.value = searchProducts.value.count;

if (products.value.length < limit.value) {
  allLoaded.value = true;
}

const fetchProducts = async () => {
  try {
    if (loading.value || allLoaded.value) return;

    loading.value = true;

    const result = await $fetch(`/api/products`, {
      credentials: "include",
      query: {
        q: query.value,
        limit: limit.value,
        offset: queryOffset.value,
      },
    });

    // @ts-expect-error
    if (result.products.length < limit.value) {
      allLoaded.value = true;
    }
    // @ts-expect-error
    products.value.push(...result.products);
    // @ts-expect-error
    totalProducts.value = result.count;

    queryOffset.value += limit.value;
    loading.value = false;
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

// @ts-expect-error
const loadMoreProducts = async ({ done }) => {
  if (!allLoaded.value) {
    await fetchProducts();
    done("ok");
  } else {
    done("empty");
  }
};

onMounted(() => {
  const { gtag } = useGtag();
  gtag("event", "view_item_list", {
    item_list_name: "Wyniki wyszukiwania: " + query,
    items: products.value.map((product) => ({
      item_id: product.id,
      item_name: product.title,
      price: product.variants?.[0].calculated_price?.calculated_price,
      quantity: 1,
    })),
  });
});
</script>

<template>
  <v-sheet
    class="category-page-wrapper"
    :min-height="height * 0.8"
    :width="width * 0.9"
  >
    <h1>Wyniki wyszukiwania: {{ query }}</h1>
    <div class="products-container">
      <v-infinite-scroll
        @load="loadMoreProducts"
        :disabled="allLoaded"
        mode="intersect"
        :width="100 + '%'"
        empty-text=""
        side="end"
      >
        <div class="products-wrapper">
          <v-card
            id="category-card"
            v-for="product in products"
            :key="product.id"
            width="340px"
          >
            <NuxtLink :to="`/produkt/${product.handle}`">
              <v-img :src="product.thumbnail!" cover width="340" height="340" />
              <v-card-item>
                <v-card-title
                  ><h2>
                    {{ product.title }}
                  </h2></v-card-title
                >
                <v-card-subtitle
                  ><span
                    class="product-price"
                    :class="{
                        strike:
                          product.variants?.[0].calculated_price?.calculated_price
                            ?.price_list_type === 'sale' && product.variants?.[0].inventory_quantity! > 0 && product.variants?.[0].calculated_price?.original_amount !== product.variants?.[0].calculated_price.calculated_amount,
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
                          ?.price_list_type === 'sale' && product.variants?.[0].inventory_quantity! > 0 && product.variants?.[0].calculated_price?.original_amount !== product.variants?.[0].calculated_price.calculated_amount
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
        <template v-slot:loading>Trwa ładowanie...</template>
      </v-infinite-scroll>
    </div>
  </v-sheet>
</template>

<style lang="scss" scoped>
.category-page-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
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
      align-self: center;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 340px));
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

h2 {
  font-size: 1rem !important;
}

.product-price {
  font-size: 1rem !important;
}

.strike {
  text-decoration: line-through;
}

.sale-price {
  font-size: 1.2rem;
  color: $primary-color;
}
</style>
