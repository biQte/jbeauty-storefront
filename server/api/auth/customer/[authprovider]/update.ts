export default defineEventHandler(async (event) => {
  if (getMethod(event) !== "POST") {
    throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
  }

  const authProvider = getRouterParam(event, "authprovider");
  const config = useRuntimeConfig();
  const authorization = getHeader(event, "Authorization");
  const body = await readBody(event); // Pobranie ciała żądania (działa tylko dla POST/PUT)

  try {
    console.log(authorization);
    // Wykonanie żądania do Medusa API
    const response = await $fetch.raw(
      `${config.public.medusaUrl}/auth/customer/${authProvider}/update`,
      {
        method: "POST", // Musisz jawnie określić metodę POST
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: getHeader(event, "cookie") || "",
          Authorization: authorization!,
        },
        body: JSON.stringify({
          email: body.email,
          password: body.password,
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
      statusMessage: "Internal Server Error",
      data: e,
    });
  }
});
