/**
 * This file contains functions to interact with the product API.
 * It includes functions to create, edit, delete, and fetch products.
 */
import { Announcement } from "@/components/global.utils";

/**
 * Takes a announcement object and sends a POST request to the server to create a new announcement.
 * @param announcement
 * @returns
 */
export const createAnnouncement = async (announcement: Announcement) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/announcements/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(announcement),
  });
  if (!res.ok) {
    throw new Error('Failed to create announcement');
  }
  return res.json();
}

/**
 * Takes a product ID and sends a DELETE request to the server to remove the product.
 * @param id 
 * @param product 
 * @returns result of the edit operation
 */
export const editAnnouncement = async (id: string, announcement: Announcement) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/announcements/update/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(announcement),
  });
  if (!res.ok) {
    throw new Error('Failed to update announcement');
  }
  return res.json();
}

/**
 * Takes a announcement ID and sends a DELETE request to the server to remove the announcement.
 * @param id
 * @returns result of the delete operation
 */
export const deleteAnnouncement = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/announcements/remove/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete announcement');
  }
  return res;
}

/**
 * Fetches all announcements from the server.
 * @returns {announcements: Announcement[]} - An array of announcements.
 */
export const getAnnouncements = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/announcements/get`, {
    method: 'GET',
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch announcements');
  }
  return res.json();
}

/**
 * Fetches a single product by its ID from the server.
 * 
 * @param id string
 * @returns {announcement: Announcement} - The announcement object.
 */
export const getAnnouncement = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/announcements/get/${id}`, {
    method: 'GET',
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch announcements');
  }
  return res.json();
}