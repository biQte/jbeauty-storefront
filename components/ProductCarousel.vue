<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useWindowSize } from "@vueuse/core";
import { type StoreProduct } from "@medusajs/types";

const props = defineProps<{
  products: StoreProduct[] | null;
  loading: boolean;
}>();
const { width } = useWindowSize();

const config = useRuntimeConfig();

const chunkedProducts = computed(() => {
  const chunkSize =
    width.value >= 1600
      ? 4
      : width.value >= 1140
      ? 3
      : width.value >= 720
      ? 2
      : 1;
  return props.products ? chunkArray(props.products, chunkSize) : [];
});

function chunkArray(arr: any[], size: number) {
  return arr.length
    ? Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size)
      )
    : [];
}
</script>

<template>
  <v-carousel
    v-if="loading || chunkedProducts.length"
    hide-delimiter-background
    cycle
    show-arrows
    interval="5000"
  >
    <template v-if="loading">
      <v-carousel-item
        v-for="n in width >= 1600
          ? 4
          : width >= 1140
          ? 3
          : width >= 720
          ? 2
          : 1"
        :key="'skeleton-' + n"
      >
        <v-card width="340px">
          <v-skeleton-loader type="image" :width="340" :height="340" />
          <v-skeleton-loader type="heading" />
          <v-skeleton-loader type="text" />
        </v-card>
      </v-carousel-item>
    </template>

    <template v-else>
      <v-carousel-item
        v-for="(productChunk, index) in chunkedProducts"
        :key="index"
      >
        <div class="product-chunk">
          <v-card
            v-for="product in productChunk"
            :key="product.id"
            width="340px"
          >
            <NuxtLink :to="`/produkt/${product.handle}`">
              <v-img
                :src="
                  product.thumbnail!
                "
                cover
                width="340"
                height="340"
              />
              <v-card-item>
                <v-card-title>{{ product.title }}</v-card-title>
                <v-card-subtitle
                  ><span
                    :class="{strike: product.variants?.[0].calculated_price?.calculated_price
                          ?.price_list_type === 'sale' && product.variants?.[0].inventory_quantity! > 0 && product.variants?.[0].calculated_price?.original_amount !== product.variants?.[0].calculated_price.calculated_amount}"
                    >{{
                      new Intl.NumberFormat("pl-PL", {
                        style: "currency",
                        currency: "PLN",
                      }).format(
                        product.variants?.[0].calculated_price?.original_amount!
                      )
                    }}</span
                  >
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
      </v-carousel-item>
    </template>
  </v-carousel>
</template>

<style lang="scss" scoped>
.product-chunk {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}

.strike {
  text-decoration: line-through;
}

.sale-price {
  font-size: 1.2rem;
  color: $primary-color;
}
</style>

<script lang="ts">
// function formatPrice(product: StoreProduct) {
//   return new Intl.NumberFormat("pl-PL", {
//     style: "currency",
//     currency: "PLN",
//   }).format(product.variants?.[0].calculated_price?.original_amount!);
// }
</script>
