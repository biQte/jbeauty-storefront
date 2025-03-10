import cart from "..";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const config = useRuntimeConfig();

  try {
    if (event.method !== "GET" && event.method !== "POST") {
      throw createError({
        statusCode: 405,
        statusMessage: "Method Not Allowed",
      });
    }

    if (event.method === "GET") {
      const response = await $fetch.raw(
        `${config.public.medusaUrl}/store/carts/${id}`,
        {
          credentials: "include",
          headers: {
            "x-publishable-api-key": config.public.medusaPublishableKey,
            Cookie: getHeader(event, "cookie") || "",
          },
          query: {
            fields: "+billing_address.metadata,+shipping_address.metadata",
          },
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

    if (event.method === "POST") {
      const body = await readBody(event);

      const response = await $fetch.raw(
        `${config.public.medusaUrl}/store/carts/${id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "x-publishable-api-key": config.public.medusaPublishableKey,
            Cookie: getHeader(event, "cookie") || "",
          },
          body: JSON.stringify({
            email: body.email ? body.email : undefined,
            billing_address: body.billing_address
              ? body.billing_address
              : undefined,
            shipping_address: body.shipping_address
              ? body.shipping_address
              : undefined,
            promo_codes: body.promo_codes ? body.promo_codes : undefined,
            metadata: body.metadata ? body.metadata : undefined,
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
    throw e;
  }
});
