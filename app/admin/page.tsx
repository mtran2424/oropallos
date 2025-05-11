"use client";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = () => {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    // Redirect to home page if user is not signed in
    redirect('/admin/sign-in');
  }
  return ( <></> );
}
 
export default Page;