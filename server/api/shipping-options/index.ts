export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  try {
    const query = getQuery(event);

    console.log(query);

    const response = await $fetch.raw(
      `${config.public.medusaUrl}/store/shipping-options`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": config.public.medusaPublishableKey,
          Cookie: getHeader(event, "cookie") || "",
        },
        query: {
          cart_id: query.cart_id,
        },
      }
    );

    const responseData = response._data;

    // @ts-expect-error
    const shipping_options = responseData.shipping_options;

    const setCookieHeaders =
      response.headers.getSetCookie?.() || response.headers.get("set-cookie");

    if (setCookieHeaders) {
      setCookieHeaders.forEach((cookie) => {
        appendHeader(event, "set-cookie", cookie);
      });
    }

    return shipping_options;
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error getting shipping methods",
      data: e,
    });
  }
});
