"use client";
import { useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
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
      className="mt-35"
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
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`px-6 py-3 text-md z-10 ${tab === 'products'
              ? 'bg-white text-zinc-900'
              : 'text-blue-500 hover:text-zinc-700 bg-zinc-100'
              } rounded-t-xl shadow-t-xl border-t-1 border-r-1 border-zinc-300`}
            onClick={() => setTab('products')}
            disabled={tab === 'products'}
          >
            Products
          </motion.button>

          <motion.button
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`px-6 py-3 text-md z-10 ${tab === 'announcements'
              ? 'bg-white text-zinc-900'
              : 'text-blue-500 hover:text-zinc-700 bg-zinc-100'
              } rounded-t-xl shadow-t-xl border-t-1 border-r-1 border-zinc-300`}
            onClick={() => setTab('announcements')}
            disabled={tab === 'announcements'}
          >
            Announcements
          </motion.button>
        </div>

        {/* Spreadsheets */}
        <AnimatePresence mode="wait">
          {tab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-10"
            >
              <ProductsSpreadsheet initialProducts={products} />
            </motion.div>
          )}
          {tab === 'announcements' && (
            <motion.div
              key="announcements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-10"
            >
              <AnnouncementsSpreadsheet initialAnnouncements={announcements} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default Dashboard;