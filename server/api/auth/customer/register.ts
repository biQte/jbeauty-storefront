export default defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
  }

  const config = useRuntimeConfig();
  const body = await readBody(event);

  try {
    const response = await $fetch.raw(
      `${config.public.medusaUrl}/auth/customer/emailpass/register`,
      {
        credentials: "include",
        method: "POST",
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

    return token;
  } catch (e: any) {
    console.log(e);
    if (e.response) {
      const errorData = e.response;

      console.log(errorData);

      if (errorData?._data.message === "Identity with email already exists") {
        throw createError({
          statusCode: 401,
          statusMessage: "Identity with email already exists",
          data: errorData,
        });
      }
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Error while creating account",
      data: e,
    });
  }
});
