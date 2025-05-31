export default defineEventHandler(async (event) => {
    if (event.method !== 'POST' && event.method !== 'DELETE') {
        return sendError(event, createError({ statusCode: 405, statusMessage: 'Method Not Allowed' }));
    }

    const id = getRouterParam(event, "id");
    const config = useRuntimeConfig();

    if(event.method === "POST"){
        console.log("Adding loyalty points to cart:", id);
        try {
            const response = await $fetch.raw(
                `${config.public.medusaUrl}/store/carts/${id}/loyalty-points`,
                {
                    credentials: "include",
                    headers: {
                        "x-publishable-api-key": config.public.medusaPublishableKey,
                        Cookie: getHeader(event, "cookie") || "",
                    },
                    method: "POST",
                }
            );
    
            const responseData = response._data;
    
            console.log("Response data:", responseData);

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
    }

    if(event.method === 'DELETE') {
        try {
            const response = await $fetch.raw(
                `${config.public.medusaUrl}/store/carts/${id}/loyalty-points`,
                {
                    credentials: "include",
                    headers: {
                        "x-publishable-api-key": config.public.medusaPublishableKey,
                        Cookie: getHeader(event, "cookie") || "",
                    },
                    method: "DELETE",
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
    }
});

