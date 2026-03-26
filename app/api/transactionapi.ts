/**
 * This file contains functions to interact with the transaction API.
 */
import { TransactionItem } from "@/components/global.utils";

export const getTransactions = async () => {
  const res = await fetch('/api/transactions/get', {
    method: 'GET',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch orders');
  }
  return res.json();
}


export const createTransaction = async (items: TransactionItem[]) => {
  const res = await fetch('/api/transactions/create', {
    method: 'POST',
    headers: {
      'Content-Type' : 'applications/json'    
    },
    body: JSON.stringify({items}),
  });

  if (!res.ok) {
    throw new Error('Failed to create transaction');
  }
  return res;
}