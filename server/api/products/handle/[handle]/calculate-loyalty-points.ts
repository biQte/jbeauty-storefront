export default defineEventHandler(async (event) => {
    const handle = getRouterParam(event, "handle");
    const config = useRuntimeConfig();

    try {
        const response = await $fetch.raw(
            `${config.public.medusaUrl}/store/products/${handle}/calculate-loyalty-points`,
            {
                credentials: "include",
                headers: {
                    "x-publishable-api-key": config.public.medusaPublishableKey,
                    Cookie: getHeader(event, "cookie") || "",
                },
                method: "GET",
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
        throw e;
    }
});
