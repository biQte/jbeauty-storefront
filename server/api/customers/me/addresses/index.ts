export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
  
    try {
      if (event.method === "GET") {
        const response = await $fetch.raw(
          `${config.public.medusaUrl}/store/customers/me/addresses`,
          {
            credentials: "include",
            headers: {
              "x-publishable-api-key": config.public.medusaPublishableKey,
              Cookie: getHeader(event, "cookie") || "",
            },
          }
        );
  
        const responseData = response._data;

        console.log("responseData", responseData);
  
        // @ts-expect-error
        const customer = responseData.addresses;
  
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
        const cookieHeader = getHeader(event, "cookie");
  
        const response = await $fetch.raw(
          `${config.public.medusaUrl}/store/customers/me/addresses`,
          {
            credentials: "include",
            method: "POST",
            headers: {
              "x-publishable-api-key": config.public.medusaPublishableKey,
              cookie: cookieHeader || "",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
            //   first_name: body.first_name,
            //   last_name: body.last_name,
              first_name: body.firstName,
              last_name: body.lastName,
              city: body.city,
              country_code: "pl",
              phone: body.phoneNumber,
              company: body.company,
              postal_code: body.postalCode,
              address_1: body.address_1,
              address_2: body.address_2,
              is_default_billing: body.is_default_billing,
              is_default_shipping: body.is_default_shipping,
              metadata: body.metadata || undefined
            // Add data to create an address
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
  