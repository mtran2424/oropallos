/**
 * This file contains functions to interact with the transaction API.
 */
import { TransactionRequest } from "@/components/global.utils";

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

export const getCurrentBatchTransactions = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/transactions/get/currentBatch/${id}`, {
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