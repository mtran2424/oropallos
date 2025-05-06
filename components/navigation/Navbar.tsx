"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import logo from "@/components/assets/logos/oropallos-logo.png";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full h-125px bg-red-900 text-white z-50"
    >
      <div className="justify-between items-center h-30 mx-auto w-full">
        {/* LOGO */}
        <div
          className="absolute left-1/2 transfrom -translate-x-1/2 md:static md:translate-x-0 cursor-pointer"
        >
          <h1 className="flex">
            <Link href={'/'}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="md:flex items-center text-white rounded-full h-full"
              >
                <Image
                  className="flex rounded-2xl p-2"
                  src={logo}
                  alt="Oropallo's Discount Wine and Liquor logo"
                  height={100}
                />
              </motion.div>
            </Link>
          </h1>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;