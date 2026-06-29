import { InventoryRequest, OrderItem } from "@/components/global.utils";

/**
 * Fetches all products from the server.
 * @returns {products: Product[]} - An array of products.
 */
export const getProducts = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/products/get`, {
    method: 'GET',
    cache: 'no-store',
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
}

/**
 * Fetches a single product by its ID from the server.
 * 
 * @param id string
 * @returns {product: Product} - The product object.
 */
export const getProduct = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/products/get/${id}`, {
    method: 'GET',
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
}

/**
 * Fetches all products marked as favorites from the server.
 * 
 * @returns {products: Product[]} - An array of products.
 */
export const getFavorites = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/products/get/favorites`, {
    method: 'GET',
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
};

export const updateInventory = async (order: InventoryRequest) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/products/update/inventory`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ order }),
  });

  if (!res.ok) {
    throw new Error('Failed to update inventory');
  }
  return res;
}