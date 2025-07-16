"use client";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import ProductsSpreadsheet from "./ProductsSpreadsheet";
import { Announcement, Product } from "@/components/global.utils";
import AnnouncementsSpreadsheet from "./AnnouncementsSpreadsheet";

const Dashboard = ({ products, announcements }: { products: Product[], announcements: Announcement[] }) => {
  const [tab, setTab] = useState<'products' | 'announcements'>('products');

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

        {/* Tab Buttons */}
        <div className="flex flex-row justify-center relative w-full bg-zinc-200">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className={`px-6 py-3 text-md z-10 ${tab === 'products'
              ? 'bg-white text-zinc-900'
              : 'text-blue-500 hover:text-zinc-700 bg-zinc-200'
              } rounded-t-xl shadow-t-xl border-t-1 border-r-1 border-zinc-300`}
            onClick={() => setTab('products')}
            disabled={tab === 'products'}
          >
            Products
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className={`px-6 py-3 text-md z-10 ${tab === 'announcements'
              ? 'bg-white text-zinc-900'
              : 'text-blue-500 hover:text-zinc-700 bg-zinc-200'
              } rounded-t-xl shadow-t-xl border-t-1 border-r-1 border-zinc-300`}
            onClick={() => setTab('announcements')}
            disabled={tab === 'announcements'}
          >
            Announcements
          </motion.button>
        </div>

        {/* Spreadsheets */}
        {tab === 'products' && <ProductsSpreadsheet initialProducts={products} />}
        {tab === 'announcements' && <AnnouncementsSpreadsheet initialAnnouncements={announcements} />}
      </div>
    </motion.div>
  );
}

export default Dashboard;