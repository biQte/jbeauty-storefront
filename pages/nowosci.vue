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
import { ROUTES } from "@/constants/routes";

const { width, height } = useWindowSize();

const products = ref<StoreProduct[]>([]);
const loading = ref<boolean>(false);
const currentlyAddedProductTitle = ref<string>();
const showDialog = ref<boolean>(false);
const cartStore = useCartStore();
const sessionStore = useSessionStore();
const snackbarStore = useSnackbarStore();
const router = useRouter();

const { data: newProducts, error } = await useFetch(
  `/api/products/new?limit=40`,
  {
    server: true,
    immediate: true,
  }
);

products.value = newProducts.value;

const config = useRuntimeConfig();
const route = useRoute();

useHead({
  link: [
    {
      rel: "canonical",
      href: `${config.public.storeUrl}${route.path}`,
    },
  ],
});

onMounted(() => {
  const { gtag } = useGtag();
  gtag("event", "view_item_list", {
    item_list_name: "Nowości",
    items: products.value.map((product) => ({
      item_id: product.id,
      item_name: product.title,
      price: product.variants?.[0].calculated_price?.calculated_price,
      quantity: 1,
    })),
  });
});

const addToCart = async (product: StoreProduct) => {
  currentlyAddedProductTitle.value = product.title;
  try {
    const variantId = product!.variants![0].id;

    if (!cartStore.cartObject) {
      await cartStore.createCart(undefined);
    }

    const existingItem = cartStore.cartObject?.items?.find(
      (item) => item.variant_id === variantId
    );

    if (existingItem) {
      await cartStore.updateLineItem(
        existingItem.id,
        existingItem.quantity + 1
      );
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
  <div class="container mx-auto px-4 py-8 max-w-screen-xl">
    <h1 class="text-3xl font-bold mb-6">Nowości</h1>

    <div
      class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white rounded-lg shadow hover:shadow-md overflow-hidden flex flex-col transition-transform hover:-translate-y-1"
      >
        <NuxtLink
          :to="`/produkt/${product.handle}`"
          class="flex flex-col flex-grow"
        >
          <div
            class="w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden"
          >
            <img
              :src="product.thumbnail!"
              class="object-contain w-full h-full"
              :alt="product.title"
            />
          </div>

          <div class="flex-grow flex flex-col px-2 md:px-4 lg:px-4 py-2">
            <h2 class="text-sm font-medium line-clamp-2">
              {{ product.title }}
            </h2>

            <div class="flex gap-2 items-center mt-auto">
              <span
                class="text-lg font-semibold"
                :class="{
                  'text-gray-400 line-through':
                    product.variants?.[0].calculated_price?.calculated_price
                      ?.price_list_type === 'sale',
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
                    ?.price_list_type === 'sale'
                "
                class="text-lg font-bold text-[#ff5c8a]"
              >
                {{
                  new Intl.NumberFormat("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                  }).format(
                    Number(
                      product.variants?.[0].calculated_price?.calculated_amount
                    )
                  )
                }}
              </span>
            </div>
          </div>
        </NuxtLink>

        <button
          class="text-sm w-full py-2 rounded-b-lg font-semibold transition-colors"
          :class="{
            'bg-[#ff5c8a] hover:bg-pink-600 text-white':
              product.variants?.[0].inventory_quantity! > 0,
            'bg-gray-300 text-gray-500 cursor-not-allowed':
              product.variants?.[0].inventory_quantity! < 1,
          }"
          :disabled="product.variants?.[0].inventory_quantity! < 1"
          @click="addToCart(product)"
        >
          {{
            product.variants?.[0].inventory_quantity! > 0
              ? "Dodaj do koszyka"
              : "Chwilowo niedostępny"
          }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="col-span-full text-center text-gray-500 py-6">
      Ładowanie produktów...
    </div>

    <v-dialog
      v-model="showDialog"
      width="auto"
      persistent
      transition="dialog-top-transition"
    >
      <v-card
        max-width="500"
        prepend-icon="mdi-cart-outline"
        :text="currentlyAddedProductTitle"
        title="Dodano do koszyka"
      >
        <template v-slot:actions>
          <div class="added-to-cart-modal-actions">
            <v-btn @click="showDialog = false" color="success">
              Kontynuuj zakupy
            </v-btn>
            <v-btn @click="router.push(ROUTES.CART_PAGE)">
              Przejdź do koszyka
            </v-btn>
          </div>
        </template>
      </v-card>
    </v-dialog>
  </div>
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

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
