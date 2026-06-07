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
import { IoIosSettings, IoMdClose } from "react-icons/io";
import Settings from "./Settings";
import { FaRegSquare } from "react-icons/fa";

const Register = () => {
  // Admin check
  const { isSignedIn } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [page, setPage] = useState<string>("Transaction");


  const openCustomerDisplay = () => {
    window.open(
      "/admin/customer-display",
      "customerDisplay",
      "width=1920,height=1080"
    );
  };

  openCustomerDisplay();

  // Function to toggle fullscreen mode
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };


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

  // hook to listen for fullscreen changes and update state accordingly
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
    };
  }, []);


  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {/* Fullscreen toggle button */}
      <div className="absolute top-4 right-4">
        {isFullscreen ? (
          <motion.div
            key={"close"}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => toggleFullscreen()}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="hover:text-[#FFBA04]"
          >
            <IoMdClose size={20} />
          </motion.div>
        ) : (
          <motion.div
            key={"fullscreen"}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            onClick={() => toggleFullscreen()}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="hover:text-[#FFBA04]"
          >
            <FaRegSquare size={20} />
          </motion.div>
        )}
      </div>
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
          <button
            className={`flex h-20 items-center justify-center hover:bg-zinc-400 transition-colors ease-in-out`}
            onClick={() => {
              setPage("Settings");
            }}
          >
            <IoIosSettings size={30} />
          </button>
        </div>
      </motion.div>
      <div className="flex flex-col w-full h-full items-center justify-start pl-20">
        {page === "Transaction" && <Transactions products={products} />}
        {page === "Manager" && <Manager transactions={transactions} />}
        {page === "Close" && <Close initialTransactions={transactions} />}
        {page === "Settings" && <Settings configs={transactions} />}
      </div>
    </motion.div>
  );
}

export default Register;