export default defineEventHandler(async (event) => {
  const handle = getRouterParam(event, "handle");
  const config = useRuntimeConfig();

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
          handle,
          fields:
            "+metadata,*categories,*variants.calculated_price,+variants.inventory_quantity",
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
