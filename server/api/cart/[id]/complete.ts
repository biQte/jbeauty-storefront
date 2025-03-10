export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const id = getRouterParam(event, "id");

  try {
    const response = await $fetch.raw(
      `${config.public.medusaUrl}/store/carts/${id}/complete`,
      {
        credentials: "include",
        method: "POST",
        headers: {
          "x-publishable-api-key": config.public.medusaPublishableKey,
          Cookie: getHeader(event, "cookie") || "",
        },
      }
    );

    const responseData = response._data;

    const setCookieHeaders =
      response.headers.getSetCookie?.() || response.headers.get("set-cookie");

    if (setCookieHeaders) {
      setCookieHeaders.forEach((cookie) => {
        appendHeader(event, "set-cookie", cookie);
      });
    }

    return responseData;
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error completing cart",
      data: e,
    });
  }
});
