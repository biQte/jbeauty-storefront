export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const config = useRuntimeConfig();

  try {
    const response = await $fetch.raw(
      `${config.public.medusaUrl}/store/products/${id}`,
      {
        credentials: "include",
        headers: {
          "x-publishable-api-key": config.public.medusaPublishableKey,
          Cookie: getHeader(event, "cookie") || "",
        },
        query: {
          fields:
            "+metadata,*categories,*variants.calculated_price,+variants.inventory_quantity",
        },
      }
    );

    const responseData = response._data;

    // @ts-expect-error
    const products = responseData.products;

    console.log("products", products);

    const setCookieHeaders =
      response.headers.getSetCookie?.() || response.headers.get("set-cookie");

    if (setCookieHeaders) {
      setCookieHeaders.forEach((cookie) => {
        appendHeader(event, "set-cookie", cookie);
      });
    }

    return products;
  } catch (e: any) {
    console.log("fetch error", e);

    if (e.response && e.response.status === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: "Not Found",
        data: "Product not found",
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      data: "Failed to fetch product data",
    });
  }
});
