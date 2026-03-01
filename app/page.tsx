import Home from "@/components/home/Home";
import { getFavorites } from "./api/productapi";
import { redirect } from "next/navigation";

export default async function Page() {
  redirect('/home/');
}