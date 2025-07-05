"use client";
import { motion } from "framer-motion";
import { CiPhone } from "react-icons/ci";
import { FaFacebookF } from "react-icons/fa";

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="fixed top-0 w-full h-10 bg-zinc-600 z-50 whitespace-nowrap"
    >
      {/* Header Body */}
      <div className="flex flex-row items-start justify-start gap-5 px-10">
        <a
          href="tel:+15187983988"
          className="text-white font-semibold hover:text-red-900 underline-animate transition-colors items-center justify-center p-2"
        >
          <CiPhone className="inline-block mr-1" />
          Call
        </a>

        {/* Facebook button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-400 text-white shadow-lg hover:shadow-xl transition-colors duration-300 mt-2"
        >
          <a
            href="https://www.facebook.com/Oropallos-Discount-Wine-Liquor-100063748050582/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-md hover:text-zinc-300 transition-colors"
          >
            <FaFacebookF />
          </a>
        </motion.div>

        <div className="relative overflow-hidden w-[70vw] h-10 flex items-center justify-center">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: ["-200%", "200%"] }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 15,
              ease: "linear",
            }}
            className="absolute whitespace-nowrap text-white font-semibold"
          >
            Announcements feature coming soon!
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;