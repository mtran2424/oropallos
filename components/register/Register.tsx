"use client";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Product, Transaction } from "@/components/global.utils";
import Transactions from "./Transactions";
import Manager from "./Manager";
import Close from "./Close";
import { PiCashRegister } from "react-icons/pi";
import { CiViewTable } from "react-icons/ci";
import { GoGraph } from "react-icons/go";
import { RxExit } from "react-icons/rx";
import { getProducts } from "@/app/api/adminapi";
import { getTransactions } from "@/app/api/transactionapi";

const Register = () => {
  // Admin check
  const { isSignedIn } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [page, setPage] = useState<string>("Transaction");

  useEffect(() => {
    // if user is not signed in, redirect to home page
    if (!isSignedIn) {
      console.log("signed-in")
      redirect('/');
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

    const fetchTransactions = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data.transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchProducts();
    fetchTransactions();
  }, []);

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
        className="fixed top-0 h-full w-20 text-zinc-600 bg-white z-200 border-r border-zinc-400"
      >
        <div className="grid grid-cols-1 divide-zinc-500 divide-y">
          <button
            className={`flex h-20 items-center justify-center hover:bg-zinc-400 transition-colors ease-in-out
              ${page === "Transaction" ? "bg-zinc-500 text-white" : ""}`}
            onClick={() => {
              setPage("Transaction");
            }}
          >
            <PiCashRegister size={30} />
          </button>
          <button
            className={`flex h-20 items-center justify-center hover:bg-zinc-400 transition-colors ease-in-out
              ${page === "Manager" ? "bg-zinc-500 text-white" : ""}`}
            onClick={() => {
              setPage("Manager");
            }}
          >
            <CiViewTable size={30} />
          </button>
          <button
            className={`flex h-20 items-center justify-center hover:bg-zinc-400 transition-colors ease-in-out
              ${page === "Stats" ? "bg-zinc-500 text-white" : ""}`}
            onClick={() => {
              setPage("Stats");
            }}
          >
            <GoGraph size={30} />
          </button>
          <button
            className={`flex h-20 items-center justify-center hover:bg-zinc-400 font-semibold transition-colors ease-in-out
              ${page === "Close" ? "bg-zinc-500 text-white" : ""}`}
            onClick={() => {
              setPage("Close");
            }}
          >
            X1/Z1
          </button>
          <button
            className={`flex h-20 items-center justify-center hover:bg-zinc-400 transition-colors ease-in-out`}
            onClick={() => {
              redirect("/admin/dashboard");
            }}
          >
            <RxExit size={30} />
          </button>
        </div>
      </motion.div>
      <div className="flex flex-col w-full h-full items-center justify-start pl-20">
        {page === "Transaction" && <Transactions products={products} />}
        {page === "Manager" && <Manager transactions={transactions} />}
        {page === "Close" && <Close initialTransactions={transactions} />}
      </div>
    </motion.div>
  );
}

export default Register;