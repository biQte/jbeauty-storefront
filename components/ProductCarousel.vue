<script setup lang="ts">
import { ref, computed } from "vue";
import { useWindowSize } from "@vueuse/core";
import { type StoreProduct } from "@medusajs/types";
import { ROUTES } from "../constants/routes";

const props = defineProps<{
  products: StoreProduct[] | null;
  loading: boolean;
}>();

const cartStore = useCartStore();
const snackbarStore = useSnackbarStore();
const sessionStore = useSessionStore();
const router = useRouter();
const { width } = useWindowSize();
const isPaused = ref(false); // Flaga do kontrolowania pauzy karuzeli
const showDialog = ref<boolean>(false);

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

const addToCart = async (product: StoreProduct) => {
  try {
    const variantId = product!.variants![0].id;

    if (cartStore.cartObject === null || cartStore.cartObject === undefined) {
      await cartStore.createCart(undefined);
    }

    if (
      cartStore.cartObject?.items?.find((item) => item.variant_id === variantId)
    ) {
      const item = cartStore.cartObject?.items?.find(
        (item) => item.variant_id === variantId
      );

      await cartStore.updateLineItem(item!.id, item!.quantity++);
    } else {
      await cartStore.addLineItem(variantId, 1);
      if (sessionStore.session && !cartStore.cartObject?.email) {
        await cartStore.updateCart(
          sessionStore.session.email,
          undefined,
          undefined,
          undefined,
          undefined
        );
      }
    }

    showDialog.value = true;
  } catch (e) {
    const { message, color, timeout } = handleFetchError(e);
    if (message !== "") snackbarStore.showSnackbar(message, color, timeout);
  }
};
</script>

<template>
  <v-carousel
    v-if="loading || chunkedProducts.length"
    hide-delimiter-background
    hide-delimiters
    show-arrows
    interval="5000"
    :cycle="!isPaused"
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
            v-for="(product, productIndex) in productChunk"
            :key="product.id"
            class="product-card"
            width="340px"
            @mouseenter="isPaused = true"
            @mouseleave="isPaused = false"
          >
            <NuxtLink :to="`/produkt/${product.handle}`">
              <NuxtImg
                :src="product.thumbnail!"
                :loading="index === 0 && productIndex === 0 ? 'eager' : 'lazy'"
                :importance="
                  index === 0 && productIndex === 0 ? 'high' : 'auto'
                "
                cover
                width="340"
                height="340"
              />
              <v-card-item>
                <v-card-title
                  ><h2>{{ product.title }}</h2></v-card-title
                >
                <v-card-subtitle>
                  <span
                    class="product-price"
                    :class="{
                      strike:
                        product.variants?.[0].calculated_price?.calculated_price?.price_list_type === 'sale' &&
                        product.variants?.[0].inventory_quantity! > 0 &&
                        product.variants?.[0].calculated_price?.original_amount !==
                          product.variants?.[0].calculated_price.calculated_amount,
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
                      product.variants?.[0].calculated_price?.calculated_price?.price_list_type === 'sale' &&
                      product.variants?.[0].inventory_quantity! > 0 &&
                      product.variants?.[0].calculated_price?.original_amount !==
                        product.variants?.[0].calculated_price.calculated_amount
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
                  >
                </v-card-subtitle>
              </v-card-item>
            </NuxtLink>

            <!-- PRZYCISK SZYBKIEGO DODAWANIA DO KOSZYKA (ZAWSZE WIDOCZNY) -->
            <v-btn
              class="quick-add-btn"
              icon
              size="small"
              type="text"
              v-if="product.variants?.[0].inventory_quantity! >= 1"
              @click.stop="addToCart(product)"
            >
              <v-icon color="primary">mdi-cart</v-icon>
            </v-btn>

            <v-dialog
              v-model="showDialog"
              width="auto"
              persistent
              transition="dialog-top-transition"
            >
              <v-card
                max-width="500"
                prepend-icon="mdi-cart-outline"
                :text="product?.title"
                title="Dodano do koszyka"
              >
                <template v-slot:actions>
                  <div class="added-to-cart-modal-actions">
                    <v-btn @click="showDialog = false" color="success"
                      >Kontynuuj zakupy</v-btn
                    >
                    <v-btn @click="router.push(ROUTES.CART_PAGE)"
                      >Przejdź do koszyka</v-btn
                    >
                  </div>
                </template>
              </v-card>
            </v-dialog>
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

.product-card {
  position: relative;
  overflow: hidden;
}

/* Przycisk dodawania do koszyka zawsze widoczny */
.quick-add-btn {
  position: absolute;
  right: 10px;
  bottom: 10px;
  // background-color: rgba(0, 0, 0, 0.7);
  color: white;
  z-index: 1000;
}

/* Gwarancja widoczności */
.product-card:hover .quick-add-btn {
  opacity: 1;
}

.strike {
  text-decoration: line-through;
}

.sale-price {
  font-size: 1.2rem;
  color: $primary-color;
}

h2 {
  font-size: 1rem !important;
}

.product-price {
  font-size: 1rem !important;
}
</style>
