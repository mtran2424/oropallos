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