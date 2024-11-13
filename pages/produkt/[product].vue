<script lang="ts" setup>
import type { ProductOption, Product } from "@medusajs/client-types";
import { ROUTES } from "../../constants/routes";

const loading = ref<boolean>(true);
const route = useRoute();
const nuxtApp = useNuxtApp();
const medusaClient = nuxtApp.$medusaClient;
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
const showOverlay = ref<boolean>(false);

onMounted(async () => {
  try {
    const { products } = await medusaClient.store.product.list({
      handle: route.params.product as string,
      //expand: "images,variants",
      fields: "*variants.calculated_price,+variants.inventory_quantity",
    });

    console.log(products[0]);

    productsObject.value = products[0] as unknown as Product[];
    product.value = productsObject.value as unknown as Product;

    imageToShow.value = product.value.images?.[0]?.id ?? null;
    options.value = product.value.options ?? null;
  } catch (error) {
    const { message, color, timeout } = handleFetchError(error);
    if (message !== "") snackbarStore.showSnackbar(message, color, timeout);
  } finally {
    loading.value = false;
  }
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
  if (counter.value < product.value?.variants?.[0].inventory_quantity!)
    counter.value++;
};

const toggleDescription = () => {
  showDescription.value = !showDescription.value;
};

const toggleDetails = () => {
  showDetails.value = !showDetails.value;
};
</script>

<!-- <template>
  <div class="product-page-wrapper">
    <div class="container mx-auto p-8">
      <div class="flex flex-col lg:flex-row">
        <div class="lg:w-3/5 lg:pr-14">
          <div class="flex">
            <div class="hidden lg:flex flex-col items-center mr-4">
              <div
                class="w-auto h-full object-center object-cover px-4 space-y-4"
              >
                <img
                  v-for="image in product?.images || []"
                  :key="image.id"
                  width="150"
                  alt=""
                  :src="image.url"
                  class="cursor-pointer"
                  @click="imageToShow = image.id"
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
                <div
                  v-for="image in product?.images || []"
                  :key="image.id"
                  v-show="imageToShow && image.id === imageToShow"
                >
                  <img alt="" :src="image.url" class="w-full" />
                </div>
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
          <p v-show="!loading && product?.variants" class="text-lg mt-2 mb-4">
            {{
              new Intl.NumberFormat("pl-PL", {
                style: "currency",
                currency: "PLN",
              }).format(product?.variants?.[0].calculated_price.original_amount)
            }}
          </p>
          <p class="font-light" v-show="!loading && product">
            {{ product?.description }}
          </p>
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
                  ? "Brak w magazynie"
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
          <div class="mt-12">
            <div
              class="border-t last:border-b border-ui-medium py-6"
              v-show="!loading"
            >
              <h3 class="-my-3 flow-root">
                <button
                  class="py-3 bg-white w-full flex items-center justify-between text-sm text-gray-400 hover:text-gray-500"
                  type="button"
                  @click="showDetails = !showDetails"
                >
                  <span class="font-medium text-gray-900">Szczegóły</span>
                  <span class="ml-6 flex items-center">
                    <span>—</span>
                  </span>
                </button>
              </h3>
              <div v-show="showDetails" class="pt-6">
                <div class="space-y-4 text-ui-dark text-sm">
                  <ul class="list-inside list-disc space-y-2">
                    <li v-show="product?.weight !== 0">
                      Waga:
                      {{ product?.weight ? `${product.weight} kg` : "" }}
                    </li>
                    <li>
                      Szerokość:
                      {{ product?.width ? `${product.width} cm` : "" }}
                    </li>
                    <li>
                      Wysokość:
                      {{ product?.height ? `${product.height} cm` : "" }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
  </div>
</template> -->

<template>
  <div class="product-page-wrapper">
    <div class="container mx-auto p-8">
      <div class="flex flex-col lg:flex-row">
        <div class="lg:w-3/5 lg:pr-14">
          <div class="flex">
            <div class="hidden lg:flex flex-col items-center mr-4">
              <div
                class="w-auto h-full object-center object-cover px-4 space-y-4"
              >
                <img
                  v-for="image in product?.images || []"
                  :key="image.id"
                  width="150"
                  alt=""
                  :src="
                    image.url.replace(
                      'http://localhost:9000',
                      config.public.medusaUrl
                    )
                  "
                  class="cursor-pointer"
                  @click="imageToShow = image.id"
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
                <!-- <div
                  v-for="image in product?.images || []"
                  :key="image.id"
                  v-show="imageToShow && image.id === imageToShow"
                  @click="showOverlay = true"
                >
                  <img alt="" :src="image.url" class="w-full" /> -->
                <!-- <v-overlay v-model="showOverlay">
                    <v-img
                      :src="image.url"
                      cover
                      :width="(height * 0.7) / width"
                      :height="height * 0.7"
                    ></v-img>
                  </v-overlay> -->
                <!--</div> -->
                <!-- @vue-expect-error -->
                <v-carousel
                  hide-delimiters
                  :show-arrows="product?.images?.length > 1 ? 'hover' : false"
                  v-if="!loading"
                >
                  <v-carousel-item
                    class="w-full"
                    v-for="image in product?.images"
                    :key="image.id"
                  >
                    <v-img
                      contain
                      class="w-full"
                      :src="
                        image.url.replace(
                          'http://localhost:9000',
                          config.public.medusaUrl
                        )
                      "
                    >
                      <v-overlay
                        activator="parent"
                        absolute
                        location-strategy="static"
                        target="[0,0]"
                        scroll-strategy="block"
                        close-on-content-click
                        :width="width"
                        :height="height"
                      >
                        <v-img
                          contain
                          :width="width"
                          :height="height"
                          :src="
                            image.url.replace(
                              'http://localhost:9000',
                              config.public.medusaUrl
                            )
                          "
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
            {{ "PLN" }}
            {{
              new Intl.NumberFormat("pl-PL", {
                style: "currency",
                currency: "PLN",
              }).format(
                // @ts-expect-error
                product?.variants?.[0].calculated_price.original_amount!
              )
            }}
          </p>

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
                  ? "Brak w magazynie"
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

      <div class="mt-12">
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
              <span class="font-medium text-gray-900">Opis</span>
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
      </div>
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
  </div>
</template>

<style lang="scss" scoped>
.product-actions {
  display: flex;
  gap: 1rem;

  @media only screen and (max-width: 720px) {
    // flex-direction: column;
    gap: 0.5rem;
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
</style>
