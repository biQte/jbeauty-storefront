export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const id = getRouterParam(event, "id");

  try {
    const body = await readBody(event);

    const response = await $fetch.raw(
      `${config.public.medusaUrl}/store/carts/${id}/shipping-methods`,
      {
        credentials: "include",
        method: "POST",
        headers: {
          "x-publishable-api-key": config.public.medusaPublishableKey,
          Cookie: getHeader(event, "cookie") || "",
        },
        body: JSON.stringify({
          option_id: body.option_id,
        }),
      }
    );

    const responseData = response._data;

    // @ts-expect-error
    const cart = responseData.cart;

    const setCookieHeaders =
      response.headers.getSetCookie?.() || response.headers.get("set-cookie");

    if (setCookieHeaders) {
      setCookieHeaders.forEach((cookie) => {
        appendHeader(event, "set-cookie", cookie);
      });
    }

    return cart;
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error adding shipping methods",
      data: e,
    });
  }
});
