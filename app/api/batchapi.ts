import { BatchRequest } from "@/components/global.utils";

export const getBatches = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/batches/get`, {
    method: 'GET',
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch batches');
  }
  return res.json();
}

export const createBatch = async (batch: BatchRequest) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/batches/create`, {
    method: 'POST',
    headers: {
      'Content-Type' : 'applications/json'    
    },
    body: JSON.stringify({batch}),
  });

  if (!res.ok) {
    throw new Error('Failed to create batch');
  }
  return res;
}