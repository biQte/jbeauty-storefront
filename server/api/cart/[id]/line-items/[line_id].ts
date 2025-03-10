import { FetchError } from "ohmyfetch";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const cartId = getRouterParam(event, "id");
  const lineId = getRouterParam(event, "line_id");

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
        `${config.public.medusaUrl}/store/carts/${cartId}/line-items/${lineId}`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "x-publishable-api-key": config.public.medusaPublishableKey,
            Cookie: getHeader(event, "cookie") || "",
          },
          body: JSON.stringify({
            quantity: body.quantity,
            metadata: body.metadata,
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
      const response = await $fetch.raw(
        `${config.public.medusaUrl}/store/carts/${cartId}/line-items/${lineId}`,
        {
          credentials: "include",
          method: "DELETE",
          headers: {
            "x-publishable-api-key": config.public.medusaPublishableKey,
            Cookie: getHeader(event, "cookie") || "",
          },
        }
      );

      const responseData = response._data;

      // @ts-expect-error
      const cart = responseData.parent;

      const setCookieHeaders =
        response.headers.getSetCookie?.() || response.headers.get("set-cookie");

      if (setCookieHeaders) {
        setCookieHeaders.forEach((cookie) => {
          appendHeader(event, "set-cookie", cookie);
        });
      }

      return cart;
    }
  } catch (e: any) {
    if (e.response) {
      const errorData = e.response;

      if (errorData?._data.code === "insufficient_inventory") {
        throw createError({
          statusCode: 400,
          statusMessage: "Some variant does not have the required inventory",
          data: errorData,
        });
      }

      throw createError({
        statusCode: e.response.status || 500,
        statusMessage: errorData?.message || "Unknown error from Medusa API",
        data: errorData,
      });
    }

    // Jeśli to nie jest FetchError, rzuć ogólny błąd serwera
    throw createError({
      statusCode: 500,
      statusMessage: "Error updating line item",
      data: e,
    });
  }
});
