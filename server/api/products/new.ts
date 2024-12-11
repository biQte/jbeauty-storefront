export default defineEventHandler(async (event) => {
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
          fields: "*variants.calculated_price,+variants.inventory_quantity",
          limit: 12,
          order: "-created_at",
        },
      }
    );

    return products;
  } catch (e) {
    throw e;
  }
});
