export default defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
  }

  const config = useRuntimeConfig();
  const body = await readBody(event);

  try {
    const response = await $fetch.raw(
      `${config.public.medusaUrl}/store/customers`,
      {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${body.token}`,
          "x-publishable-api-key": config.public.medusaPublishableKey,
          Cookie: getHeader(event, "cookie") || "",
        },
        body: JSON.stringify({
          first_name: body.firstName,
          last_name: body.lastName,
          email: body.email,
        }),
      }
    );

    const setCookieHeaders =
      response.headers.getSetCookie?.() || response.headers.get("set-cookie");

    if (setCookieHeaders) {
      setCookieHeaders.forEach((cookie) => {
        appendHeader(event, "set-cookie", cookie);
      });
    }

    return { success: true };
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error while creating customer",
      data: e,
    });
  }
});
