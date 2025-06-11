<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useWindowSize } from "@vueuse/core";
import { type StoreProduct } from "@medusajs/types";
import { ROUTES } from "@/constants/routes";

const props = defineProps<{
  products: StoreProduct[] | null;
  loading: boolean;
}>();

const cartStore = useCartStore();
const snackbarStore = useSnackbarStore();
const sessionStore = useSessionStore();
const router = useRouter();
const route = useRoute();
const { width } = useWindowSize({ initialWidth: 390 });
const showDialog = ref(false);
const currentlyAddedProductTitle = ref<string>();
const isHovered = ref<number | null>(null);
const isPaused = ref(false);
const isClient = ref(false);

const visibleCount = computed(() => {
  return width.value >= 1600
    ? 4
    : width.value >= 1140
    ? 3
    : width.value >= 720
    ? 2
    : 1;
});

function chunkArray<T>(arr: T[], size: number): T[][] {
  return arr.length
    ? Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size)
      )
    : [];
}

const chunkedProducts = computed(() =>
  props.products && isClient.value
    ? chunkArray(props.products, visibleCount.value)
    : []
);

const currentSlide = ref(0);
let intervalId: ReturnType<typeof setInterval>;

onMounted(() => {
  isClient.value = true;
  nextTick(() => {
    currentSlide.value = 0;
  });
  intervalId = setInterval(() => {
    if (!isPaused.value) nextSlide();
  }, 6000);
});

onUnmounted(() => clearInterval(intervalId));

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % chunkedProducts.value.length;
};

const prevSlide = () => {
  currentSlide.value =
    (currentSlide.value - 1 + chunkedProducts.value.length) %
    chunkedProducts.value.length;
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
};

const formatPrice = (value?: number | null) => {
  if (!value) return "";
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(value);
};

const addToCart = async (product: StoreProduct) => {
  currentlyAddedProductTitle.value = product.title;
  try {
    const variantId = product.variants![0].id;

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

    if(route.path !== ROUTES.CART_PAGE) {
      showDialog.value = true;
    }
  } catch (e) {
    const { message, color, timeout } = handleFetchError(e);
    if (message) snackbarStore.showSnackbar(message, color, timeout);
  }
};

let touchStartX = 0;
let touchEndX = 0;
const handleTouchStart = (e: TouchEvent) => {
  touchStartX = e.changedTouches[0].screenX;
};
const handleTouchEnd = (e: TouchEvent) => {
  touchEndX = e.changedTouches[0].screenX;
  handleGesture();
};
const handleGesture = () => {
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) nextSlide();
    else prevSlide();
  }
};
</script>

<template>
  <div class="relative w-full overflow-hidden pb-20">
    <div
      class="flex transition-transform duration-700 ease-in-out"
      :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      @mouseenter="isPaused = true"
      @mouseleave="isPaused = false"
      @touchstart.passive="handleTouchStart"
      @touchend.passive="handleTouchEnd"
    >
      <div
        v-for="(chunk, chunkIndex) in chunkedProducts"
        :key="chunkIndex"
        class="flex gap-6 justify-center min-w-full"
      >
        <div
          v-for="(product, index) in chunk"
          :key="product.id"
          class="bg-white rounded-lg shadow hover:shadow-md overflow-hidden flex flex-col transition-transform hover:-translate-y-1 w-[340px]"
        >
          <NuxtLink
            :to="`/produkt/${product.handle}`"
            class="flex flex-col flex-grow"
          >
            <div
              class="w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden"
            >
              <nuxt-img
                :src="product.thumbnail!"
                class="object-contain w-full h-full"
                :alt="product.title"
                format="webp"
                quality="20"
                size="340"
                :placeholder="[340, 340, 5, 0]"
              />
            </div>

            <div class="flex-grow flex flex-col px-4 pt-2 pb-4">
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
                        product.variants?.[0].calculated_price
                          ?.calculated_amount
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
      'bg-[#ff5c8a] hover:bg-pink-600 text-white': product.variants?.[0].inventory_quantity! > 0,
      'bg-gray-300 text-gray-500 cursor-not-allowed': product.variants?.[0].inventory_quantity! < 1,
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
    </div>

    <!-- Strzałki -->
    <button
      @click="prevSlide"
      class="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow hover:bg-gray-100 z-50 border border-gray-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-gray-700"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
    <button
      @click="nextSlide"
      class="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow hover:bg-gray-100 z-50 border border-gray-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-gray-700"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>

    <!-- Kropeczki -->
    <div class="flex justify-center gap-2 mt-6 pb-6">
      <span
        v-for="(dot, i) in chunkedProducts.length"
        :key="i"
        class="w-3 h-3 rounded-full cursor-pointer"
        :class="{
          'bg-[#ff5c8a]': currentSlide === i,
          'bg-gray-300': currentSlide !== i,
        }"
        @click="goToSlide(i)"
      ></span>
    </div>

    <!-- Dialog dodania -->
    <v-dialog
      v-model="showDialog"
      width="auto"
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

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
