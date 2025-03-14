<script setup lang="ts">
import { ROUTES } from "~/constants/routes";
import { useWindowSize } from "@vueuse/core";
import { type StoreProduct } from "@medusajs/types";
import { FetchError } from "@medusajs/js-sdk";

type ProductAndQuantity = {
  productId: string;
  quantity: number;
};

useSeoMeta({
  title: "JBeauty - Koszyk",
  ogTitle: "JBeauty - Koszyk",
});

definePageMeta({
  isAccessibleAfterLogin: true,
});

const loading = ref<boolean>(false);
const cartStore = useCartStore();
const sessionStore = useSessionStore();
const snackbarStore = useSnackbarStore();
const nuxtApp = useNuxtApp();
const products = ref<StoreProduct[]>([]);

const { width, height } = useWindowSize();
const config = useRuntimeConfig();

const selectedShippingOption = ref<string>();
const router = useRouter();
const orderMessage = ref<string>("");

await cartStore.fetchCart();

if (cartStore.cartObject?.metadata?.orderMessage) {
  orderMessage.value = cartStore.cartObject?.metadata?.orderMessage as string;
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
    if (!products.value || products.value.length < 1) {
      const productIds = cartStore!.cartObject!.items!.map(
        (item) => item.product_id
      );

      $fetch(`/api/products/by-ids`, {
        credentials: "include",
        query: {
          productIds,
        },
        // @ts-expect-error
      }).then((response) => (products.value = response.products));
    }
  },
  { immediate: true }
);

watch(
  () => cartStore.availableShippingOptions,
  (oldValue, newValue) => {
    if (newValue !== undefined || newValue !== null) {
    }
  }
);

const discountInput = ref<string>();

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

const increaseQuantity = async (itemId: string) => {
  const currentItem = cartStore.cartObject?.items?.find(
    (item) => item.id === itemId
  );

  if (!products.value || products.value.length < 1) {
    const productIds = cartStore!.cartObject!.items!.map(
      (item) => item.product_id
    );

    const response = await $fetch(`/api/products/by-ids`, {
      credentials: "include",
      query: {
        productIds,
      },
    });

    // @ts-expect-error
    products.value = response.products;
  }

  if (!currentItem) return;
  const itemInProducts = products.value.find(
    (product) => product.id === currentItem.product_id
  );
  if (!itemInProducts) return;
  if (
    Number(itemInProducts.variants?.[0].inventory_quantity) >=
    Number(currentItem.quantity) + 1
  ) {
    changeQuantity(itemId, Number(currentItem.quantity) + 1);
  } else {
    snackbarStore.showSnackbar(
      "Brak większej ilosci sztuk w magazynie",
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
      undefined,
      undefined
    );
  }
});

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
// });

const proceedToCheckout = async () => {
  // try {
  //   if (!selectedShippingOption.value) {
  //     // open snackbar
  //     return;
  //   }

  //   await cartStore.addShippingMethod(selectedShippingOption.value);

  if (orderMessage.value && orderMessage.value.length > 0) {
    await cartStore.updateCart(
      undefined,
      undefined,
      undefined,
      undefined,
      orderMessage.value
    );
  }

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
  // } catch (e) {}
};

const refreshCart = async () => {
  let productIdsAndQuantities: ProductAndQuantity[] = [];

  if (
    !cartStore.cartObject ||
    !cartStore.cartObject.items ||
    cartStore.cartObject.items.length < 1
  ) {
    return;
  }

  for (let i = 0; i < cartStore.cartObject.items.length; i++) {
    const productAndQuantity: ProductAndQuantity = {
      productId: cartStore.cartObject.items[i].variant_id as string,
      quantity: cartStore.cartObject.items[i].quantity,
    };
    productIdsAndQuantities.push(productAndQuantity);
  }

  localStorage.removeItem("cart_id");

  await cartStore.createCart(undefined);

  for (let i = 0; i < productIdsAndQuantities.length; i++) {
    try {
      await cartStore.addLineItem(
        productIdsAndQuantities[i].productId,
        productIdsAndQuantities[i].quantity
      );
    } catch (e) {
      if (e instanceof FetchError) {
        if (e.message.includes("does not have the required inventory")) {
          snackbarStore.showSnackbar(
            "Niektóre produkty nie są dostępne w podanej ilości i zostały usunięte z koszyka",
            "error",
            5000
          );
        }
      }
    }
  }

  if (sessionStore.isAuthenticated) {
    await cartStore.updateCart(
      sessionStore.session?.email,
      undefined,
      undefined,
      undefined,
      undefined
    );
  }
};

// onMounted(async () => {
//   await cartStore.fetchCart();

//   if (cartStore.cartObject?.metadata?.orderMessage) {
//     orderMessage.value = cartStore.cartObject?.metadata?.orderMessage as string;
//   }

//   if (sessionStore.isAuthenticated && !cartStore.cartObject?.customer_id) {
//     await cartStore.updateCart(
//       sessionStore.session?.email,
//       undefined,
//       undefined,
//       undefined,
//       undefined
//     );
//   }
// });
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
          <v-btn size="small" color="primary" :to="ROUTES.LOGIN_PAGE"
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
                  contain
                  :src="item.thumbnail!"
                ></v-img>
                <div>
                  {{ item.product_title }}
                  <p
                    style="color: red"
                    v-if="item.product_collection === 'POMODORO'"
                  >
                    Na ten produkt nie obowiązuje kod rabatowy
                  </p>
                </div>
              </NuxtLink>
              <!-- </div> -->
            </th>
            <th>
              <span
                :class="{
                  strike: item.compare_at_unit_price,
                }"
              >
                {{
                  new Intl.NumberFormat("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                  }).format(
                    Number(
                      item.compare_at_unit_price
                        ? item.compare_at_unit_price
                        : item.unit_price
                    )
                  )
                }}
              </span>
              <span v-if="item.compare_at_unit_price" class="sale-price">
                &nbsp;{{
                  new Intl.NumberFormat("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                  }).format(Number(item.unit_price))
                }}
              </span>
            </th>
            <th>
              <div class="quantity-actions-group">
                <v-btn
                  @click="decreaseQuantity(item.id)"
                  size="x-small"
                  rounded
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
                }).format(Number(item.unit_price) * Number(item.quantity))
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
      <v-table :width="width" v-else>
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
                <v-img :src="item.thumbnail!" width="80" contain></v-img>
                <p style="width: 100px">{{ item.product_title }}</p>
                <p
                  style="color: red; max-width: 110px"
                  v-if="item.product_collection === 'POMODORO'"
                >
                  Na ten produkt nie obowiązuje kod rabatowy
                </p>
              </NuxtLink>
              <p>
                Cena:
                <span
                  :class="{
                    strike: item.compare_at_unit_price,
                  }"
                >
                  {{
                    new Intl.NumberFormat("pl-PL", {
                      style: "currency",
                      currency: "PLN",
                    }).format(
                      Number(
                        item.compare_at_unit_price
                          ? item.compare_at_unit_price
                          : item.unit_price
                      )
                    )
                  }}
                </span>
              </p>
              <p v-if="item.compare_at_unit_price" class="sale-price">
                &nbsp;{{
                  new Intl.NumberFormat("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                  }).format(Number(item.unit_price))
                }}
              </p>
              <p>
                Łącznie:
                {{
                  new Intl.NumberFormat("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                  }).format(Number(item.unit_price) * Number(item.quantity))
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
        <div class="code-and-message-wrapper">
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
            <v-btn @click="applyDiscount" color="primary">Zapisz</v-btn>
          </div>
          <br />
          <div @click="refreshCart" class="reset-cart">
            <p>W przypadku problemów z podawaniem kodu</p>
            <br />
            <v-btn color="info">Odśwież koszyk</v-btn>
          </div>
          <!-- <br />
          <div class="order-message-wrapper">
            <v-textarea
              label="Wiadomość do zamówienia"
              variant="outlined"
              density="compact"
              v-model="orderMessage"
              hide-details
              auto-grow
              clearable
              :counter="500"
            >
            </v-textarea>
          </div> -->
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
              }).format(Number(cartStore.cartObject.item_subtotal!))
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
              }).format(Number(cartStore.cartObject.item_total))
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
      <v-btn color="primary" :to="ROUTES.ROOT_PAGE">Kontynuuj zakupy</v-btn>
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

    @media only screen and (max-width: 720px) {
      width: 100%;
      align-items: normal;
    }

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

  // .strike {
  //   text-decoration: line-through;
  //   opacity: 0.6;
  // }
}

.strike {
  text-decoration: line-through;
}

.sale-price {
  font-size: 1.2rem;
  color: $primary-color;
}
</style>
