"use client"
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { FaRegSquare } from "react-icons/fa";
import { calculateSubtotal, calculateTax, calculateTotal, TransactionItemRequest } from "@/components/global.utils";
import logo from "@/components/assets/logos/oropallos-logo-darkfont.png";

const CustomerDisplay = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cart, setCart] = useState<TransactionItemRequest[]>([]);
  const user = useUser();

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
    const channel = new BroadcastChannel(`${user.user?.username}-pos`);

    channel.onmessage = (event) => {
      console.log("Received:", event.data);

      switch (event.data.type) {
        case "cart-add":
          setCart((prev) => [...prev, event.data.item]);
          break;
          case "cart-update":
          const itemExists = event.data.type === "cart-clear" ? cart.findIndex(item => item.name === event.data.item.name && item.type === event.data.item.type && item.discount.value === event.data.item.discount.value && item.itemPrice === event.data.item.itemPrice) : -1;
          if (itemExists !== -1) {
            const temp = cart[itemExists];
            temp.quantity += event.data.item.quantity;
            setCart((prev) => [...prev]);
          }
          break;
        case "cart-remove":
          setCart((prev) => prev.filter(item => !(item.name === event.data.item.name && item.type === event.data.item.type && item.discount.value === event.data.item.discount.value && item.itemPrice === event.data.item.itemPrice)));
          break;
        case "cart-edit":
          setCart((prev) => prev.filter(item => !(item.name === event.data.item.name && item.type === event.data.item.type && item.discount.value === event.data.item.discount.value && item.itemPrice === event.data.item.itemPrice)));
          setCart((prev) => [...prev, event.data.newItem]);
          break;
        case "cart-clear":
          setCart([]);
          break;
      }
    };

    return () => {
      channel.close();
    };
  }, [user]);

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
    <div className="flex flex-row w-full items-start justify-center">
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
      <div className="flex flex-col w-1/2 p-5">
        {/* Cart and Display */}
        <div className="flex flex-col w-full h-[70vh]">
          <h1
            className="text-xl sm:text-2xl font-serif font-semibold text-center sm:text-start text-zinc-900 mb-4">
            Shopping Cart
          </h1>
          <div className="flex overflow-auto">
            <table className="w-full divide-y divide-zinc-400">
              {/* Headers */}
              <thead className="sticky top-0 bg-white z-20 text-lg">
                <tr>
                  <th>
                    Type
                  </th>
                  <th>
                    Item
                  </th>
                  <th>
                    Qty
                  </th>
                  <th>
                    Discount
                  </th>
                  <th>
                    Price
                  </th>
                  <th></th>
                </tr>
              </thead>

              {/* Shopping cart items */}
              <tbody className="divide-y divide-zinc-400">
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td className="text-2xl text-center p-1">{item.type}</td>
                    <td className="text-2xl text-left p-1">{item.name}</td>
                    <td className="text-2xl text-center p-1">{item.quantity}</td>
                    <td className="text-2xl text-center p-1">{item.discount.name}</td>
                    <td className="text-2xl text-center p-1">{(item.itemPrice / 100).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Cart summary */}
        <table className="w-full my-5">
          <tbody>
            <tr>
              <td className="font-semibold text-2xl">
                SUBTOTAL:
              </td>
              <td className="text-end text-2xl">
                {(calculateSubtotal(cart) / 100).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="font-semibold text-2xl">
                TAX:
              </td>
              <td className="text-end text-2xl">
                {(calculateTax(cart) / 100).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        <table className="w-full">
          <tbody>
            <tr>
              <td className="font-semibold text-2xl">
                TOTAL
              </td>
              <td className="text-end text-2xl">
                {(calculateTotal(cart) / 100).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

      </div>
      <div className="flex flex-col bg-zinc-200 items-center justify-center w-1/2 h-screen p-5">
        <Image
          src={logo}
          alt="Oropallo's Discount Wine and Liquor Logo"
          priority
          className=""
        />
        <h1 className="text-3xl font-semibold text-center mt-10">$10.00 MINIMUM FOR CREDIT/DEBIT PAYMENTS.</h1>
        <h1 className="text-3xl font-semibold text-center mt-10">Please bring your own reusable bag.</h1>
      </div>
    </div>
  );
}

export default CustomerDisplay;