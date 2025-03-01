export function useRecentlyViewed() {
  const cookieName = "recently_viewed";
  const maxItems = 13;
  const recentlyViewed = useCookie<string[]>(cookieName, {
    default: () => [],
    watch: true,
    sameSite: "strict",
  });

  const addProduct = (productId: string) => {
    if (!productId) return;

    const filteredList = recentlyViewed.value.filter((id) => id !== productId);
    recentlyViewed.value = [productId, ...filteredList].slice(0, maxItems);
  };

  return { recentlyViewed, addProduct };
}
