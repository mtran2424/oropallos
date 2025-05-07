"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import logo from "@/components/assets/logos/oropallos-logo-darkfont.png";
import { CiPhone } from "react-icons/ci";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="mx-auto text-neutral-900 bg-white border-t-2 border-[#FFBA04] px-6 py-10 mt-0"
    >
      {/* Footer Body */}
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="flex flex-col items-center sm:items-start space-y-4 px-2 sm:px-4  min-w-[200px] w-1/3 max-w-[300px] font-serif">
          {/* Logo */}
          <Image
            className="rounded-2xl"
            src={logo}
            alt="Oropallo's Discount Wine and Liquor logo"
          />

          {/* Contact Info */}
          <p className="text-xl text-center sm:text-start">
            367 Dix Ave,<br />
            Queensbury, NY 12804<br />
            <br />
            <a
              href="tel:+15187983988"
              className="text-red-900 hover:text-[#FFBA04] underline-animate"
            >
              <CiPhone className="inline-block mr-1" />
              (518) 798-3988
            </a>
          </p>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;