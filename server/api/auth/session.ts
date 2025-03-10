export default defineEventHandler(async (event) => {
  // Sprawdzenie czy żądanie to POST

  const config = useRuntimeConfig();
  // Pobranie ciała żądania
  // Pobranie tokena z requestu (zakładam, że token jest przesyłany w body)

  try {
    if (event.method === "POST") {
      const body = await readBody(event);
      const token = body.token;
      if (!token) {
        throw createError({
          statusCode: 400,
          statusMessage: "Token is required",
        });
      }

      const response = await $fetch.raw(
        `${config.public.medusaUrl}/auth/session`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            // Cookie: getHeader(event, "cookie") || "",
          },
        }
      );

      // const setCookieHeaders =
      //   response.headers.getSetCookie?.() || response.headers.get("set-cookie");

      // if (setCookieHeaders) {
      //   setCookieHeaders.forEach((cookie) => {
      //     appendHeader(event, "set-cookie", cookie);
      //   });
      // }

      // Medusa nie zwraca ciała odpowiedzi w tym endpoincie, zwróć domyślną wartość
      return { success: true };
    }

    if (event.method === "DELETE") {
      await $fetch.raw(`${config.public.medusaUrl}/auth/session`, {
        credentials: "include",
        method: "DELETE",
        headers: {
          "x-publishable-api-key": config.public.medusaPublishableKey,
          Cookie: getHeader(event, "cookie") || "",
        },
      });

      // const setCookieHeaders =
      //   response.headers.getSetCookie?.() || response.headers.get("set-cookie");

      // if (setCookieHeaders) {
      //   setCookieHeaders.forEach((cookie) => {
      //     appendHeader(event, "set-cookie", cookie);
      //   });
      // }
      return { success: true };
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error while authenticating session",
      data: error,
    });
  }
});
