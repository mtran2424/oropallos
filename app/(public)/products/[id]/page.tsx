import { getProducts } from "@/app/api/productapi";
import ProductPage from "@/components/products/ProductPage"

export default async function Page() {
  const data = await getProducts();
  return (
    <ProductPage products={data.products} />
  );
}