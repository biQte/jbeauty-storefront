export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  try {
    // @ts-expect-error
    const { product_categories } = await $fetch(
      `${config.public.medusaUrl}/store/product-categories`,
      {
        credentials: "include",
        headers: {
          "x-publishable-api-key": config.public.medusaPublishableKey,
        },
        query: {
          handle: "polecane",
        },
      }
    );

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
          category_id: product_categories[0].id,
        },
      }
    );

    return products;
  } catch (e) {
    throw e;
  }
});
