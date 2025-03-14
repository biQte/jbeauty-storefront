<script setup lang="ts">
import type { StoreProduct } from "@medusajs/types";

const nuxtApp = useNuxtApp();
const router = useRouter();

const config = useRuntimeConfig();

const emit = defineEmits(["closeDialog"]);

const snackarStore = useSnackbarStore();

const loading = ref(false);
const search = ref<string>("");
const results = ref<StoreProduct[]>([]);
const showMenu = ref(false);

watch(search, async (newSearch) => {
  if (!newSearch || newSearch.trim().length < 2) {
    showMenu.value = false;
    return;
  }

  try {
    loading.value = true;

    // @ts-expect-error
    const { products } = await $fetch("/api/products", {
      credentials: "include",
      query: {
        limit: 5,
        q: newSearch,
      },
    });

    results.value = products;
    showMenu.value = true;
  } catch (e) {
    snackarStore.showSnackbar("Wystąpił nieoczekiwany błąd", "error", 5000);
  } finally {
    loading.value = false;
  }
});

const navigateToSearchPage = () => {
  if (search.value) {
    const searching = search.value;
    search.value = "";
    results.value = [];
    emit("closeDialog");
    router.push(`/szukaj?q=${searching}`);
  }
};
</script>

<template>
  <div class="the-searchbar-wrapper">
    <v-menu v-model="showMenu" :close-on-content-click="true" offset-y>
      <template v-slot:activator="{ isActive, props }">
        <v-text-field
          v-bind="props"
          :loading="loading"
          label="Szukaj"
          variant="outlined"
          :active="false"
          append-inner-icon="mdi-magnify"
          density="compact"
          placeholder="Lakier, żel, baza..."
          hide-details
          single-line
          clearable
          rounded
          v-model="search"
        ></v-text-field>
      </template>
      <v-list>
        <v-list-item
          v-for="(product, index) in results"
          :key="index"
          @click="
            () => {
              search = '';
              results = [];
              emit('closeDialog');
              router.push(`/produkt/${product.handle}`);
            }
          "
        >
          <div class="product-result-content">
            <v-img
              :src="product.thumbnail!"
              width="50"
              height="50"
              cover
            ></v-img>
            <div class="titles-content">
              <v-list-item-title>{{ product.title }}</v-list-item-title>
              <v-list-item-subtitle>
                <span
                  :class="{strike:
                        product.variants?.[0].calculated_price?.calculated_price
                          ?.price_list_type === 'sale' && product.variants?.[0].inventory_quantity! > 0 && product.variants?.[0].calculated_price?.original_amount !== product.variants?.[0].calculated_price.calculated_amount}"
                >
                  {{
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
              </v-list-item-subtitle>
            </div>
          </div>
        </v-list-item>
        <v-list-item v-if="results.length === 0 && search.length < 2">
          <v-list-item-title>Zacznij pisać aby szukać</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="results.length === 0 && search.length > 2">
          <v-list-item-title>Brak wyników</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="results.length > 0" @click="navigateToSearchPage">
          <v-list-item-title>Zobacz więcej wyników</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<style lang="scss" scoped>
.the-searchbar-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-result-content {
  display: flex;
  gap: 1rem;
  align-items: center;

  .titles-content {
    display: flex;
    flex-direction: column;
    width: calc(100% - 50px - 1rem);
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
