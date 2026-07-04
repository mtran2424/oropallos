"use client";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const Admin = () => {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isSignedIn) {
      // Redirect to home page if user is not signed in
      redirect('/admin/sign-in');
    }
  }, [user]);

  return (<></>);
}

export default Admin;