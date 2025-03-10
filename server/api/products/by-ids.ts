export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  const productIds = Array.isArray(query.productIds)
    ? query.productIds
    : // @ts-expect-error
      query.productIds?.split(",");

  if (!productIds || productIds.length === 0) return;

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
          id: productIds,
          fields: "*variants.calculated_price,+variants.inventory_quantity",
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
    throw e;
  }
});
