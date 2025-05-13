"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

import OropallosStoreFront from "@/components/assets/photos/oropallos-storefront.jpg";
import { Map } from "@/components/map/Map";
import { CiPhone } from "react-icons/ci";
import { FaFacebookF } from "react-icons/fa";

const About = () => {
  const [expandAbout, setExpandAbout] = useState(false);
  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="mt-35"
    >
      <div className="flex flex-col items-center justify-start h-full min-h-screen gap-20 font-serif">

        {/* About Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 px-10 max-w-6xl">
          <div className="flex flex-col w-full items-start justify-start">
            <h1 className="text-2xl sm:text-3xl font-sans text-center sm:text-start text-red-900 mb-4">
              About Us
            </h1>
            <p className="text-xl text-start text-zinc-500 font-serif">
              Welcome to the Oropallo{'\''}s Discount Wine & Liquor family! We are a liquor store with spirited and sparkling personality.
              Our mission is to provide our customers with the best selection of wines and liquors at unbeatable prices.
            </p>

            <AnimatePresence initial={false}>
              {expandAbout && (
                <motion.div
                  key="about"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="text-xl text-start text-zinc-500 font-serif">
                    <br />
                    We have been proudly serving the Queensbury and surrounding area for over 25 years. Located conveniently next to Anchor Beverage 2,
                    we like to say that we are a true one-stop shop for all your adult beverage needs.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              onClick={() => setExpandAbout(!expandAbout)}
              className="text-lg rounded-full mt-2 px-3 py-2 text-white hover:text-red-900 bg-red-900 hover:bg-white border-1 order-red-900 transition-colors font-serif"
            >
              {expandAbout ? "Read less" : "Read more"}
            </motion.button>
          </div>

          {/* Image Section */}
          <div className="flex overflow-hidden rounded-lg w-full">
            <Image
              src={OropallosStoreFront}
              alt="Oropallo's Discount Wine and Liquor Storefront"
              className="transform scale-110 hover:scale-100 transition-transform duration-700 ease-out w-full"
            />
          </div>
        </div>

        {/* Location Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 px-10 max-w-6xl">
          <div className="flex flex-col w-full items-start justify-start">
            <h1 className="text-2xl sm:text-3xl font-sans text-center sm:text-start text-red-900 mb-4">
              Location
            </h1>
            <p className="text-xl text-start text-zinc-500 font-serif">
              We are located on the corner of Highland and Dix Ave in Queensbury, NY 12804. Our store is easily accessible and has ample parking space for your convenience.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start justify-start w-full gap-10 px-10 max-w-6xl font-serif">
          <div className="flex flex-col w-1/2 items-start justify-start gap-10">
            <div>
              <h2 className="text-2xl font-semibold font-sans text-red-900">Address:</h2>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.05 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <p className="text-xl text-start text-zinc-500">
                  376 Dix Ave,<br />
                  Queensbury, NY 12804
                </p>
              </motion.div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold font-sans text-red-900">Phone Number:</h2>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.05 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <a
                  href="tel:+15187983988"
                  className="text-red-900 text-xl hover:text-[#FFBA04] underline-animate transition-colors font-serif"
                >
                  <CiPhone className="inline-block mr-1" />
                  (518) 798-3988
                </a>
              </motion.div>
            </div>

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
          <div className="flex flex-col items-start justify-start h-full space-y-4 font-serif">
            <h2 className="text-2xl font-semibold font-sans text-red-900">Business Hours:</h2>

            <div className="grid grid-cols-2 whitespace-nowrap text-zinc-500">
              <h3>Mon</h3><h3>9:00 AM - 8:00 PM</h3>
              <h3>Tue</h3><h3>9:00 AM - 8:00 PM</h3>
              <h3>Wed</h3><h3>9:00 AM - 8:00 PM</h3>
              <h3>Thu</h3><h3>9:00 AM - 8:00 PM</h3>
              <h3>Fri</h3><h3>9:00 AM - 8:00 PM</h3>
              <h3>Sat</h3><h3>9:00 AM - 8:00 PM</h3>
              <h3>Sun</h3><h3>10:00 AM - 4:00 PM</h3>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex flex-col overflow-hidden shadow-lg w-full h-full max-w-6xl"
        >
          <Map />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default About;