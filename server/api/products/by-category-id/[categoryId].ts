export default defineEventHandler(async (event) => {
  const categoryId = getRouterParam(event, "categoryId");
  // const limit = getRouterParam(event, "limit");
  // const offset = getRouterParam(event, "offset");
  const config = useRuntimeConfig();
  const query = getQuery(event);

  const categoryIds = Array.isArray(query.categoryIds)
    ? query.categoryIds
    : // @ts-expect-error
      query.categoryIds?.split(",");
  // @ts-expect-error
  const offset = query.offset ? parseInt(query.offset, 10) : 0;
  // @ts-expect-error
  const limit = query.limit ? parseInt(query.limit, 10) : 20;

  try {
    const response = await $fetch.raw(
      `${config.public.medusaUrl}/store/products`,
      {
        credentials: "include",
        headers: {
          "x-publishable-api-key": config.public.medusaPublishableKey,
          Cookie: getHeader(event, "cookie") || "",
        },
        query: {
          category_id: categoryId,
          offset,
          limit,
          fields: "*variants.calculated_price,+variants.inventory_quantity",
        },
      }
    );

    const responseData = response._data;

    // @ts-expect-error
    const products = responseData.products;

    const setCookieHeaders =
      response.headers.getSetCookie?.() || response.headers.get("set-cookie");

    if (setCookieHeaders) {
      setCookieHeaders.forEach((cookie) => {
        appendHeader(event, "set-cookie", cookie);
      });
    }

    return products;
  } catch (e) {
    throw e;
  }
});
