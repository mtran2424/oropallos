"use client";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import logo from "@/components/assets/logos/oropallos-logo-darkfont.png";

export default function AgeGate({ onVerified }: { onVerified: () => void }) {
  const [visible, setVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const handleVerify = () => {
    localStorage.setItem("ageVerified", "true");
    setVisible(false);
    onVerified();
  };
  
  if (!visible) return null;
  
  useEffect(() => {
    const verified = localStorage.getItem("ageVerified");
    if (!verified) setVisible(true);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, x: "-100%" }}
          animate={{ opacity: 1, x: "0" }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.3 }}
          ref={modalRef}
          className="relative bg-white p-6 rounded-2xl max-w-lg w-full shadow-lg max-h-[70vh] overflow-y-auto border border-zinc-500"
        >
          <div className="flex flex-col items-center">

            <Image
              src={logo}
              alt="Oropallo's Discount Wine and Liquor Logo"
              height={100}
              priority
              className="h-12 w-auto"
            />
          </div>
          <h2 className="text-xl text-zinc-500 mb-4 mt-2 text-center w-full font-serif">Are you 21 or older?</h2>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleVerify}
              className="text-lg rounded-full mt-2 px-3 py-2 w-20 text-white hover:text-red-900 bg-red-900 hover:bg-white border order-red-900 transition-colors font-serif"
            >
              Yes
            </button>
            <button
              onClick={() => (window.location.href = "https://responsibility.org/")}
              className="text-lg rounded-full mt-2 px-3 py-2 w-20 text-white hover:text-red-900 bg-red-900 hover:bg-white border order-red-900 transition-colors font-serif"
            >
              No
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div >
  );
}
