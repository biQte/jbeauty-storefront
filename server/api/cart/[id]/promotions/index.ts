export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const id = getRouterParam(event, "id");

  try {
    if (event.method !== "POST" && event.method !== "DELETE") {
      throw createError({
        statusCode: 405,
        statusMessage: "Method Not Allowed",
      });
    }

    if (event.method === "POST") {
      const body = await readBody(event);

      const response = await $fetch.raw(
        `${config.public.medusaUrl}/store/carts/${id}/promotions`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "x-publishable-api-key": config.public.medusaPublishableKey,
            Cookie: getHeader(event, "cookie") || "",
          },
          body: JSON.stringify({
            promo_codes: body.promo_codes,
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
    }

    if (event.method === "DELETE") {
      const body = await readBody(event);

      const response = await $fetch.raw(
        `${config.public.medusaUrl}/store/carts/${id}/promotions`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "x-publishable-api-key": config.public.medusaPublishableKey,
            Cookie: getHeader(event, "cookie") || "",
          },
          body: JSON.stringify({
            promo_codes: body.promo_codes,
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
    }
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching promotions",
      data: e,
    });
  }
});
