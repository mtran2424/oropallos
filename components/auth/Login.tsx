"use client";
import { SignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";

export const Login = () => {
  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <div className="flex justify-center items-center h-screen w-screen">
        <SignIn />
      </div>
    </motion.div>
  );
}