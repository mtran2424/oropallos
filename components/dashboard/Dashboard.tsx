"use client";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import ProductsSpreadsheet from "./ProductsSpreadsheet";

const Dashboard = () => {
  // Admin check
  const { isSignedIn } = useUser();

  useEffect(() => {
    // if user is not signed in, redirect to home page
    if (!isSignedIn) {
      redirect('/');
    }
  }, [isSignedIn]);

  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="mt-25"
    >
      <div className="flex flex-col w-full h-screen items-center justify-start">
        Administrative Dashboard

        <ProductsSpreadsheet />
      </div>
    </motion.div>
  );
}

export default Dashboard;