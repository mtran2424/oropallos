import Products from "@/components/products/Products";
import { getProducts } from "../../api/productapi";

export default async function Page() {
  const data = await getProducts();
  return (
    <Products products={data.products}/>
  );
}