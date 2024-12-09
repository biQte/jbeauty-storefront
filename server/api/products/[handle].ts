export default defineEventHandler(async (event) => {
  const handle = getRouterParam(event, "handle");
  const config = useRuntimeConfig();

  try {
    // @ts-expect-error
    const { products } = await $fetch(
      `${config.public.medusaUrl}/store/products`,
      {
        credentials: "include",
        headers: {
          "x-publishable-api-key": config.public.medusaPublishableKey,
        },
        query: {
          handle,
          fields: "*variants.calculated_price,+variants.inventory_quantity",
        },
      }
    );

    return products;
  } catch (e) {
    throw e;
  }
});
