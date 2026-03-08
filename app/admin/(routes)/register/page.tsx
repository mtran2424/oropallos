import { getAnnouncements } from "@/app/api/announcementapi";
import { getProducts } from "@/app/api/productapi";
import Register from "@/components/register/Register";

export default async function Page() {
  const data = await getProducts();
  return (
    <Register products={data.products}/>
  );
}