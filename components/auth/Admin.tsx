"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Admin = () => {
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) {
      // Redirect to home page if user is not signed in
      router.push('/admin/sign-in');
    }
  }, [user]);

  return (<></>);
}

export default Admin;