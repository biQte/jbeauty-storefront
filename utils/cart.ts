import type { Cart } from "@medusajs/client-types";

export const calculateItemsInCart = (cart: Cart): number => {
  let counter = 0;

  if (!cart.items || cart.items.length === 0) return 0;

  const items = cart.items;

  for (const item of items) {
    counter += item.quantity;
  }

  return counter;
};
