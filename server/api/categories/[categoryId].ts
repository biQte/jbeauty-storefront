export default defineEventHandler(async (event) => {
  const categoryId = getRouterParam(event, "categoryId");
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
          id: categoryId,
          include_descendants_tree: true,
          fields: "*category_children",
        },
      }
    );

    return product_categories;
  } catch (e) {
    throw e;
  }
});
