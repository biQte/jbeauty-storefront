export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    try{
        if(event.method !== "POST" && event.method !== "DELETE"){
            throw createError({
                statusCode: 405,
                statusMessage: "Method Not Allowed",
                message: "Method Not Allowed",
            });
        }

        if(event.method === "POST"){
            const address = await getRouterParam(event, "address");
            const body = await readBody(event);
            const cookieHeader = getHeader(event, "cookie");

            const response = await $fetch.raw(
                `${config.public.medusaUrl}/store/customers/me/addresses/${address}`,
                {
                    credentials: "include",
                    method: "POST",
                    headers: {
                        "x-publishable-api-key": config.public.medusaPublishableKey,
                        cookie: cookieHeader || "",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        first_name: body.firstName,
                        last_name: body.lastName,
                        address_1: body.address_1,
                        address_2: body.address_2,
                        company: body.company,
                        city: body.city,
                        country_code: "pl", // możesz dynamicznie to przekazać
                        postal_code: body.postalCode,
                        phone: body.phoneNumber,
                        is_default_billing: body.is_default_billing,
                        is_default_shipping: body.is_default_shipping,
                        metadata: body.metadata || undefined
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

        if(event.method === "DELETE"){
            const address = await getRouterParam(event, "address");
            const cookieHeader = getHeader(event, "cookie");

            const response = await $fetch.raw(
                `${config.public.medusaUrl}/store/customers/me/addresses/${address}`,
                {
                    credentials: "include",
                    method: "DELETE",
                    headers: {
                        "x-publishable-api-key": config.public.medusaPublishableKey,
                        cookie: cookieHeader || "",
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
    } catch(e){
        throw e;
    }
});