import { SaleRequest } from "@/components/global.utils";

export const createPayment = async (sale: SaleRequest) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/payment/sale`, {
    method: 'POST',
    headers: {
      'Content-Type' : 'applications/json'    
    },
    body: JSON.stringify(sale),
  });

  if (!res.ok) {
    throw new Error(res.statusText || 'Failed to create payment');
  }
  return res;
}