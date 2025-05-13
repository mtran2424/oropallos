/**
 * This file contains functions to interact with the product API.
 * It includes functions to create, edit, delete, and fetch products.
 */
import { Product } from "@/components/global.utils";

/**
 * Takes a product object and sends a POST request to the server to create a new product.
 * @param product 
 * @returns 
 */
export const createProduct = async (product: Product) => {
  const res = await fetch('/api/products/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    throw new Error('Failed to create product');
  }
  return res.json();
}

/**
 * Takes a product ID and sends a DELETE request to the server to remove the product.
 * @param id 
 * @param product 
 * @returns result of the edit operation
 */
export const editProduct = async (id: string, product: Product) => {
  const res = await fetch(`/api/products/update/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    throw new Error('Failed to update product');
  }
  return res.json();
}

/**
 * Takes a product ID and sends a DELETE request to the server to remove the product.
 * @param id 
 * @returns result of the delete operation
 */
export const deleteProduct = async (id: string) => {
  const res = await fetch(`/api/products/remove/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete product');
  }
  return res;
}

/**
 * Fetches all products from the server.
 * @returns {products: Product[]} - An array of products.
 */
export const getProducts = async () => {
  const res = await fetch('/api/products/get', {
    method: 'GET',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
}

export const getProduct = async (id: string) => {
  const res = await fetch(`/api/products/get/${id}`, {
    method: 'GET',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
}

export const getFavorites = async () => {
  const res = await fetch('/api/products/get/favorites', {
    method: 'GET',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
};

export const favoriteProduct = async (id: string, favorite: boolean) => {
  const res = await fetch(`/api/products/update/favorite/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ favorite: favorite }),
  });
  if (!res.ok) {
    throw new Error('Failed to update product');
  }

  return res;
}