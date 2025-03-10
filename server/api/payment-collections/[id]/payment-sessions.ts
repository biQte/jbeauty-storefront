export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const id = getRouterParam(event, "id");

  try {
    const body = await readBody(event);

    const response = await $fetch.raw(
      `${config.public.medusaUrl}/store/payment-collections/${id}/payment-sessions`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "x-publishable-api-key": config.public.medusaPublishableKey,
          Cookie: getHeader(event, "cookie") || "",
        },
        body: JSON.stringify({
          provider_id: body.provider_id,
        }),
      }
    );

    const responseData = response._data;

    // @ts-expect-error
    const payment_collection = responseData.payment_collection;

    const setCookieHeaders =
      response.headers.getSetCookie?.() || response.headers.get("set-cookie");

    if (setCookieHeaders) {
      setCookieHeaders.forEach((cookie) => {
        appendHeader(event, "set-cookie", cookie);
      });
    }

    return payment_collection;
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error initializing payment session of payment collection",
      data: e,
    });
  }
});
