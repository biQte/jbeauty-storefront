<script setup lang="ts">
import { type StoreProduct } from "@medusajs/types";
import { ROUTES } from "../../constants/routes";

const route = useRoute();

const router = useRouter();

const nuxtApp = useNuxtApp();

const config = useRuntimeConfig();

const { width, height } = useWindowSize();

const snackbarStore = useSnackbarStore();

const queryOffset = ref<number>(0);
const currentPage = ref<number>(1);
const totalProducts = ref<number>(0);
const totalPages = ref<number>(1);
const products = ref<StoreProduct[]>([]);
const limit = ref<number>(20);
const categoryIds = ref<string[]>([]);
const categoryName = ref<string>("");
const loading = ref<boolean>(false);
const allLoaded = ref<boolean>(false);
const hoveredProduct = ref<StoreProduct | null>(null);
const viewMode = ref<"list" | "grid">("list");
const currentlyAddedProductTitle = ref<string>();
const cartStore = useCartStore();
const sessionStore = useSessionStore();
const showDialog = ref<boolean>(false);

const { data: product_categories, error } = await useFetch(
  `/api/categories/by-handle/${route.params.category}`,
  {
    server: true,
    immediate: true,
  }
);

if (product_categories.value.length > 0) {
  categoryName.value = product_categories.value[0].name;
  categoryIds.value = [
    product_categories.value[0].id,
    ...product_categories.value[0].category_children.map(
      (child: any) => child.id
    ),
  ];
}

const { data: initialProductsData, error: productsError } = await useFetch(
  `/api/products/by-category-ids`,
  {
    server: true,
    immediate: true,
    query: {
      categoryIds: categoryIds.value.join(","),
      limit: limit.value,
    },
  }
);

await nextTick();

// @ts-expect-error
if (initialProductsData?.value?.products) {
  // @ts-expect-error
  products.value = initialProductsData.value.products;
  // @ts-expect-error
  totalProducts.value = initialProductsData.value.count;
  queryOffset.value += limit.value;

  if (products.value.length >= totalProducts.value) {
    allLoaded.value = true;
  }
}

const fetchProducts = async () => {
  try {
    if (loading.value || allLoaded.value) return;

    loading.value = true;

    const result = await $fetch(`/api/products/by-category-ids/`, {
      credentials: "include",
      query: {
        limit: limit.value,
        offset: queryOffset.value,
        categoryIds: categoryIds.value,
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
    loading.value = false;
    snackbarStore.showSnackbar(e.toString(), "error", 5000);
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

const infiniteScrollEl = ref<HTMLElement | null>(null);
useInfiniteScroll(infiniteScrollEl, () => fetchProducts(), { distance: 200 });

const addToCart = async (product: StoreProduct) => {
  currentlyAddedProductTitle.value = product.title;
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

useSeoMeta({
  title: `JBeauty - ${product_categories.value[0].name}`,
  ogTitle: `JBeauty - ${product_categories.value[0].name}`,
  description: `Przeglądaj produkty dostępne na Jbeauty sklep w kategorii: ${product_categories.value[0].name}. Wysokiej jakości i przystępne cenowo produkty dostępne od ręki.`,
  ogDescription: `Przeglądaj produkty dostępne na Jbeauty sklep w kategorii: ${product_categories.value[0].name}. Wysokiej jakości i przystępne cenowo produkty dostępne od ręki.`,
});

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
    item_list_name: "Kategoria: " + product_categories.value[0].name,
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
  <div class="container mx-auto px-4 py-8 max-w-screen-xl">
    <h1 class="text-3xl font-bold mb-6">{{ categoryName }}</h1>

    <div
      ref="infiniteScrollEl"
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
                    // @ts-expect-error
                    product.variants?.[0].calculated_price?.price_list_type ===
                    'sale',
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
                  // @ts-expect-error
                  product.variants?.[0].calculated_price?.calculated_price
                    .price_list_type === 'sale'
                "
                class="text-lg font-bold text-pink-500"
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

            <!-- <span
              v-if="product.variants?.[0].inventory_quantity! < 1"
              class="text-sm text-red-500"
            >
              Chwilowo niedostępny
            </span> -->
          </div>
        </NuxtLink>

        <button
          class="text-sm w-full py-2 rounded-b-lg font-semibold transition-colors"
          :class="{
          'bg-pink-500 hover:bg-pink-600 text-white':
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

      <div v-if="loading" class="col-span-full text-center text-gray-500 py-6">
        Ładowanie produktów...
      </div>

      <div
        v-if="allLoaded"
        class="col-span-full text-center text-gray-400 py-6"
      >
        Załadowano wszystkie produkty.
      </div>
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
  </div>
</template>

<style lang="scss" scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
// .category-page-wrapper {
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   gap: 2rem;
//   width: 100%;
//   .products-container {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     width: 100%;
//     @media only screen and (max-width: 720px) {
//       justify-content: start;
//     }
//     .products-wrapper {
//       align-self: center;
//       display: grid;
//       grid-template-columns: repeat(auto-fit, minmax(340px, 340px));
//       width: 100%;
//       gap: 15px;
//       max-width: 90%;

//       & > * {
//         width: 340px;
//         margin-bottom: 0.5rem;
//       }
//     }
//   }
// }

// h1 {
//   font-size: 2rem;
//   padding: 0 2rem;
//   width: 100%;
//   text-align: start;

//   @media only screen and (max-width: 720px) {
//     padding: 0;
//   }
// }

// h2 {
//   font-size: 1rem !important;
// }

// .product-price {
//   font-size: 1rem !important;
// }

// .strike {
//   text-decoration: line-through;
// }

// .sale-price {
//   font-size: 1.2rem;
//   color: $primary-color;
// }
</style>
