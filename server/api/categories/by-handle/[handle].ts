export default defineEventHandler(async (event) => {
  const handle = getRouterParam(event, "handle");
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
          handle,
        },
      }
    );

    return product_categories;
  } catch (e) {
    throw e;
  }
});
