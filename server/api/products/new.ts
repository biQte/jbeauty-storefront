export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const query = getQuery(event);

  // @ts-expect-error
  const limit = query.limit ? parseInt(query.limit, 10) : 12;

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
          fields: "*variants.calculated_price,+variants.inventory_quantity",
          limit: limit,
          order: "-created_at",
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
    console.log(products);
    return products;
  } catch (e) {
    console.log(e);
    throw e;
  }
});
