"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import logo from "@/components/assets/logos/oropallos-logo-darkfont.png";
import { CiPhone } from "react-icons/ci";
import { FaFacebookF } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <motion.footer
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="mx-auto text-neutral-900 bg-white border-t-2 border-[#FFBA04] px-6 py-10 mt-0"
    >
      {/* Footer Body */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-10">
        <div className="flex flex-col items-center md:items-center space-y-4 px-2 md:px-4 h-full min-w-[300px] w-full max-w-[300px] font-serif">
          {/* Logo */}
          <Image
            className="rounded-2xl"
            src={logo}
            alt="Oropallo's Discount Wine and Liquor logo"
          />

          {/* Contact Info */}
          <p className="text-lg lg:text-xl text-center md:text-start">
            367 Dix Ave,<br />
            Queensbury, NY 12804<br />
            <br />
            <a
              href="tel:+15187983988"
              className="text-red-900 hover:text-[#FFBA04] underline-animate transition-colors"
            >
              <CiPhone className="inline-block mr-1" />
              (518) 798-3988
            </a>
          </p>

          {/* Facebook button */}
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-400 text-white shadow-lg hover:shadow-xl transition-colors duration-300"
          >
            <a
              href="https://www.facebook.com/Oropallos-Discount-Wine-Liquor-100063748050582/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl hover:text-zinc-300 transition-colors"
            >
              <FaFacebookF />
            </a>
          </motion.div>
        </div>

        {/* Hours */}
        <div className="flex flex-col items-center justify-center h-full space-y-4 px-2 md:px-20 font-serif">
          <h3 className="text-red-900 text-xl lg:text-3xl font-bold font-sans whitespace-nowrap">Our Hours</h3>

          <div className="grid grid-cols-2 whitespace-nowrap">
            <h3>Mon</h3><h3>9:00 AM - 8:00 PM</h3>
            <h3>Tue</h3><h3>9:00 AM - 8:00 PM</h3>
            <h3>Wed</h3><h3>9:00 AM - 8:00 PM</h3>
            <h3>Thu</h3><h3>9:00 AM - 8:00 PM</h3>
            <h3>Fri</h3><h3>9:00 AM - 8:00 PM</h3>
            <h3>Sat</h3><h3>9:00 AM - 8:00 PM</h3>
            <h3>Sun</h3><h3>10:00 AM - 4:00 PM</h3>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col items-center justify-start space-y-4 px-2 md:px-20 h-full font-serif">
          <h3 className="text-red-900 text-xl lg:text-3xl font-bold font-sans">Explore</h3>
          <ul className="space-y-1 text-lg lg:text-xl text-center whitespace-nowrap">
            <li><Link href={"/"} className="underline-animate">Home</Link></li>
            <li><Link href="/about" className="underline-animate">About Us</Link></li>
            <li><Link href="/products" className="underline-animate">Products</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-md text-gray-400 mt-10">
        Disclaimer: All discounts, prices, specials are subject to change without notice. Please check with our staff for the most current information.
        <br />
        &copy; {currentYear} Oropallo{'\''}s Discount Wine & Liquor. All rights reserved.
      </div>
    </motion.footer>
  );
}

export default Footer;