"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaClipboardCheck, FaRegClipboard } from "react-icons/fa";

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <motion.button
      whileHover={{scale: 1.05}}
      whileTap={{scale: 0.95}}
      onClick={handleCopy}
      className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
    >
      {copied ? <FaClipboardCheck /> : <FaRegClipboard />}
    </motion.button>
  );
};

export default CopyButton;
