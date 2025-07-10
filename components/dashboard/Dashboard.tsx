"use client";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import ProductsSpreadsheet from "./ProductsSpreadsheet";
import { Announcement, Product } from "@/components/global.utils";
import AnnouncementsSpreadsheet from "./AnnouncementsSpreadsheet";

const Dashboard = ({ products, announcements }: { products: Product[], announcements: Announcement[] }) => {
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
      <div className="flex flex-col w-full h-full min-h-screen items-center justify-start">
        {/* Header */}
        <h1
          className="text-2xl sm:text-2xl font-serif font-semibold text-center sm:text-start text-red-900 mb-4">
          Administrative Dashboard
        </h1>

        {/* Spreadsheets */}
        <ProductsSpreadsheet initialProducts={products} />
        <AnnouncementsSpreadsheet initialAnnouncements={announcements} />
      </div>
    </motion.div>
  );
}

export default Dashboard;