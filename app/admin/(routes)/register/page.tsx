import { getAnnouncements } from "@/app/api/announcementapi";
import { getProducts } from "@/app/api/productapi";
import Register from "@/components/register/Register";

export default async function Page() {
  const productData = await getProducts()
  return (
    <Register />
  );
}