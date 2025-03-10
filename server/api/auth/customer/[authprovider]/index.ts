export default defineEventHandler(async (event) => {
  if (getMethod(event) !== "POST") {
    throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
  }

  const authProvider = getRouterParam(event, "authprovider");
  const config = useRuntimeConfig();
  const body = await readBody(event); // Pobranie ciała żądania (działa tylko dla POST/PUT)

  try {
    // Wykonanie żądania do Medusa API
    const response = await $fetch.raw(
      `${config.public.medusaUrl}/auth/customer/${authProvider}`,
      {
        method: "POST", // Musisz jawnie określić metodę POST
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: getHeader(event, "cookie") || "",
        },
        body: JSON.stringify({
          email: body.email,
          password: body.password,
        }),
      }
    );

    const responseData = response._data;
    // @ts-expect-error
    const token = responseData.token;

    const setCookieHeaders =
      response.headers.getSetCookie?.() || response.headers.get("set-cookie");

    if (setCookieHeaders) {
      setCookieHeaders.forEach((cookie) => {
        appendHeader(event, "set-cookie", cookie);
      });
    }

    return { token };
  } catch (e) {
    console.log(e);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      data: e,
    });
  }
});
