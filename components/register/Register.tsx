"use client";
import { useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Announcement, Product } from "@/components/global.utils";
import Transaction from "./Transaction";

const Register = ({ products }: { products: Product[] }) => {
  // Admin check
  const { isSignedIn } = useUser();
  const [page, setPage] = useState<string>("Transaction");

  useEffect(() => {
    // if user is not signed in, redirect to home page
    if (!isSignedIn) {
      console.log("signed-in")
      redirect('/');
    }
  }, [isSignedIn]);

  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full h-15 text-white bg-zinc-700 z-50"
      >
        <div className="grid grid-cols-4">
          <button
            className="flex h-15 items-center justify-center border-x border-white hover:bg-zinc-400 transition-colors ease-in-out"
            onClick={() => {
              setPage("Transaction")
            }}
          >
            Transaction
          </button>
          <button
            className="flex h-15 items-center justify-center border-x border-white hover:bg-zinc-400 transition-colors ease-in-out"
            onClick={() => {
              setPage("Manager")
            }}
          >
            Manager
          </button>
          <button
            className="flex h-15 items-center justify-center border-x border-white hover:bg-zinc-400 transition-colors ease-in-out"
            onClick={() => {
              setPage("Journal")
            }}
          >
            Journal
          </button>
          <button
            className="flex h-15 items-center justify-center border-x border-white hover:bg-zinc-400 transition-colors ease-in-out"
            onClick={() => {
              setPage("Close")
            }}
          >
            Close
          </button>
        </div>
      </motion.div>
      <div className="flex flex-col w-full h-full items-center justify-start mt-20">

        {page === "Transaction" && <Transaction products={products}/>}

        {/* Spreadsheets */}
        {/* <AnimatePresence mode="wait">
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
        </AnimatePresence> */}
      </div>
    </motion.div>
  );
}

export default Register;