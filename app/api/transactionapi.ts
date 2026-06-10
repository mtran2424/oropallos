/**
 * This file contains functions to interact with the transaction API.
 */
import { TransactionItem, TransactionRequest } from "@/components/global.utils";

export const getTransactions = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/transactions/get`, {
    method: 'GET',
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch transactions');
  }
  return res.json();
}

export const getCurrentUserBatchTransactions = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/transactions/get/currentBatch/${id}`, {
    method: 'GET',
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch transactions');
  }
  return res.json();
}

export const getCurrentBatchTransactions = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/transactions/get/currentBatch`, {
    method: 'GET',
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch transactions');
  }
  return res.json();
}

export const createTransaction = async (transaction: TransactionRequest) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/transactions/create`, {
    method: 'POST',
    headers: {
      'Content-Type' : 'applications/json'    
    },
    body: JSON.stringify({transaction}),
  });

  if (!res.ok) {
    throw new Error('Failed to create transaction');
  }
  return res;
}

/**
 * Sets favorite status of a product.
 * 
 * @param id String
 * @param favorite Boolean
 * @returns {product: Product} - The updated product object.
 */
export const updateTransactionStatus = async (id: string, status: string, items: TransactionItem[]) => {
  const res = await fetch(`/api/transactions/update/status/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: status, items: items }),
  });
  if (!res.ok) {
    throw new Error('Failed to update transaction status');
  }

  return res;
}