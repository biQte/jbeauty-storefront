export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  const productIds = Array.isArray(query.productIds)
    ? query.productIds
    : // @ts-expect-error
      query.productIds?.split(",");

  if (!productIds || productIds.length === 0) return;

  try {
    const result = await $fetch(`${config.public.medusaUrl}/store/products`, {
      credentials: "include",
      headers: {
        "x-publishable-api-key": config.public.medusaPublishableKey,
      },
      query: {
        id: productIds,
        fields: "*variants.calculated_price,+variants.inventory_quantity",
      },
    });

    return result;
  } catch (e) {
    throw e;
  }
});
