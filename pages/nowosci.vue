<script setup lang="ts">
useSeoMeta({
  title: "JBeauty - Nowości",
  ogTitle: "JBeauty - Nowości",
  description:
    "Nowości w JBeauty - Odkryj najnowsze produkty do stylizacji paznokci! Lakiery, bazy, topy, akcesoria i narzędzia stworzone dla salonów kosmetycznych i osób prywatnych. Sprawdź nasze świeże propozycje i bądź na bieżąco z trendami w manicure!",
  ogDescription:
    "Nowości w JBeauty - Odkryj najnowsze produkty do stylizacji paznokci! Lakiery, bazy, topy, akcesoria i narzędzia stworzone dla salonów kosmetycznych i osób prywatnych. Sprawdź nasze świeże propozycje i bądź na bieżąco z trendami w manicure!",
});

import { type StoreProduct } from "@medusajs/types";

const { width, height } = useWindowSize();

const products = ref<StoreProduct[]>([]);
const loading = ref<boolean>(false);

const { data: newProducts, error } = await useFetch(
  `/api/products/new?limit=40`,
  {
    server: true,
    immediate: true,
  }
);

products.value = newProducts.value;
</script>

<template>
  <v-sheet
    class="category-page-wrapper"
    :min-height="height * 0.8"
    :width="width * 0.9"
  >
    <h1>Nowości</h1>
    <div class="products-container">
      <div class="products-wrapper" v-if="!loading">
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
      <v-progress-circular indeterminate v-if="loading"></v-progress-circular>
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
