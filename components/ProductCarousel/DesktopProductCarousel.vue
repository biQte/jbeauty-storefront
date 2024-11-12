<script setup lang="ts">
import type { StoreProduct } from "@medusajs/types";

const props = defineProps<{
  products: StoreProduct[];
}>();

const chunkProducts = (products: StoreProduct[], chunkSize: number) => {
  const chunks = [];
  for (let i = 0; i < products.length; i += chunkSize) {
    chunks.push(products.slice(i, i + chunkSize));
  }

  return chunks;
};
</script>

<template>
  <v-carousel hide-delimiter-background cycle show-arrows interval="5000">
    <v-carousel-item
      v-for="(productGroup, index) in chunkProducts(products, 3)"
      :key="index"
    >
      <v-row>
        <v-col v-for="product in productGroup" :key="product.id" cols="4">
          <NuxtLink :to="`/produkt/${product.handle}`">
            <v-card width="340px">
              <v-img
                :src="product.thumbnail!"
                width="340"
                height="340"
                cover
              ></v-img>
              <v-card-item>
                <v-card-title>{{ product.title }}</v-card-title>
                <v-card-subtitle>{{
                  new Intl.NumberFormat("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                  }).format(
                    product.variants?.[0].calculated_price?.original_amount!
                  )
                }}</v-card-subtitle>
              </v-card-item>
            </v-card>
          </NuxtLink>
        </v-col>
      </v-row>
    </v-carousel-item>
  </v-carousel>
</template>

<style lang="scss" scoped></style>
