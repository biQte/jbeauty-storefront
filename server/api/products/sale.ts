export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  // @ts-expect-error
  const limit = query.limi ? parseInt(query.limit, 10) : 12;
  // @ts-expect-error
  const offset = query.offset ? parseInt(query.offset, 10) : 0;

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
          handle: "wyprzedaz",
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
          limit,
          offset,
          category_id: product_categories[0].id,
        },
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
    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching products on sale",
      data: e,
    });
  }
});
