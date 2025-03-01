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
  const medusaClient = nuxtApp.$medusaClient;
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
      const cartResponse = await medusaClient.store.cart.create({
        items,
        // region_id: "reg_01JB4P2DW6KD26916HWVTQH288",
        // sales_channel_id: "sc_01JB4NT3TED1JT059QYMRFA4ND",
        region_id: String(config.public.regionID),
        sales_channel_id: String(config.public.salesChannelID),
      });

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

      const cartResponse = await medusaClient.store.cart.update(
        cartObject.value.id,
        {
          email,
          billing_address,
          shipping_address,
          promo_codes,
          metadata: {
            orderMessage,
          },
        }
      );

      cartObject.value = cartResponse.cart as unknown as StoreCart;

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

      console.log("called");

      const cartResponse = await medusaClient.store.cart.update(
        cartObject.value.id,
        {
          shipping_address: {
            country_code: countryCode,
          },
          billing_address: {
            country_code: countryCode,
          },
        }
      );

      console.log("done");

      cartObject.value = cartResponse.cart as unknown as StoreCart;

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

      const cartResponse = await medusaClient.store.cart.createLineItem(
        cartObject.value.id,
        {
          variant_id,
          quantity,
        }
      );

      cartObject.value = cartResponse.cart as unknown as StoreCart;

      calculateQuantity();
      getAvailableShippingOptions();
    } catch (e: any) {
      throw e;
    }
  };

  const updateLineItem = async (lineItemId: string, quantity: number) => {
    try {
      if (!cartObject.value) {
        return;
      }

      const cartResponse = await medusaClient.store.cart.updateLineItem(
        cartObject.value.id,
        lineItemId,
        { quantity }
      );

      cartObject.value = cartResponse.cart as unknown as StoreCart;

      calculateQuantity();
      getAvailableShippingOptions();
    } catch (e) {
      if (e instanceof FetchError) {
        if (e.message === "Some variant does not have the required inventory") {
          try {
            const cartProduct = cartObject.value?.items?.find(
              (product: any) => product.id === lineItemId
            );

            // @ts-expect-error
            const { products } = await $fetch(
              `${config.public.medusaUrl}/store/products?id=${cartProduct?.product_id}&fields=+variants.inventory_quantity`,
              {
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                  "x-publishable-api-key": config.public.medusaPublishableKey,
                },
              }
            );

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

      const cartResponse = await medusaClient.store.cart.deleteLineItem(
        cartObject.value.id,
        lineItemId
      );

      cartObject.value = cartResponse.parent as unknown as StoreCart;

      calculateQuantity();
      getAvailableShippingOptions();
    } catch (e) {
      return;
    }
  };

  const addPromotions = async (promoCodes: string[]) => {
    try {
      if (!cartObject.value) return;

      // @ts-expect-error
      const { cart } = await $fetch(
        `${config.public.medusaUrl}/store/carts/${cartObject.value.id}/promotions`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": String(config.public.medusaPublishableKey),
          },
          method: "POST",
          body: {
            promo_codes: promoCodes,
          },
        }
      );

      cartObject.value = cart as unknown as StoreCart;

      calculateQuantity();
      getAvailableShippingOptions();
    } catch (e) {
      throw e;
    }
  };

  const removePromotions = async (promoCodes: string[]) => {
    try {
      if (!cartObject.value) {
        return;
      }

      // const cartResponse = await medusaClient.store.cart(
      //   cartObject.value.id,
      //   discountCode
      // );

      // @ts-expect-error
      const { cart } = await $fetch(
        `${config.public.medusaUrl}/store/carts/${cartObject.value.id}/promotions`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": String(config.public.medusaPublishableKey),
          },
          method: "DELETE",
          body: {
            promo_codes: promoCodes,
          },
        }
      );

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

      const { cart } = await medusaClient.store.cart.addShippingMethod(
        cartObject.value.id,
        { option_id }
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

      let cartResponse = await medusaClient.store.cart.retrieve(cartId, {
        // fields: "*items.variant,+items.product.variants.inventory_quantity",
        fields: "+billing_address.metadata,+shipping_address.metadata",
      });

      console.log("cart when started fetching", cartResponse.cart);

      if (
        // @ts-expect-error
        cartResponse.cart.completed_at !== null
      ) {
        loading.value = false;
        cartObject.value = undefined;
        cartIdCookie.value = null;
        calculateQuantity();
        return;
      }

      const productIds: string[] = [];

      if (cartResponse.cart.items) {
        let removedOrModifiedProducts = false;

        for (let i = 0; i < cartResponse.cart.items?.length; i++) {
          productIds.push(cartResponse.cart.items[i].product_id!);
        }

        const queryParams = productIds
          .map((id) => `id=${encodeURIComponent(id)}`)
          .join("&");

        console.log(productIds);

        // @ts-expect-error
        const { products } = await $fetch(
          `${config.public.medusaUrl}/store/products?${queryParams}&fields=+variants.inventory_quantity`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "x-publishable-api-key": config.public.medusaPublishableKey,
            },
          }
        );

        for (let i = 0; i < cartResponse.cart.items.length; i++) {
          const cartProduct = cartResponse.cart.items[i];

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
              // await updateLineItem(
              //   cartProduct.id,
              //   // product.variants[0].inventory_quantity
              //   2
              // );
            }
          }
        }

        if (removedOrModifiedProducts) {
          snackbarStore.showSnackbar(
            "Usuneliśmy niektóre produkty z twojego koszyka z powodu braku dostępności",
            "info",
            5000
          );

          cartResponse = await medusaClient.store.cart.retrieve(cartId, {
            // fields: "*items.variant,+items.product.variants.inventory_quantity",
            fields: "+billing_address.metadata,+shipping_address.metadata",
          });
        }
      }

      if (!cartResponse.cart.shipping_address?.country_code) {
        await updateCountry("pl");
      }

      // const cartResponse = await $fetch(
      //   `${config.public.medusaUrl}/store/carts/${cartId}?fields=+items.variant.inventory_quantity`,
      //   {
      //     credentials: "include",
      //     headers: {
      //       "Content-Type": "application/json",
      //       "x-publishable-api-key": config.public.medusaPublishableKey,
      //     },
      //   }
      // );

      cartObject.value = cartResponse.cart as unknown as StoreCart;

      console.log("cart when finished fetching: ", cartResponse.cart);

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
    try {
      // @ts-expect-error
      const { shipping_options } = await $fetch(
        `${config.public.medusaUrl}/store/shipping-options`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": String(config.public.medusaPublishableKey),
          },
          query: {
            cart_id: cartObject.value?.id,
          },
        }
      );

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

      const { payment_providers } =
        await medusaClient.store.payment.listPaymentProviders({
          region_id: cartObject.value.region_id!,
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
        // @ts-expect-error
        const { payment_collection } = await $fetch(
          `${config.public.medusaUrl}/store/payment-collections`,
          {
            credentials: "include",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-publishable-api-key": String(
                config.public.medusaPublishableKey
              ),
            },
            body: JSON.stringify({
              cart_id: cartObject.value.id,
            }),
          }
        );

        paymentCollectionId = payment_collection.id;
      }

      // await medusaClient.store.payment.initiatePaymentSession(
      //   // @ts-expect-error
      //   cartObject.value,
      //   {
      //     provider_id: selectedPaymentProviderId,
      //   }
      // );

      await fetchCart();

      await $fetch(
        `${config.public.medusaUrl}/store/payment-collections/${paymentCollectionId}/payment-sessions`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": config.public.medusaPublishableKey,
          },
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

      // const { type } = await medusaClient.store.cart.complete(
      //   cartObject.value.id
      // );

      //@ts-expect-error
      const { type, cart, order, error } = await $fetch(
        `${config.public.medusaUrl}/store/carts/${cartObject.value.id}/complete`,
        {
          credentials: "include",
          headers: {
            "x-publishable-api-key": String(config.public.medusaPublishableKey),
          },
          method: "POST",
        }
      );
      // cartObject.value = undefined;
      // calculateQuantity();

      // await fetchCart();

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
