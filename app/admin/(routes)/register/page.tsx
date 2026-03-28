import { getAnnouncements } from "@/app/api/announcementapi";
import { getProducts } from "@/app/api/productapi";
import { getTransactions } from "@/app/api/transactionapi";
import Register from "@/components/register/Register";

export default async function Page() {
  const productData = await getProducts();
  const transactionData = await getTransactions();
  return (
    <Register products={productData.products} transactions={transactionData.transactions}/>
  );
}