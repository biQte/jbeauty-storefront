export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  try {
    if (event.method === "GET") {
      const response = await $fetch.raw(
        `${config.public.medusaUrl}/store/customers/me`,
        {
          credentials: "include",
          headers: {
            "x-publishable-api-key": config.public.medusaPublishableKey,
            // Cookie: getHeader(event, "cookie") || "",
          },
        }
      );

      const responseData = response._data;

      // @ts-expect-error
      const customer = responseData.customer;

      const setCookieHeaders =
        response.headers.getSetCookie?.() || response.headers.get("set-cookie");

      if (setCookieHeaders) {
        setCookieHeaders.forEach((cookie) => {
          appendHeader(event, "set-cookie", cookie);
        });
      }

      return customer;
    }

    if (event.method === "POST") {
      const body = await readBody(event);

      const response = await $fetch.raw(
        `${config.public.medusaUrl}/store/customers/me`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "x-publishable-api-key": config.public.medusaPublishableKey,
          },
          body: JSON.stringify({
            first_name: body.first_name,
            last_name: body.last_name,
          }),
        }
      );

      const responseData = response._data;

      // @ts-expect-error
      const customer = responseData.customer;

      const setCookieHeaders =
        response.headers.getSetCookie?.() || response.headers.get("set-cookie");

      if (setCookieHeaders) {
        setCookieHeaders.forEach((cookie) => {
          appendHeader(event, "set-cookie", cookie);
        });
      }

      return customer;
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
});
