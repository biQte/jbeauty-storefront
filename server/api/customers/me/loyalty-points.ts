export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    try{
        if(event.method !== "GET"){
            throw createError({
                statusCode: 405,
                statusMessage: "Method Not Allowed",
                message: "Method Not Allowed",
            });
        }

        const response = await $fetch.raw(
            `${config.public.medusaUrl}/store/customers/me/loyalty-points`, {
                credentials: "include",
                method: "GET",
                headers: {
                    "x-publishable-api-key": config.public.medusaPublishableKey,
                    Cookie: getHeader(event, "cookie") || "",
                }
            }
        );

        const responseData = response._data;

        console.log(responseData);

        const setCookieHeaders = response.headers.getSetCookie?.() || response.headers.get('set-cookie');

        if(setCookieHeaders){
            setCookieHeaders.forEach((cookie) => {
                appendHeader(event, "set-cookie", cookie);
            });
        }

        return responseData;
    } catch(error){
        throw error;
    }
});