import { getAnnouncements } from "@/app/api/announcementapi";
import { getProducts } from "@/app/api/productapi";
import Dashboard from "@/components/dashboard/Dashboard";

export default async function Page() {
  const productData = await getProducts()
  const announcementData = await getAnnouncements();
  return (
    <Dashboard products={productData.products} announcements={announcementData.announcements} />
  );
}