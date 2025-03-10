export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  try {
    const response = await $fetch.raw(
      `${config.public.medusaUrl}/store/orders`,
      {
        credentials: "include",
        headers: {
          "x-publishable-api-key": config.public.medusaPublishableKey,
          Cookie: getHeader(event, "cookie") || "",
        },
      }
    );

    const responseData = response._data;

    // @ts-expect-error
    const orders = responseData.orders;

    const setCookieHeaders =
      response.headers.getSetCookie?.() || response.headers.get("set-cookie");

    if (setCookieHeaders) {
      setCookieHeaders.forEach((cookie) => {
        appendHeader(event, "set-cookie", cookie);
      });
    }

    return orders;
  } catch (e) {
    console.log("tego no", e);
    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching orders",
      data: e,
    });
  }
});
