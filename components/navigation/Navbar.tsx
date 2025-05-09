"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import logo from "@/components/assets/logos/oropallos-logo-darkfont.png";
import { navBarElements } from "@/components/global.utils";
import { SignedIn, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full h-20 text-red-900 bg-white z-50"
    >
      <div className="flex items-center justify-between p-5 max-w-screen-xl mx-auto font-serif">
        {/* Logo button */}
        <Link href="/" className="absolute left-1/2 transfrom -translate-x-1/2 mt-10 md:mt-0 md:static md:translate-x-0 cursor-pointer">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Image
              src={logo}
              alt="Oropallo's Discount Wine and Liquor Logo"
              height={100}
              className="h-12 w-auto"
            />
          </motion.div>
        </Link>

        {/* Navigation links */}
        <div className="hidden md:flex space-x-10">
          {/* Admin Dashboard Link */}
          <SignedIn>
            <Link
              href="/admin/dashboard"
              className="text-lg text-[#FFBA04] font-semibold"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                Dashboard
              </motion.div>
            </Link>
          </SignedIn>

          {/* Links to other pages */}
          {navBarElements.map((element, index) => (
            <Link
              key={index}
              href={element.path}
              className="text-lg font-semibold"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                {element.label}
              </motion.div>
            </Link>
          ))}

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

      </div>
    </motion.nav>
  );
}

export default Navbar;