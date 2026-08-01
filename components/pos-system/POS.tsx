"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { PiCashRegister } from "react-icons/pi";
import { CiViewTable } from "react-icons/ci";
import { GoGraph } from "react-icons/go";
import { RxExit } from "react-icons/rx";
import { FaRegSquare } from "react-icons/fa";
import { IoIosSettings, IoMdClose } from "react-icons/io";
import { getBatches } from "@/app/api/batchapi";
import { getDiscount, getProducts, getQuickAddButtons } from "@/app/api/adminapi";
import { getTransactions } from "@/app/api/transactionapi";
import {
  Batch,
  Product,
  QuickAddButton,
  Transaction,
  Discount
} from "@/components/global.utils";
import Sales from "./Sales"
import Settings from "./Settings";
import Transactions from "./Transactions";
import Manager from "./Manager";
import Close from "./Close";
import { SiDoordash } from "react-icons/si";
import DoorDashTransactions from "./DoorDashTransactions";

const POS = () => {
  const { isSignedIn, user } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [quickAddButtons, setQuickAddButtons] = useState<QuickAddButton[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const router = useRouter();

  const [page, setPage] = useState<string>("Transaction");

  const openCustomerDisplay = () => {
    window.open(
      "/admin/customer-display",
      "customerDisplay",
      "width=1080, height=540, right=-1920",
    );
  };

  useEffect(() => {
    if (user && user.username !== "admin") {
      openCustomerDisplay();
    }
  }, [user]);

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
      router.push('/');
    }
  }, [user]);

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

    const fetchBatches = async () => {
      try {
        const data = await getBatches();
        setBatches(data.batches);
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };

    const fetchQuickAddButtons = async () => {
      try {
        const data = await getQuickAddButtons();
        setQuickAddButtons(data.buttons);
      } catch (error) {
        console.error("Error fetching quick buttons:", error);
      }
    }

    const fetchDiscounts = async () => {
      try {
        const data = await getDiscount();
        setDiscounts(data.discounts);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }

    fetchBatches();
    fetchProducts();
    fetchTransactions();
    fetchQuickAddButtons();
    fetchDiscounts();
  }, [refresh]);

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
              ${page === "DoorDash" ? "bg-zinc-500 text-white" : ""}`}
            onClick={() => {
              setPage("DoorDash");
            }}
          >
            <SiDoordash size={30} />
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
          {user?.username === "admin" && <button
            className={`flex h-20 items-center justify-center hover:bg-zinc-400 transition-colors ease-in-out
              ${page === "Stats" ? "bg-zinc-500 text-white" : ""}`}
            onClick={() => {
              setPage("Sales");
            }}
          >
            <GoGraph size={30} />
          </button>}
          <button
            className={`flex h-20 items-center justify-center hover:bg-zinc-400 font-semibold transition-colors ease-in-out
              ${page === "Close" ? "bg-zinc-500 text-white" : ""}`}
            onClick={() => {
              setPage("Close");
            }}
          >
            X1/Z1
          </button>
          {user?.username === "admin" && <button
            className={`flex h-20 items-center justify-center hover:bg-zinc-400 transition-colors ease-in-out`}
            onClick={() => {
              setPage("Settings");
            }}
          >
            <IoIosSettings size={30} />
          </button>}
          <button
            className={`flex h-20 items-center justify-center hover:bg-zinc-400 transition-colors ease-in-out`}
            onClick={() => {
              if (user?.username !== "admin")
                router.push("/home");
              else
                router.push("/admin/dashboard")
            }}
          >
            <RxExit size={30} />
          </button>

        </div>
      </motion.div>
      <div className="pl-20">
        {page === "Transaction" && <Transactions products={products} discounts={discounts} quickAddButtons={quickAddButtons} onTransaction={() => setRefresh(prev => !prev)} />}
        {page === "DoorDash" && <DoorDashTransactions
          products={products.map((product) => (
            {
              ...product, price: (product.type === 'Canned_Cocktails' ?
                parseFloat((product.price * 1.13).toFixed(2)) :
                product.category !== 'Liquor' ?
                  parseFloat((product.price * 1.13).toFixed(2)) :
                  parseFloat((product.price * 1.15).toFixed(2)))
            }))}
          discounts={discounts}
          quickAddButtons={quickAddButtons}
          onTransaction={() => setRefresh(prev => !prev)}
        />}
        {page === "Manager" && <Manager transactions={transactions} discounts={discounts} />}
        {page === "Close" && <Close initialTransactions={transactions} />}
        {page === "Sales" && <Sales products={products} initialTransactions={transactions} initialBatches={batches} />}
        {page === "Settings" && <Settings products={products} quickAddButtons={quickAddButtons} discounts={discounts} batches={batches} onEdit={() => setRefresh(prev => !prev)} onDelete={() => setRefresh(prev => !prev)} onAdd={() => setRefresh(prev => !prev)} />}
      </div>
    </motion.div>
  );
}

export default POS;