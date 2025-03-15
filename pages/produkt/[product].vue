<script lang="ts" setup>
import type { ProductOption, Product } from "@medusajs/client-types";
import { ROUTES } from "../../constants/routes";

const loading = ref<boolean>(false);
const route = useRoute();
const nuxtApp = useNuxtApp();
const cartStore = useCartStore();
const sessionStore = useSessionStore();
const router = useRouter();
const snackbarStore = useSnackbarStore();
const config = useRuntimeConfig();

const { width, height } = useWindowSize();
const productsObject = ref<Product[]>();
const product = ref<Product | null>(null);
const imageToShow = ref<string | null>(null);
const options = ref<ProductOption[] | null>(null);
const showDialog = ref<boolean>(false);
const showDescription = ref<boolean>(true);
const showDetails = ref<boolean>(true);
const activeOverlay = ref<boolean>(false);
const currentIndex = ref<number>(0);
// const customText = ref("");
// const customTextError = ref(false);

const showOverlay = (index: number) => {
  currentIndex.value = index;
  activeOverlay.value = true;
};

const findDeepestProductCategory = () => {
  const productsCategoryID = config.public.productsCategoryID;

  if (!product.value?.categories) return null;

  const productTreeCategory = product.value?.categories.filter((category) =>
    category.mpath?.startsWith(productsCategoryID)
  );

  // @ts-expect-error
  const deepestCategory = productTreeCategory.reduce((deepest, category) => {
    // @ts-expect-error
    return category.mpath!.length > (deepest?.mpath.length || 0)
      ? category
      : deepest;
  }, null);

  return deepestCategory;
};

const { data: products, error } = await useFetch(
  `/api/products/${route.params.product}`,
  {
    server: true,
  }
);

if (!products)
  snackbarStore.showSnackbar("Nie znaleziono produktu", "error", 5000);

productsObject.value = products.value[0] as unknown as Product[];
product.value = productsObject.value as unknown as Product;

imageToShow.value = product.value.images?.[0]?.id ?? null;
options.value = product.value.options ?? null;

const deepestCategory = findDeepestProductCategory();

const { data: productsInTheSameCategory, error: categoryError } =
  await useFetch(`/api/products/by-category-id/${deepestCategory?.id}`, {
    server: true,
    query: {
      offset: 0,
      limit: 13,
    },
  });

productsInTheSameCategory.value = productsInTheSameCategory.value.filter(
  (p: any) => p.id !== product.value?.id
);

if (productsInTheSameCategory.value.length > 12) {
  productsInTheSameCategory.value = productsInTheSameCategory.value.slice(
    0,
    12
  );
}

const { recentlyViewed } = useRecentlyViewed();

const recentlyViewedFiltered = recentlyViewed.value.filter(
  (p: string) => p !== product.value!.id
);

const { data: recentlyViewedProducts, error: recentlyViewedProductsError } =
  await useFetch(`/api/products/by-ids`, {
    server: true,
    query: {
      productIds: recentlyViewedFiltered,
    },
  });

watchEffect(() => {
  if (products.value) {
    productsObject.value = products.value[0] as unknown as Product[];
    product.value = productsObject.value as unknown as Product;

    imageToShow.value = product.value.images?.[0]?.id ?? null;
    options.value = product.value.options ?? null;
  }

  if (productsInTheSameCategory.value) {
    productsInTheSameCategory.value = productsInTheSameCategory.value.filter(
      (p: any) => p.id !== product.value?.id
    );

    if (productsInTheSameCategory.value.length > 12) {
      productsInTheSameCategory.value = productsInTheSameCategory.value.slice(
        0,
        12
      );
    }
  }

  if (recentlyViewedProducts.value)
    recentlyViewedProducts.value = recentlyViewedProducts.value;
});

const addToCart = async () => {
  try {
    const variantId = product.value!.variants![0].id;

    if (cartStore.cartObject === null || cartStore.cartObject === undefined) {
      await cartStore.createCart(undefined);
    }

    if (
      cartStore.cartObject?.items?.find((item) => item.variant_id === variantId)
    ) {
      const item = cartStore.cartObject?.items?.find(
        (item) => item.variant_id === variantId
      );

      await cartStore.updateLineItem(item!.id, counter.value);
    } else {
      await cartStore.addLineItem(variantId, counter.value);
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

const counter = ref<number>(1);

const decreaseQuantity = () => {
  if (counter.value > 1) counter.value--;
};

const increaseQuantity = () => {
  if (counter.value < product.value?.variants?.[0].inventory_quantity!) {
    counter.value++;
  } else {
    snackbarStore.showSnackbar(
      "Brak większej ilości sztuk w magazynie",
      "primary",
      3000
    );
  }
};

const tab = ref();

const toggleDescription = () => {
  showDescription.value = !showDescription.value;
};

const toggleDetails = () => {
  showDetails.value = !showDetails.value;
};

const { addProduct } = useRecentlyViewed();

addProduct(product.value.id);

useSeoMeta({
  title: products.value[0].metadata?.seoTitle
    ? products.value[0].metadata.seoTitle
    : `${products.value[0].title}`,
  ogTitle: products.value[0].metadata?.seoTitle
    ? products.value[0].metadata.seoTitle
    : `${products.value[0].title}`,
  description: products.value[0].metadata?.seoDescription
    ? products.value[0].metadata.seoDescription
    : products.value[0].description,
  ogDescription: products.value[0].metadata?.seoDescription
    ? products.value[0].metadata.seoDescription
    : products.value[0].description,
  ogImage: products.value[0].thumbnail,
  ogImageUrl: products.value[0].thumbnail,
  twitterImage: products.value[0].thumbnail,
  keywords: products.value[0].metadata?.seoTags
    ? products.value[0].metadata.seoTags
    : "",
});

onMounted(() => {
  const { gtag } = useGtag();
  gtag("event", "view_item", {
    currency: "PLN",
    // @ts-expect-error
    value: product.value!.variants?.[0].calculated_price?.calculated_price,
    items: [
      {
        item_id: product.value!.id,
        item_name: product.value!.title,
        price:
          // @ts-expect-error
          product.value!.variants?.[0].calculated_price.calculated_amount,
        quantity: 1,
      },
    ],
  });

  const { $fbq } = useNuxtApp();

  // @ts-expect-error
  $fbq("track", "ViewContent", {
    content_name: product.value!.title,
    content_category: deepestCategory!.name,
    content_ids: [product.value?.id!],
    content_type: "product",
    value:
      // @ts-expect-error
      product.value?.variants?.[0]?.calculated_price?.calculated_amount,
    currency: "PLN",
    contents: [
      {
        id: product.value?.id!,
        quantity: 1,
        ean: product.value?.variants?.[0].ean,
      },
    ],
  });
});
</script>

<template>
  <div class="product-page-wrapper">
    <div class="container mx-auto p-4">
      <div class="flex flex-col lg:flex-row">
        <div class="lg:w-3/5 lg:pr-14">
          <div class="flex">
            <div class="hidden lg:flex flex-col items-center mr-4">
              <div
                class="w-auto h-full object-center object-cover px-4 space-y-4"
              >
                <img
                  v-for="(image, index) in product?.images || []"
                  :key="image.id"
                  width="150"
                  alt=""
                  :src="image.url"
                  class="cursor-pointer"
                  @click="currentIndex = index"
                  v-show="!loading"
                />
                <div
                  v-show="loading"
                  class="w-24 h-24 bg-gray-200 animate-pulse"
                ></div>
              </div>
            </div>
            <div
              class="h-auto w-full flex-1 flex flex-col rounded-lg overflow-hidden"
            >
              <div class="w-auto h-full">
                <!-- @vue-expect-error -->
                <v-carousel
                  hide-delimiters
                  :show-arrows="product?.images?.length > 1 ? 'hover' : false"
                  v-show="!loading"
                  v-model="currentIndex"
                >
                  <v-carousel-item
                    class="w-full"
                    v-for="(image, index) in product?.images"
                    :key="image.id"
                  >
                    <v-img
                      contain
                      class="w-full"
                      :src="image.url"
                      @click="showOverlay(index)"
                    >
                      <v-overlay
                        v-model="activeOverlay"
                        absolute
                        scroll-strategy="block"
                        close-on-content-click
                        class="d-flex align-center justify-center"
                      >
                        <v-img
                          contain
                          :width="width"
                          :height="height"
                          :src="product?.images?.[currentIndex].url"
                        ></v-img>
                      </v-overlay>
                    </v-img>
                  </v-carousel-item>
                </v-carousel>
                <div
                  v-show="loading"
                  class="w-full h-64 bg-gray-200 animate-pulse"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 lg:mt-0 lg:w-2/5 lg:max-w-xl">
          <h1 v-show="!loading" class="font-semibold text-3xl">
            {{ product?.title }}
          </h1>
          <h3 v-show="!loading" class="font-semibold text-2xl">
            {{ product?.subtitle }}
          </h3>
          <p v-show="!loading && product?.variants" class="text-lg mt-2 mb-4">
            <!-- @vue-expect-error -->
            <span
              class="text-3xl"
              :class="{strike: product?.variants?.[0].calculated_price?.calculated_price
                          ?.price_list_type === 'sale' && product?.variants?.[0].inventory_quantity! > 0 && product.variants?.[0].calculated_price?.original_amount !== product.variants?.[0].calculated_price.calculated_amount}"
              >{{
                new Intl.NumberFormat("pl-PL", {
                  style: "currency",
                  currency: "PLN",
                }).format(
                  // @ts-expect-error
                  product?.variants?.[0].calculated_price.original_amount!
                )
              }}</span
            >
            <!-- @vue-expect-error -->
            <span
              v-if="
                      product?.variants?.[0].calculated_price?.calculated_price
                        ?.price_list_type === 'sale' && product.variants?.[0].inventory_quantity! > 0 && product.variants?.[0].calculated_price?.original_amount !== product.variants?.[0].calculated_price.calculated_amount
                    "
              class="sale-price"
            >
              <!-- @vue-expect-error -->
              &nbsp;{{
                new Intl.NumberFormat("pl-PL", {
                  style: "currency",
                  currency: "PLN",
                }).format(
                  Number(
                    product?.variants?.[0].calculated_price?.calculated_amount
                  )
                )
              }}
            </span>
          </p>

          <p v-if="product?.variants?.[0]?.ean">
            EAN(GTIN): {{ product?.variants?.[0]?.ean }}
          </p>
          <br />

          <!-- <div>
            <v-textarea
              v-model="customText"
              label="Należy podać nazwę/y kont na instagramie do których mają odnosić tagi"
              outlined
              required
              class="mt-4"
            />
            <p v-if="customTextError" class="text-red-500 text-sm">
              Pole nie może być puste!
            </p>
          </div> -->

          <div class="product-actions" v-show="!loading">
            <v-btn
              color="primary"
              :size="width > 720 ? 'large' : 'normal'"
              class="px-5"
              @click="addToCart"
              rounded
              :disabled="product?.variants?.[0].inventory_quantity! < 1"
            >
              {{
                product?.variants?.[0].inventory_quantity! < 1
                  ? "Chwilowo niedostępny"
                  : "Dodaj do koszyka"
              }}
            </v-btn>
            <div class="product-quantity">
              <v-btn
                @click="decreaseQuantity"
                icon="mdi-minus"
                size="x-small"
              ></v-btn>
              <span class="w-8 text-center">{{ counter }}</span>
              <v-btn
                @click="increaseQuantity"
                icon="mdi-plus"
                size="x-small"
              ></v-btn>
            </div>
          </div>
        </div>
      </div>

      <br />

      <v-card variant="flat">
        <v-tabs
          v-model="tab"
          :direction="width < 720 ? 'vertical' : 'horizontal'"
          color="primary"
        >
          <v-tab :value="1">Opis</v-tab>
          <v-tab :value="2" v-if="product?.metadata?.gpsr"
            >Informacje dot. bezpieczeństwa</v-tab
          >
        </v-tabs>

        <hr />
        <br />

        <v-tabs-window v-model="tab">
          <v-tabs-window-item :value="1">
            <!-- <div v-html="product?.description" style="padding: 8px"></div> -->
            <product-description
              :description="product?.description!"
              style="padding: 8px"
            />
          </v-tabs-window-item>
          <v-tabs-window-item :value="2">
            <div v-html="product?.metadata?.gpsr" style="padding: 8px"></div>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card>

      <!--<div class="mt-12">
        <div
          class="border-t last:border-b border-ui-medium py-6"
          v-show="!loading"
        >
          <h3 class="-my-3 flow-root">
            <button
              class="py-3 bg-white w-full flex items-center justify-between text-sm text-gray-400 hover:text-gray-500"
              type="button"
              @click="toggleDescription"
            >
              <span class="font-medium text-gray-900 description-sign"
                >OPIS</span
              >
              <span class="ml-6 flex items-center">
                <span>{{ showDescription ? "—" : "+" }}</span>
              </span>
            </button>
          </h3>
          <div
            v-show="showDescription"
            class="pt-6"
            v-html="product?.description"
          ></div>
        </div>

        <div
          class="border-t last:border-b border-ui-medium py-6"
          v-if="
            product?.height ||
            product?.weight ||
            product?.width ||
            product?.length
          "
        >
          <h3 class="-my-3 flow-root">
            <button
              class="py-3 bg-white w-full flex items-center justify-between text-sm text-gray-400 hover:text-gray-500"
              type="button"
              @click="toggleDetails"
            >
              <span class="font-medium text-gray-900">Szczegóły</span>
              <span class="ml-6 flex items-center">
                <span>{{ showDetails ? "—" : "+" }}</span>
              </span>
            </button>
          </h3>
          <div v-show="showDetails" class="pt-6">
            <ul class="list-inside list-disc space-y-2">
              <li v-if="product.weight">
                Waga: {{ product?.weight ? `${product.weight} kg` : "" }}
              </li>
              <li v-if="product.width">
                Szerokość: {{ product?.width ? `${product.width} cm` : "" }}
              </li>
              <li v-if="product.height">
                Wysokość:
                {{ product?.height ? `${product.height} cm` : "" }}
              </li>
              <li v-if="product.length">
                Długość:
                {{ product?.length ? `${product.length} cm` : "" }}
              </li>
            </ul>
          </div> 
        </div>
      </div> -->
    </div>

    <div v-show="loading" class="loading">Ładuje...</div>

    <v-dialog
      v-model="showDialog"
      width="auto"
      persistent
      transition="dialog-top-transition"
    >
      <v-card
        max-width="500"
        prepend-icon="mdi-cart-outline"
        :text="product?.title + ' x' + counter"
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

    <div class="related-products-wrapper">
      <h2>W kategorii: {{ deepestCategory?.name }}</h2>
      <LazyProductCarousel
        :products="productsInTheSameCategory"
        :loading="false"
      />
    </div>

    <br />

    <div class="recently-viewed-products-wrapper">
      <h2>Ostatnio przeglądane:</h2>
      <!-- @vue-expect-error -->
      <LazyProductCarousel
        :products="recentlyViewedProducts.products"
        :loading="false"
        v-if="recentlyViewedProducts"
      />
      <p v-else>Zacznij przeglądać produkty aby zaczęły się tutaj pojawiać</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.product-actions {
  display: flex;
  gap: 1rem;

  @media only screen and (max-width: 720px) {
    // flex-direction: column;
    gap: 0.5rem;
    transform: translateX(-10px);
  }
}

.product-quantity {
  display: flex;
  align-items: center;
  border-radius: 0.825rem;
  padding: 8px 16px;

  @media only screen and (max-width: 720px) {
    padding: 0;
  }
}

.added-to-cart-modal-actions {
  @media only screen and (max-width: 720px) {
    display: flex;
    flex-direction: column;
  }
}

ul {
  list-style-type: disc !important;
}

.description-sign {
  font-size: 2rem;
}

.strike {
  text-decoration: line-through;
}

.sale-price {
  font-size: 1.2rem;
  color: $primary-color;
}

.related-products-wrapper,
.recently-viewed-products-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2rem;

  h2 {
    margin-left: 10%;
    font-size: 1.4rem;
    font-weight: 600;
  }

  p {
    margin-left: 15%;
    font-size: 1.2rem;
    font-weight: 400;
  }
}
</style>
