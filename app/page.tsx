import Home from "@/components/home/Home";
import { getFavorites } from "./api/productapi";

export default async function Page() {
  const data = await getFavorites();
  return ( 
    <Home favorites={data.products}/>
   );
}