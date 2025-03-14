export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  try {
    // @ts-expect-error
    const { product_categories } = await $fetch(
      `${config.public.medusaUrl}/store/product-categories`,
      {
        credentials: "include",
        headers: {
          "x-publishable-api-key": config.public.medusaPublishableKey,
          Cookie: getHeader(event, "cookie") || "",
        },
        query: {
          handle: "polecane",
        },
      }
    );

    const response = await $fetch.raw(
      `${config.public.medusaUrl}/store/products`,
      {
        credentials: "include",
        headers: {
          "x-publishable-api-key": config.public.medusaPublishableKey,
          Cookie: getHeader(event, "cookie") || "",
        },
        query: {
          fields: "*variants.calculated_price,+variants.inventory_quantity",
          limit: 12,
          category_id: product_categories[0].id,
        },
      }
    );

    const responseData = response._data;

    // @ts-expect-error
    const products = responseData.products;

    const setCookieHeaders =
      response.headers.getSetCookie?.() || response.headers.get("set-cookie");

    if (setCookieHeaders) {
      setCookieHeaders.forEach((cookie) => {
        appendHeader(event, "set-cookie", cookie);
      });
    }

    return products;
  } catch (e) {
    throw e;
  }
});
