<script setup lang="ts">
import { ROUTES } from '~/constants/routes';

useSeoMeta({
  title: "JBeauty - Koszyk",
  ogTitle: "JBeauty - Koszyk",
});

definePageMeta({
  isAccessibleAfterLogin: true,
});

const sessionStore = useSessionStore();
const cartStore = useCartStore();
const snackbarStore = useSnackbarStore();

const router = useRouter();

const cart = computed(() => cartStore.cartObject);

const discountInput = ref('');

const products = ref<any[]>([]);

const loading = ref(true);
const freeShippingThreshold = 200;
const recommendedProducts = ref<any[]>([]);

const increaseQuantity = async (itemId: string) => {
  const currentItem = cartStore.cartObject?.items?.find(
    (item) => item.id === itemId
  );

  if (!products.value || products.value.length < 1) {
    const productIds = cartStore.cartObject?.items?.map(
      (item) => item.product_id
    );
    const response = await $fetch(`/api/products/by-ids`, {
      credentials: "include",
      query: { productIds },
    });
    // @ts-expect-error
    products.value = response.products;
  }

  if (!currentItem) return;
  const itemInProducts = products.value.find(
    (product) => product.id === currentItem.product_id
  );
  if (!itemInProducts) return;

  const availableQty = Number(itemInProducts.variants?.[0]?.inventory_quantity);
  const nextQty = Number(currentItem.quantity) + 1;

  if (availableQty >= nextQty) {
    changeQuantity(itemId, nextQty);
  } else {
    snackbarStore.showSnackbar(
      "Brak większej ilości sztuk w magazynie",
      "primary",
      3000
    );
  }
};

const decreaseQuantity = (itemId: string) => {
  const currentItem = cartStore.cartObject?.items?.find(
    (item) => item.id === itemId
  );
  if (currentItem) {
    changeQuantity(itemId, Number(currentItem.quantity) - 1);
  }
};

const changeQuantity = async (itemId: string, quantity: number) => {
  if (quantity < 1) {
    quantity = 1;
    return;
  }

  if (typeof quantity !== "number") quantity = parseInt(quantity);

  try {
    await cartStore.updateLineItem(itemId, quantity);
  } finally {
  }
};

const deleteItem = async (itemId: string) => {
  const currentItem = cartStore.cartObject?.items?.find(
    (item) => item.id === itemId
  );

  if (currentItem) {
    await cartStore.deleteLineItem(currentItem.id);
  }
};

const applyDiscount = async () => {
  if (!discountInput.value) return;

  try {
    // await cartStore.updateCart(undefined, undefined, undefined, [], undefined);
    await cartStore.addPromotions([discountInput.value.toUpperCase()]);
  } catch (e) {
    console.log(e);
  }

  if (
    // @ts-expect-error
    !cartStore.cartObject.promotions.find(
      // @ts-expect-error
      (promotion) =>
        promotion.code.toLowerCase() === discountInput.value?.toLowerCase()
    )
  ) {
    snackbarStore.showSnackbar(
      "Podany kod jest nie prawidłowy lub wygasł",
      "error",
      3000
    );
  } else {
    snackbarStore.showSnackbar(
      `Dodano kod rabatowy ${discountInput.value}`,
      "success",
      3000
    );
  }

  discountInput.value = '';
};

const removeDiscount = async (code: string) => {
  try {
    // @ts-expect-error
    const discountInCart = cartStore.cartObject!.promotions!.find(
      // @ts-expect-error
      (promotion) => promotion.code === code
    );
    if (!discountInCart) {
      return;
    }

    await cartStore.removePromotions([code]);
    snackbarStore.showSnackbar(
      `Kod rabatowy ${code} został usunięty`,
      "success",
      3000
    );
  } catch (e) {
    throw e;
  }
};

const proceedToCheckout = () => {
    const { gtag } = useGtag();
  gtag("event", "begin_checkout", {
    currency: "PLN",
    value: cartStore.cartObject?.total,
    items: cartStore.cartObject?.items?.map((item) => ({
      item_id: item.id,
      item_name: item.title,
      price: item.unit_price,
      quantity: item.quantity,
    })),
  });

  const { $fbq } = useNuxtApp();

  // @ts-expect-error
  $fbq("track", "InitiateCheckout", {
    value: cartStore.cartObject?.total,
    currency: "PLN",
    num_items: cartStore.cartObject?.items?.length,
    content_ids: cartStore.cartObject?.items?.map((item) => item.product_id),
    content_type: "product",
  });


  router.push(ROUTES.FINALIZE_ORDER_PAGE);
};

watch(sessionStore, async (newValue) => {
  if (newValue.isAuthenticated && !cartStore.cartObject?.customer_id) {
    await cartStore.updateCart(
      newValue.session?.email,
      undefined,
      undefined,
      undefined,
      undefined
    );
  }
});

const missingAmountToFreeShipping = computed(() => {
  return Math.max(0, freeShippingThreshold - (cartStore.cartObject?.item_total || 0));
});

onMounted(async () => {
  loading.value = true;
  try {
    await cartStore.fetchCart(); // Pobierz aktualny koszyk
    if (sessionStore.session === null) {
      await sessionStore.fetchSession(); // Jeśli nie ma sesji, spróbuj pobrać
    }

    if (sessionStore.isAuthenticated && !cartStore.cartObject?.customer_id) {
      await cartStore.updateCart(
        sessionStore.session?.email,
        undefined,
        undefined,
        undefined,
        undefined
      );
    }

    // Pobierz rekomendowane produkty
    const { data: recommended } = await useFetch('/api/products/recommended', {
      credentials: 'include',
        query: {
            limit: 10,
            },
    });

    if (recommended.value) {
      recommendedProducts.value = recommended.value || [];
    }
  } catch (err) {
    snackbarStore.showSnackbar('Nie udało się załadować koszyka.', 'error', 3000);
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const canProceed = computed(() => {
  return !!(cartStore.cartObject?.items && cartStore.cartObject?.items?.length > 0);
});

const goToCheckout = () => {
  if (!cart.value || !cart.value.items || cart.value.items?.length === 0) {
    snackbarStore.showSnackbar('Koszyk jest pusty.', 'error', 3000);
    return;
  }   

  router.push('/realizacja-zamowienia');
};
</script>

<template>
  <div class="container mx-auto px-4 pt-4 lg:pt-6 pb-8 min-h-[calc(100vh-120px)] flex flex-col">
    <h1 class="text-2xl lg:text-3xl font-semibold text-left mt-4 mb-4 sm:mt-4 sm:mb-6">
        Koszyk ({{ cartStore.quantity || 0 }})
    </h1>
    <div v-if="!cartStore.cartObject?.items?.length" class="flex-1 flex flex-col items-center justify-center text-center">
        <div class="mb-6">
            <!-- Można tu dodać ikonę koszyka lub grafikę -->
            <svg class="w-16 h-16 text-pink-400 mx-auto" fill="none" stroke="currentColor" stroke-width="1.5"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m10-9l2 9m-6-9v9" />
            </svg>
        </div>

        <h2 class="text-xl font-semibold mb-2">Twój koszyk jest pusty</h2>
        <p class="text-gray-500 mb-6">Wygląda na to, że nie dodano jeszcze żadnych produktów.</p>

        <v-btn to="/" color="primary" class="bg-[#ff5c8a] text-white hover:brightness-110">
            Wróć do zakupów
        </v-btn>
    </div>


    <div v-else class="flex-1 flex flex-col justify-center mb-4">
        <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
            <CartLoginSuggestion class="lg:hidden" v-if="!sessionStore.isAuthenticated" />
            <!-- Lista produktów -->
            <div class="space-y-4 ">
                <CartProductCard
                v-for="item in cartStore.cartObject?.items"
                :key="item.id"
                :item="item"
                @increase="increaseQuantity"
                @decrease="decreaseQuantity"
                @remove="deleteItem"
                />
            </div>

            <!-- <CartLoginSuggestion class="hidden lg:flex" v-if="!sessionStore.isAuthenticated" />
            <div v-if="!sessionStore.isAuthenticated"></div>

            <CartSummaryBox
                :promotions="cartStore.cartObject?.promotions"
                :total="cartStore.cartObject?.total"
                :itemTotal="cartStore.cartObject?.item_total"
                :discountTotal="cartStore.cartObject?.discount_total"
                :shippingAmount="selectedShippingAmount"
                :missingAmount="missingAmountToFreeShipping"
                :canCheckout="canProceed"
                @proceed="proceedToCheckout"
                @remove-discount="removeDiscount"
            >
                <CartDiscountCode
                v-model="discountInput"
                @apply="applyDiscount"
                />
            </CartSummaryBox> -->
            <div class="space-y-4">
                <CartLoginSuggestion v-if="!sessionStore.isAuthenticated" class="hidden lg:flex" />
                <!-- @vue-ignore -->
                <CartSummaryBox
                :promotions="cartStore.cartObject?.promotions"
                :total="cartStore.cartObject?.total"
                :itemTotal="cartStore.cartObject?.item_total"
                :discountTotal="cartStore.cartObject?.discount_total"
                :shippingAmount="selectedShippingAmount"
                :missingAmount="missingAmountToFreeShipping"
                :canCheckout="canProceed"
                @proceed="proceedToCheckout"
                @remove-discount="removeDiscount"
                >
                <CartDiscountCode
                    v-model="discountInput"
                    @apply="applyDiscount"
                />
                </CartSummaryBox>
            </div>
        </div>
    </div>

    <div class="-mx-4 lg:-mx-[calc((100vw-1024px)/2)] px-0" v-if="cartStore.cartObject?.items && cartStore.cartObject?.items.length > 0">
        <TheHomePageBanner />
    </div>

    <div class="mt-8 px-4 lg:px-0">
      <div class="w-[100%] mx-auto flex flex-col gap-2">
        <h2 class="text-xl font-bold">Polecane</h2>
        <LazyProductCarousel
          :products="recommendedProducts"
          :loading="false"
        />
      </div>
    </div>

    <div class="-mx-4 lg:-mx-[calc((100vw-1024px)/2)] px-0" v-if="!cartStore.cartObject?.items || cartStore.cartObject?.items.length < 1">
        <TheHomePageBanner />
    </div>
  </div>
</template>

