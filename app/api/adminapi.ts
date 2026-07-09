import { Discount, InventoryRequest, OrderItem, QuickAddButton } from "@/components/global.utils";

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

export const createQuickAddButton = async (button: QuickAddButton) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/quick-add-buttons/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(button),
  });

  if (!res.ok) {
    throw new Error('Failed to create quick add button');
  }
  return res.json();
}

export const getQuickAddButtons = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/quick-add-buttons/get`, {
    method: 'GET',
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch buttons');
  }
  return res.json();
}

export const deleteQuickAddButton = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/quick-add-buttons/remove/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete button');
  }
  return res;
}

export const editQuickAddButton = async (button: QuickAddButton) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/quick-add-buttons/update/${button.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(button),
  });

  if (!res.ok) {
    throw new Error('Failed to update quick add button');
  }
  return res;
}

export const createDiscount = async (discount: Discount) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/discounts/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(discount),
  });

  if (!res.ok) {
    throw new Error('Failed to create discounts');
  }
  return res.json();
}

export const getDiscount = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/discounts/get`, {
    method: 'GET',
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch discounts');
  }
  return res.json();
}

export const deleteDiscount = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/discounts/remove/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete discounts');
  }
  return res;
}

export const editDiscount = async (discount: Discount) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/discounts/update/${discount.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(discount),
  });

  if (!res.ok) {
    throw new Error('Failed to update discounts');
  }
  return res;
}