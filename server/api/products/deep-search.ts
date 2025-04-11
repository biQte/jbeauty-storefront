export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  const productQuery = query.q;
  const limit = query.limit || 0;
  const offset = query.offset || 0;

  try {
    const response = await $fetch.raw(
      `${config.public.medusaUrl}/store/deep-search-products`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": config.public.medusaPublishableKey,
          Cookie: getHeader(event, "cookie") || "",
        },
        query: {
          q: productQuery,
          limit,
          offset,
          //   fields: "*variants.calculated_price,+variants.inventory_quantity",
        },
      }
    );

    const responseData = response._data;

    const setCookieHeaders =
      response.headers.getSetCookie?.() || response.headers.get("set-cookie");

    if (setCookieHeaders) {
      setCookieHeaders.forEach((cookie) => {
        appendHeader(event, "set-cookie", cookie);
      });
    }

    return responseData;
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching products",
      data: e,
    });
  }
});
