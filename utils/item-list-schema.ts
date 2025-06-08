export const getItemListSchema = (products: any[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://jbeautysklep.pl/produkt/${product.handle}`
    }))
  };
};