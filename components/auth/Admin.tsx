"use client";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Admin = () => {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    // Redirect to home page if user is not signed in
    redirect('/admin/sign-in');
  }
  else {
    redirect("/home")
  }
  return ( <></> );
}
 
export default Admin;