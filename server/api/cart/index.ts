export default defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
  }

  const config = useRuntimeConfig();
  const body = await readBody(event);

  try {
    const response = await $fetch.raw(
      `${config.public.medusaUrl}/store/carts/`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": config.public.medusaPublishableKey,
          Cookie: getHeader(event, "cookie") || "",
        },
        body: JSON.stringify({
          items: body.items,
          region_id: config.public.regionID,
          sales_channel_id: config.public.sales_channel_id,
        }),
      }
    );

    const responseData = response._data;

    const cart = responseData;

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
      statusMessage: "Error while creating cart",
      data: e,
    });
  }
});
