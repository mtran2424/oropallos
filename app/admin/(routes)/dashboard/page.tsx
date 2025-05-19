import { getProducts } from "@/app/api/productapi";
import Dashboard from "@/components/dashboard/Dashboard";

export default async function Page() {
  const data = await getProducts();

  return (
    <Dashboard products={data.products}/>
  );
}