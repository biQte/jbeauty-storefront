<script setup lang="ts">
import { type StoreProduct } from "@medusajs/types";

const config = useRuntimeConfig();

const props = defineProps<{
  products: StoreProduct[];
}>();
</script>

<template>
  <v-carousel hide-delimiter-background cycle show-arrows interval="5000">
    <v-carousel-item v-for="product in products" :key="product.id">
      <NuxtLink :to="`/produkt/${product.handle}`">
        <v-card width="340px">
          <nuxt-img
            :src="product.thumbnail!"
            width="340"
            height="340"
            fit="cover"
            loading="lazy"
            format="webp"
          />
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
    </v-carousel-item>
  </v-carousel>
</template>

<style lang="scss" scoped></style>
