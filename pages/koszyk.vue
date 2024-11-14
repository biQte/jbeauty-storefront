<script setup lang="ts">
import { ROUTES } from "~/constants/routes";
import { useWindowSize } from "@vueuse/core";

definePageMeta({
  isAccessibleAfterLogin: true,
});

const loading = ref<boolean>(false);
const cartStore = useCartStore();
const sessionStore = useSessionStore();
const snackbarStore = useSnackbarStore();

const { width, height } = useWindowSize();
const config = useRuntimeConfig();

const selectedShippingOption = ref<string>();
const router = useRouter();

const getTotalAmount = computed(() => {
  if (!cartStore.cartObject) return 0;

  const cartTotal = cartStore.cartObject.item_total || 0;
  const selectedShippingCost =
    cartStore.availableShippingOptions!.find(
      (option) => option.id === selectedShippingOption.value
      // @ts-expect-error
    )?.amount || 0;

  return cartTotal + selectedShippingCost;
});

// if (
//   !selectedShippingOption.value &&
//   availableShippingOptions.value.length > 0
// ) {
//   selectedShippingOption.value = availableShippingOptions.value[0].id;
// }

watch(
  cartStore,
  (newOptions) => {
    if (!newOptions.availableShippingOptions) return;
    if (
      !newOptions.availableShippingOptions?.some(
        (option) => option.id === selectedShippingOption.value
      )
    ) {
      // Wybierz nową domyślną opcję, np. pierwszą z listy
      // @ts-ignore
      selectedShippingOption.value =
        newOptions.availableShippingOptions.length > 0
          ? newOptions.availableShippingOptions[0].id
          : null;
    }
  },
  { immediate: true }
);

watch(
  () => cartStore.availableShippingOptions,
  (oldValue, newValue) => {
    if (newValue !== undefined || newValue !== null) {
      console.log("loadedShippingOptions");
    }

    console.log("shipping options", cartStore.availableShippingOptions);
  }
);

const discountInput = ref<string>();

const changeQuantity = async (itemId: string, quantity: number) => {
  if (quantity < 1) {
    quantity = 1;
    return;
  }

  console.log(quantity);

  if (typeof quantity !== "number") quantity = parseInt(quantity);

  try {
    await cartStore.updateLineItem(itemId, quantity);

    console.log(cartStore.cartObject);
  } finally {
  }
};

const increaseQuantity = (itemId: string) => {
  const currentItem = cartStore.cartObject?.items?.find(
    (item) => item.id === itemId
  );
  if (currentItem) {
    changeQuantity(itemId, currentItem.quantity + 1);
  }
};

const decreaseQuantity = (itemId: string) => {
  const currentItem = cartStore.cartObject?.items?.find(
    (item) => item.id === itemId
  );
  if (currentItem) {
    changeQuantity(itemId, currentItem.quantity - 1);
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

watch(sessionStore, async (newValue) => {
  if (newValue.isAuthenticated && !cartStore.cartObject?.customer_id) {
    await cartStore.updateCart(
      newValue.session?.email,
      undefined,
      undefined,
      undefined
    );
  }

  console.log("something changed in session store");
});

const applyDiscount = async () => {
  if (!discountInput.value) return;

  console.log("cart store", cartStore);

  try {
    await cartStore.addPromotions([discountInput.value]);
  } catch (e) {
    console.log(e);
  }

  console.log("cart po aktualizacji", cartStore.cartObject);

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

  discountInput.value = undefined;
};

const removeDiscount = async (code: string) => {
  try {
    // @ts-expect-error
    const discountInCart = cartStore.cartObject!.promotions!.find(
      // @ts-expect-error
      (promotion) => promotion.code === code
    );
    if (!discountInCart) {
      console.log("Kod rabatowy nie został znaleziony w koszyku.");
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

const getPromotionAmount = (promotionId: string) => {
  if (!cartStore.cartObject?.items) return;

  const discountAmount = cartStore.cartObject.items
    .flatMap((item) => item.adjustments)
    // @ts-expect-error
    .filter((adjustment) => adjustment.promotion_id === promotionId)
    // @ts-expect-error
    .reduce((sum, adjustment) => sum + adjustment.amount, 0);

  return discountAmount;
};

// watch(cartStore.loading, (newValue) => {
//   console.log(newValue);
// });

const proceedToCheckout = async () => {
  // try {
  //   if (!selectedShippingOption.value) {
  //     // open snackbar
  //     return;
  //   }

  //   await cartStore.addShippingMethod(selectedShippingOption.value);

  router.push(ROUTES.FINALIZE_ORDER_PAGE);
  // } catch (e) {}
};

onMounted(async () => {
  await cartStore.fetchCart();
  console.log(cartStore.cartObject);

  if (sessionStore.isAuthenticated && !cartStore.cartObject?.customer_id) {
    await cartStore.updateCart(
      sessionStore.session?.email,
      undefined,
      undefined,
      undefined
    );

    console.log("associated cart with customer");
  }
});
</script>

<template>
  <div class="cart-page-wrapper">
    <div
      v-if="
        cartStore.cartObject &&
        cartStore.cartObject.items &&
        cartStore.cartObject.items?.length > 0 &&
        !cartStore.loading
      "
      class="cart-contents-wrapper"
    >
      <div class="cart-info">
        <h1>Koszyk</h1>
        <h2>
          Liczba produktów w koszyku: {{ cartStore.cartObject.items.length }}
        </h2>
        <p v-if="!sessionStore.isAuthenticated">
          Masz konto?
          <v-btn size="small" color="info" :to="ROUTES.LOGIN_PAGE"
            >Zaloguj się</v-btn
          >
        </p>
      </div>
      <v-table v-if="width > 720" class="cart-content-table">
        <thead>
          <tr>
            <th>Produkt</th>
            <th>Cena</th>
            <th>Ilość</th>
            <th>Razem</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartStore.cartObject.items" :key="item.id">
            <th>
              <!-- <div class="product-wrapper"> -->
              <NuxtLink
                class="product-wrapper"
                :to="`/produkt/${item.product_handle}`"
              >
                <v-img
                  class="product-cover-image"
                  cover
                  :src="item.thumbnail!.replace(
                    'http://localhost:9000',
                    config.public.medusaUrl
                  )"
                ></v-img>
                {{ item.product_title }}
              </NuxtLink>
              <!-- </div> -->
            </th>
            <th>
              {{
                new Intl.NumberFormat("pl-PL", {
                  style: "currency",
                  currency: "PLN",
                }).format(item.unit_price)
              }}
            </th>
            <th>
              <div class="quantity-actions-group">
                <v-btn
                  @click="decreaseQuantity(item.id)"
                  size="x-small"
                  icon="mdi-minus"
                ></v-btn>
                {{ item.quantity }}
                <v-btn
                  @click="increaseQuantity(item.id)"
                  size="x-small"
                  icon="mdi-plus"
                ></v-btn>
              </div>
            </th>
            <th>
              {{
                new Intl.NumberFormat("pl-PL", {
                  style: "currency",
                  currency: "PLN",
                }).format(item.unit_price * item.quantity)
              }}
            </th>
            <th>
              <v-btn
                @click="deleteItem(item.id)"
                variant="plain"
                :border="false"
                icon="mdi-delete-outline"
              ></v-btn>
            </th>
          </tr>
        </tbody>
      </v-table>
      <v-table v-else>
        <thead>
          <tr>
            <td>Protukt</td>
            <td>Ilość</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartStore.cartObject.items" :key="item.id">
            <th>
              <NuxtLink :to="`/produkt/${item.product_handle}`">
                <v-img
                  :src="item.thumbnail!.replace(
                    'http://localhost:9000',
                    config.public.medusaUrl
                  )"
                  cover
                ></v-img>
                <p>{{ item.product_title }}</p>
              </NuxtLink>
              <p>
                Cena:
                {{
                  new Intl.NumberFormat("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                  }).format(item.unit_price)
                }}
              </p>
              <p>
                Łącznie:
                {{
                  new Intl.NumberFormat("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                  }).format(item.unit_price * item.quantity)
                }}
              </p>
            </th>
            <th>
              <v-btn
                @click="decreaseQuantity(item.id)"
                size="x-small"
                icon="mdi-minus"
              ></v-btn>
              {{ item.quantity }}
              <v-btn
                @click="increaseQuantity(item.id)"
                size="x-small"
                icon="mdi-plus"
              ></v-btn>
            </th>
            <th>
              <v-btn
                @click="deleteItem(item.id)"
                variant="plain"
                :border="false"
                icon="mdi-delete-outline"
              ></v-btn>
            </th>
          </tr>
        </tbody>
      </v-table>

      <div class="summary">
        <div class="discount-code-section">
          <v-text-field
            label="Kod rabatowy"
            variant="outlined"
            clearable
            density="compact"
            v-model="discountInput"
            hide-details
            :width="200"
          ></v-text-field>
          <v-btn @click="applyDiscount" color="info">Zapisz</v-btn>
        </div>

        <!-- <div class="totals"> -->
        <v-card :max-width="width * 0.8" class="totals" style="padding: 15px">
          <v-card-title>Podsumowanie koszyka</v-card-title>
          <h3>
            Suma produktów:
            {{
              new Intl.NumberFormat("pl-PL", {
                style: "currency",
                currency: "PLN",
              }).format(Math.floor(cartStore.cartObject.item_subtotal!))
            }}
          </h3>
          <!-- @vue-skip -->
          <h3
            v-if="cartStore.cartObject.promotions"
            v-for="discount in cartStore.cartObject.promotions"
            :key="discount.id"
          >
            Kod({{ discount.code }}): -{{
              new Intl.NumberFormat("pl-PL", {
                style: "currency",
                currency: "PLN",
              }).format(getPromotionAmount(discount.id))
            }}
            <v-icon
              @click="removeDiscount(discount.code)"
              icon="mdi-close"
            ></v-icon>
          </h3>

          <!-- <div class="shipping-options">
            <v-radio-group
              label="Wybierz sposób dostawy"
              v-model="selectedShippingOption"
            >
              <v-radio
                v-for="shippingOption in cartStore.availableShippingOptions"
                :key="shippingOption.id"
                :label="
                  shippingOption.name +
                  ' ' +
                  new Intl.NumberFormat('pl-PL', {
                    style: 'currency',
                    currency: 'PLN',
                  }).format(
                    // @ts-expect-error
                    shippingOption.amount
                  )
                "
                :value="shippingOption.id"
              ></v-radio>
            </v-radio-group>
          </div> -->
          <h3>
            Razem:
            {{
              new Intl.NumberFormat("pl-PL", {
                style: "currency",
                currency: "PLN",
              }).format(cartStore.cartObject.item_total)
            }}
            (Zawiera 23% VAT)
          </h3>
          <v-btn
            :size="width < 720 ? 'small' : 'large'"
            @click="proceedToCheckout"
            block
            color="primary"
            >Przejdź do realizacji zamówienia</v-btn
          >
        </v-card>
        <!-- </div> -->
      </div>
    </div>
    <!-- @vue-ignore -->
    <div
      class="empty-cart"
      v-if="
        !cartStore.loading &&
        (!cartStore.cartObject || cartStore.cartObject?.items?.length < 1)
      "
    >
      <h1>Twój koszyk jest pusty</h1>
      <v-btn color="info" :to="ROUTES.ROOT_PAGE">Kontynuuj zakupy</v-btn>
    </div>
    <div class="loader" v-if="cartStore.loading">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cart-page-wrapper {
  .loader {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
  }
  .cart-contents-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5rem;
    height: 100%;

    .cart-info {
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: center;
      gap: 1rem;
      width: 100%;
      padding-left: 15%;
    }

    .summary {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: end;
      gap: 5rem;
      width: 100%;
      padding-right: 15%;

      @media only screen and (max-width: 720px) {
        flex-direction: column;
        justify-content: center;
        padding-right: 0;
      }

      .totals {
        display: flex;
        flex-direction: column;
        align-items: end;
        justify-content: center;
        gap: 1rem;
      }

      .discount-code-section {
        display: flex;
        gap: 1rem;
        align-items: center;
        justify-content: center;
      }
    }

    .v-table
      > .v-table__wrapper
      > tbody
      > tr
      > th
      > .actions-group
      > .v-input
      > .v-input__control
      > .v-field
      > .v-field-overlay
      > .v-field__field
      > .v-field__input {
      text-align: center;
      padding: 0;
    }

    .cart-content-table {
      width: clamp(500px, 900px, 1080px);
      .product-wrapper {
        display: flex;
        align-items: start;
        justify-content: center;
        padding: 1rem;
        gap: 0.5rem;

        .product-cover-image {
          width: clamp(80px, 100px, 105px);
          height: clamp(80px, 100px, 105px);
        }
      }

      .quantity-actions-group {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        width: clamp(127px, 130px, 133px);
      }
    }
  }

  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    width: 100%;
    height: 100%;
  }

  h1 {
    font-size: 3rem;

    @media only screen and (max-width: 720px) {
      font-size: 2rem;
    }
  }

  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.2rem;
    @media only screen and (max-width: 720px) {
      font-size: 1rem;
    }
  }

  .strike {
    text-decoration: line-through;
    opacity: 0.6;
  }
}
</style>
