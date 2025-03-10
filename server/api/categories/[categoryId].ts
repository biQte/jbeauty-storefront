export default defineEventHandler(async (event) => {
  const categoryId = getRouterParam(event, "categoryId");
  const config = useRuntimeConfig();

  try {
    const response = await $fetch.raw(
      `${config.public.medusaUrl}/store/product-categories`,
      {
        credentials: "include",
        headers: {
          "x-publishable-api-key": config.public.medusaPublishableKey,
          Cookie: getHeader(event, "cookie") || "",
        },
        query: {
          id: categoryId,
          include_descendants_tree: true,
          fields: "*category_children",
        },
      }
    );

    const responseData = response._data;

    // @ts-expect-error
    const product_categories = responseData.product_categories;

    const setCookieHeaders =
      response.headers.getSetCookie?.() || response.headers.get("set-cookie");

    if (setCookieHeaders) {
      setCookieHeaders.forEach((cookie) => {
        appendHeader(event, "set-cookie", cookie);
      });
    }

    return product_categories;
  } catch (e) {
    throw e;
  }
});
