"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import logo from "@/components/assets/logos/oropallos-logo-darkfont.png";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full text-red-900 bg-white z-50"
    >
      <div className="flex items-center justify-between p-5 max-w-screen-xl mx-auto font-serif">
        <Link href="/" className="absolute left-1/2 transfrom -translate-x-1/2 mt-10 md:mt-0 md:static md:translate-x-0 cursor-pointer">
          <Image
            src={logo}
            alt="Oropallo's Discount Wine and Liquor Logo"
            height={100}
            className="h-12 w-auto"
          />
        </Link>

        <div className="hidden md:flex space-x-4">
          <Link href="/" className="text-lg font-semibold">
            Home
          </Link>
          <Link href="/" className="text-lg font-semibold">
            About Us
          </Link>
          <Link href="/products" className="text-lg font-semibold">
            Products
          </Link>

        </div>

      </div>
    </motion.nav>
  );
}

export default Navbar;