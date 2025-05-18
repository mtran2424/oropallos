"use client";
import { motion } from "framer-motion";

const ExpandButton = ({ children, onClick }: {
  children: React.ReactNode,
  onClick: () => void
}) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      className="text-lg rounded-full mt-2 px-3 py-2 text-white hover:text-red-900 bg-red-900 hover:bg-white border-1 order-red-900 transition-colors font-serif"
    >
      {children}
    </motion.button>
  );
}

export default ExpandButton;