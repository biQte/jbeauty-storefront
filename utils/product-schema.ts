export const getProductSchema = (product: any) => {
  const mainImage = product.thumbnail || product.images?.[0]?.url || '';
  const productUrl = `https://jbeautysklep.pl/produkt/${product.handle}`;

  const brandCategoryId = useRuntimeConfig().public.brandsCategoryID;

  const brandCategory = product.categories?.find((cat: any) =>
    cat.parent_category_id === brandCategoryId
  );

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.metadata?.seoTitle || product.title,
    "description": product.metadata?.seoDescription || product.description,
    "image": [mainImage],
    "sku": product.variants[0].sku || product.id,
    "brand": {
      "@type": "Brand",
      "name": brandCategory.name || "JBeauty"
    },
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "PLN",
      "price": (product.variants?.[0]?.calculated_price?.calculated_amount),
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.variants?.[0]?.inventory_quantity > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock"
    }
  };
};