import type {
  Cart,
  AddressPayload,
  GiftCard,
  Discount,
} from "@medusajs/client-types";
import type {
  CartDTO,
  PromotionDTO,
  StoreCart,
  HttpTypes,
  ShippingOptionDTO,
  AddressDTO,
  PaymentProviderDTO,
  StorePaymentProvider,
} from "@medusajs/types";
import { FetchError } from "@medusajs/js-sdk";

export interface Item {
  variant_id: string;
  quantity: number;
}

export interface DiscountInner {
  code: string;
}

export const useCartStore = defineStore("cart", () => {
  const nuxtApp = useNuxtApp();
  const cartObject = ref<undefined | StoreCart>(undefined);
  const triedToFetchCart = ref<boolean>(false);
  const quantity = ref<number>(0);
  const config = useRuntimeConfig();
  const shippingOptions = ref<ShippingOptionDTO[] | null>([]);
  const availableShippingOptions = ref<ShippingOptionDTO[] | null>();
  const loading = ref<boolean>(false);
  const freeShippingTreshold = ref<number>(200);
  const availablePaymentProviders = ref<StorePaymentProvider[] | null>();
  const snackbarStore = useSnackbarStore();

  const cartIdCookie = useCookie("cart_id", { sameSite: "strict" });

  const createCart = async (items: Item[] | undefined) => {
    if (import.meta.server) return;

    try {
      const cartResponse = await $fetch(`/api/cart`, {
        method: "POST",
        credentials: "include",
        body: {
          items,
        },
      });

      // @ts-expect-error
      cartObject.value = cartResponse.cart as unknown as StoreCart;

      cartIdCookie.value = cartObject.value.id;

      fetchCart();
      calculateQuantity();
      getAvailableShippingOptions();
    } catch (e) {
      return;
    }
  };

  const updateCart = async (
    email: string | undefined,
    billing_address: undefined | HttpTypes.StoreAddAddress,
    shipping_address: undefined | HttpTypes.StoreAddAddress,
    promo_codes: string[] | undefined,
    orderMessage: string | undefined
  ) => {
    if (import.meta.server) return;

    try {
      if (!cartObject.value) {
        return;
      }
      const cartResponse = await $fetch(`/api/cart/${cartObject.value.id}`, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
          email,
          billing_address,
          shipping_address,
          promo_codes,
          metadata: {
            orderMessage,
          },
        }),
      });

      cartObject.value = cartResponse as unknown as StoreCart;

      calculateQuantity();
      getAvailableShippingOptions();
    } catch (e) {
      throw e;
    }
  };

  const updateCountry = async (countryCode: string) => {
    try {
      if (!cartObject.value) {
        return;
      }
      const cartResponse = await $fetch(`/api/cart/${cartObject.value.id}`, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
          shipping_address: {
            country_code: countryCode,
          },
          billing_address: {
            country_code: countryCode,
          },
        }),
      });

      cartObject.value = cartResponse as unknown as StoreCart;

      calculateQuantity();
      await getAvailableShippingOptions();
    } catch (e) {
      throw e;
    }
  };

  const addLineItem = async (variant_id: string, quantity: number) => {
    try {
      if (!cartObject.value) {
        return;
      }

      const cartResponse = await $fetch(
        `api/cart/${cartObject.value.id}/line-items`,
        {
          credentials: "include",
          method: "POST",
          body: JSON.stringify({
            variant_id,
            quantity,
          }),
        }
      );

      cartObject.value = cartResponse as unknown as StoreCart;

      calculateQuantity();
      getAvailableShippingOptions();
    } catch (e: any) {
      console.log(e);
      throw e;
    }
  };

  const updateLineItem = async (lineItemId: string, quantity: number) => {
    try {
      if (!cartObject.value) {
        return;
      }

      const cartResponse = await $fetch(
        `/api/cart/${cartObject.value.id}/line-items/${lineItemId}`,
        {
          credentials: "include",
          method: "POST",
          body: JSON.stringify({
            quantity,
          }),
        }
      );

      cartObject.value = cartResponse as unknown as StoreCart;

      calculateQuantity();
      getAvailableShippingOptions();
    } catch (e: any) {
      if (
        e.statusText === "Some variant does not have the required inventory"
      ) {
        try {
          const cartProduct = cartObject.value?.items?.find(
            (product: any) => product.id === lineItemId
          );

          // @ts-expect-error
          const { products } = await $fetch(`/api/products/by-ids`, {
            credentials: "include",
            query: {
              productIds: cartProduct?.product_id,
            },
          });

          if (products[0].inventory_quantity === 0) {
            await deleteLineItem(lineItemId);
          } else {
            await deleteLineItem(lineItemId);
            await addLineItem(
              products[0].variants[0].id,
              products[0].variants[0].inventory_quantity
            );
          }
        } catch (e) {
          throw e;
        }
      } else {
        throw e;
      }
    }
  };

  const deleteLineItem = async (lineItemId: string) => {
    try {
      if (!cartObject.value) {
        return;
      }

      const response = await $fetch(
        `/api/cart/${cartObject.value.id}/line-items/${lineItemId}`,
        {
          credentials: "include",
          method: "DELETE",
        }
      );

      cartObject.value = response;

      calculateQuantity();
      getAvailableShippingOptions();
    } catch (e) {
      return;
    }
  };

  const addPromotions = async (promoCodes: string[]) => {
    try {
      if (!cartObject.value) return;

      const cart = await $fetch(`/api/cart/${cartObject.value.id}/promotions`, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
          promo_codes: promoCodes,
        }),
      });

      cartObject.value = cart as unknown as StoreCart;

      calculateQuantity();
      getAvailableShippingOptions();
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  const removePromotions = async (promoCodes: string[]) => {
    try {
      if (!cartObject.value) {
        return;
      }

      const cart = await $fetch(`/api/cart/${cartObject.value.id}/promotions`, {
        credentials: "include",
        method: "DELETE",
        body: JSON.stringify({
          promo_codes: promoCodes,
        }),
      });

      cartObject.value = cart as unknown as StoreCart;

      calculateQuantity();
      getAvailableShippingOptions();
    } catch (e) {
      throw e;
    }
  };

  const addShippingMethod = async (option_id: string) => {
    try {
      if (!cartObject.value) return;

      const cart = await $fetch(
        `/api/cart/${cartObject.value.id}/shipping-methods`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            option_id,
          }),
        }
      );

      cartObject.value = cart as unknown as StoreCart;

      calculateQuantity();
    } catch (e) {
      throw e;
    }
  };

  const fetchCart = async () => {
    if (import.meta.server) return;

    try {
      triedToFetchCart.value = true;

      loading.value = true;

      const cartId = cartIdCookie.value;

      if (!cartId) {
        loading.value = false;
        return;
      }

      let cartResponse = await $fetch(`/api/cart/${cartId}`, {
        credentials: "include",
      });

      if (cartResponse.completed_at !== null) {
        loading.value = false;
        cartObject.value = undefined;
        cartIdCookie.value = null;
        calculateQuantity();
        return;
      }

      const productIds: string[] = [];

      if (cartResponse.items) {
        let removedOrModifiedProducts = false;

        for (let i = 0; i < cartResponse.items?.length; i++) {
          productIds.push(cartResponse.items[i].product_id!);
        }

        // @ts-expect-error
        const { products } = await $fetch(`/api/products/by-ids`, {
          credentials: "include",
          query: {
            productIds,
          },
        });

        for (let i = 0; i < cartResponse.items.length; i++) {
          const cartProduct = cartResponse.items[i];

          const product = products.find(
            (product: any) => product.id === cartProduct.product_id
          );

          if (product.variants[0].inventory_quantity < cartProduct.quantity) {
            removedOrModifiedProducts = true;

            if (product.variants[0].inventory_quantity === 0) {
              await deleteLineItem(cartProduct.id);
            } else {
              await deleteLineItem(cartProduct.id);
              await addLineItem(
                product.variants[0].id,
                product.variants[0].inventory_quantity
              );
            }
          }
        }

        if (removedOrModifiedProducts) {
          snackbarStore.showSnackbar(
            "Usuneliśmy niektóre produkty z twojego koszyka z powodu braku dostępności",
            "info",
            5000
          );

          cartResponse = await $fetch(`/api/cart/${cartId}`, {
            credentials: "include",
          });
        }
      }

      if (!cartResponse.shipping_address?.country_code) {
        await updateCountry("pl");
      }

      cartObject.value = cartResponse as unknown as StoreCart;

      calculateQuantity();
      await getAvailableShippingOptions();
    } catch (e) {
      loading.value = false;
      return;
    } finally {
      loading.value = false;
    }
  };

  const calculateQuantity = () => {
    let counter = 0;

    const items = cartObject.value?.items;

    if (!items || items === undefined || items.length === 0) quantity.value = 0;
    else
      for (const item of items!) {
        counter += Number(item.quantity);
      }

    quantity.value = counter;
  };

  const getShippingOptions = async () => {
    if (!cartObject.value?.id) return;

    try {
      const shipping_options = await $fetch(`/api/shipping-options/`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        query: {
          cart_id: cartObject.value?.id,
        },
      });

      shippingOptions.value =
        shipping_options as unknown as ShippingOptionDTO[];
    } catch (e) {
      throw e;
    }
  };

  const getAvailableShippingOptions = async () => {
    if (!cartObject.value) return;

    // if (!shippingOptions.value || shippingOptions.value.length < 1)
    await getShippingOptions();

    availableShippingOptions.value = [];

    if (Number(cartObject.value.item_total) > freeShippingTreshold.value) {
      for (const option of shippingOptions.value!) {
        if (
          // @ts-expect-error
          option.amount === 0 ||
          option.name.toLowerCase().includes("kurier") ||
          option.name.toLowerCase().includes("pobranie")
        ) {
          availableShippingOptions.value.push(option);
        }
      }
    } else {
      for (const option of shippingOptions.value!) {
        if (
          // @ts-expect-error
          option.amount > 0 ||
          option.name.toLowerCase().includes("kurier") ||
          option.name.toLowerCase().includes("osobisty") ||
          option.name.toLowerCase().includes("pobranie")
        ) {
          availableShippingOptions.value.push(option);
        }
      }
    }

    availableShippingOptions.value.sort((a, b) => {
      if (a.name.toLowerCase().includes("paczkomat")) return -1;
      if (b.name.toLowerCase().includes("paczkomat")) return 1;
      if (a.name.toLowerCase().includes("pobranie")) return 1;
      if (b.name.toLowerCase().includes("pobranie")) return -1;
      return 0;
    });
  };

  const retrievePaymentProviders = async () => {
    try {
      if (!cartObject.value) return;

      const payment_providers = await $fetch(`/api/payment-providers`, {
        credentials: "include",
        query: {
          region_id: cartObject.value.region_id,
        },
      });

      availablePaymentProviders.value = payment_providers;
    } catch (e) {
      throw e;
    }
  };

  const selectPaymentProvider = async (
    selectedPaymentProviderId: string = "pp_system_default"
  ) => {
    try {
      if (!cartObject.value) return;

      let paymentCollectionId = cartObject.value.payment_collection?.id;

      if (!paymentCollectionId) {
        const payment_collection = await $fetch(`/api/payment-collections`, {
          credentials: "include",
          method: "POST",
          body: JSON.stringify({
            cart_id: cartObject.value.id,
          }),
        });

        paymentCollectionId = payment_collection.id;
      }

      await fetchCart();

      await $fetch(
        `/api/payment-collections/${paymentCollectionId}/payment-sessions`,
        {
          credentials: "include",
          method: "POST",
          body: JSON.stringify({
            provider_id: selectedPaymentProviderId,
          }),
        }
      );

      await fetchCart();
    } catch (e) {
      throw e;
    }
  };

  const completeCart = async () => {
    try {
      if (!cartObject.value) return;

      //@ts-expect-error
      const { type, cart, order, error } = await $fetch(
        `/api/cart/${cartObject.value.id}/complete`,
        {
          credentials: "include",
          method: "POST",
        }
      );

      return {
        type,
        cart,
        order,
        error,
      };
    } catch (e) {
      throw e;
    }
  };

  return {
    cartObject,
    triedToFetchCart,
    quantity,
    availableShippingOptions,
    availablePaymentProviders,
    loading,
    createCart,
    updateCart,
    updateCountry,
    addLineItem,
    updateLineItem,
    deleteLineItem,
    addPromotions,
    removePromotions,
    addShippingMethod,
    fetchCart,
    getAvailableShippingOptions,
    retrievePaymentProviders,
    selectPaymentProvider,
    completeCart,
  };
});
