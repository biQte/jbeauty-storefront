export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const id = getRouterParam(event, "id");
  const query = getQuery(event);

  try {
    const response = await $fetch.raw(
      `${config.public.medusaUrl}/store/payment-providers`,
      {
        credentials: "include",
        headers: {
          "x-publishable-api-key": config.public.medusaPublishableKey,
          Cookie: getHeader(event, "cookie") || "",
        },
        query: {
          region_id: query.region_id,
        },
      }
    );

    const responseData = response._data;

    // @ts-expect-error
    const payment_providers = responseData.payment_providers;

    const setCookieHeaders =
      response.headers.getSetCookie?.() || response.headers.get("set-cookie");

    if (setCookieHeaders) {
      setCookieHeaders.forEach((cookie) => {
        appendHeader(event, "set-cookie", cookie);
      });
    }

    return payment_providers;
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error retrieving payment providers",
      data: e,
    });
  }
});
