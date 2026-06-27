"use client";
import { useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import ProductsSpreadsheet from "./ProductsSpreadsheet";
import { Announcement, Product } from "@/components/global.utils";
import AnnouncementsSpreadsheet from "./AnnouncementsSpreadsheet";
import { getProducts } from "@/app/api/adminapi";
import { getAnnouncements } from "@/app/api/announcementapi";
import InventoryMenu from "./InventoryMenu";
import Orders from "./Orders";

const Dashboard = () => {
  const [tab, setTab] = useState<'products' | 'announcements' | 'inventory' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Admin check
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    // if user is not signed in, redirect to home page
    if (!isSignedIn) {
      redirect('/home');
    }
    else if (user && user.username !== "admin") {
      redirect('/admin/register');
    }
  }, [isSignedIn]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements();
        setAnnouncements(data.announcements);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchProducts();
    fetchAnnouncements();
  }, []);

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
        <div className="grid grid-cols-5">
          <motion.button
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`px-6 py-3 text-md z-10 ${tab === 'products'
              ? 'bg-white text-zinc-900'
              : 'text-blue-500 hover:text-zinc-700 bg-zinc-100'
              } rounded-t-xl shadow-t-xl border-t border-r border-zinc-300`}
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
              } rounded-t-xl shadow-t-xl border-t border-r border-zinc-300`}
            onClick={() => setTab('announcements')}
            disabled={tab === 'announcements'}
          >
            Announcements
          </motion.button>

          <motion.button
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`px-6 py-3 text-md z-10 ${tab === 'inventory'
              ? 'bg-white text-zinc-900'
              : 'text-blue-500 hover:text-zinc-700 bg-zinc-100'
              } rounded-t-xl shadow-t-xl border-t border-r border-zinc-300`}
            onClick={() => setTab('inventory')}
            disabled={tab === 'inventory'}
          >
            Inventory
          </motion.button>

          <motion.button
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`px-6 py-3 text-md z-10 ${tab === 'orders'
              ? 'bg-white text-zinc-900'
              : 'text-blue-500 hover:text-zinc-700 bg-zinc-100'
              } rounded-t-xl shadow-t-xl border-t border-r border-zinc-300`}
            onClick={() => setTab('orders')}
            disabled={tab === 'orders'}
          >
            Orders
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
              className="mt-5"
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
              className="mt-5"
            >
              <AnnouncementsSpreadsheet initialAnnouncements={announcements} />
            </motion.div>
          )}

          {tab === 'inventory' && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-5"
            >
              <InventoryMenu initialProducts={products} />
            </motion.div>
          )}

          {tab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-5"
            >
              <Orders initialProducts={products} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default Dashboard;