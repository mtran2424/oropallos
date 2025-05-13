"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaConciergeBell } from "react-icons/fa";
import { BiSolidDiscount } from "react-icons/bi";
import { RiTempColdFill } from "react-icons/ri";
import HomeGallery from "./HomeGallery";
import Link from "next/link";

const Home = () => {
  const [expandDiscount, setExpandDiscount] = useState(false);
  const [expandIntro, setExpandIntro] = useState(false);
  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="my-35"
    >
      {/* Home Content */}
      <div className="flex flex-col items-center h-full h-min-screen mt-10 gap-20">
        {/* Intro Section */}
        <div className="flex flex-col w-full items-start justify-start px-10 max-w-6xl">
          <h1 className="text-2xl sm:text-4xl font-sans text-center sm:text-start text-red-900 mb-4">
            Welcome to {`Oropallo\'s Discount Wine & Liquor`}
          </h1>
          <p className="text-xl text-start text-zinc-500 font-serif">
            Stop by for our discounts and low prices on wine and liquor!
            We have a wide selection of wines, liquors, and spirits to choose from.
          </p>

          <AnimatePresence initial={false}>
            {expandIntro && (
              <motion.div
                key="intro"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="text-xl text-start text-zinc-500 font-serif">
                  <br />
                  Whether you{'\''}re looking for a special bottle for a celebration or just want to stock up for the weekend,
                  we{'\''}ve got you covered. Our knowledgeable staff is here to help you find the perfect drink for any occasion.
                  <br />
                  <br />
                  <Link href="/about" className="text-red-900 hover:text-[#FFBA04] underline-animate transition-colors font-bold">
                    Visit us today!
                  </Link>
                  <br />
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            onClick={() => setExpandIntro(!expandIntro)}
            className="text-lg rounded-full mt-2 px-3 py-2 text-white hover:text-red-900 bg-red-900 hover:bg-white border-1 order-red-900 transition-colors font-serif"
          >
            {expandIntro ? "Read less" : "Read more"}
          </motion.button>
        </div>

        <HomeGallery />

        {/* TODO: Michelles Picks */}
        

        {/* Discounts Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 px-10 max-w-6xl">

          <div className="flex flex-col w-full items-start justify-start">
            <h1 className="text-2xl sm:text-4xl font-sans text-center sm:text-start text-red-900 mb-4">
              Our Discounts
            </h1>
            <p className="text-xl text-start text-zinc-500 font-serif">
              Looking for a great deal on your favorite wines and liquors? Shopping on a budget? We{'\''}ve got you covered!
              Stop by on our discount days. We offer a variety of deals on select products, so you can stock up without breaking the bank.
            </p>

            <AnimatePresence initial={false}>
              {expandDiscount && (
                <motion.div
                  key="discount"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="text-xl text-start text-zinc-500 font-serif">
                    <br />
                    Every Tuesday, we offer a senior discount: 15% off wine products and tax-free liquor for all seniors aged 50 and older.
                    <br /><br />
                    Wednesdays are Tax-Free Day: All non-sale wine and liquor items in the store are tax-free.
                    <br /><br />
                    Veterans Discount: Veterans receive 15% off wine products and tax-free liquor every day of the week.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              onClick={() => setExpandDiscount(!expandDiscount)}
              className="text-lg rounded-full mt-2 px-3 py-2 text-white hover:text-red-900 bg-red-900 hover:bg-white border-1 order-red-900 transition-colors font-serif"
            >
              {expandDiscount ? "Read less" : "Read more"}
            </motion.button>
          </div>
        </div>

        {/* Specials and services*/}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 px-10 max-w-6xl">
          <div className="flex flex-col w-full items-start justify-start">
            <h1 className="text-2xl sm:text-4xl font-sans text-center sm:text-start text-red-900 mb-4">
              Specials
            </h1>
            <p className="text-xl text-start text-zinc-500 font-serif">
              We{'\''}re constantly bringing in new products and running sales and specials.
              Check out our <a href="https://www.facebook.com/p/Oropallos-Discount-Wine-Liquor-100063748050582/" className="text-red-900 hover:text-[#FFBA04] underline-animate transition-colors">
                Facebook
              </a> page for the latest updates on our specials and new arrivals.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-10 px-10 max-w-6xl">

          <div className="flex flex-col w-full items-start justify-start">
            <h1 className="text-2xl sm:text-4xl font-sans text-center sm:text-start text-red-900 mb-4">
              Why Choose Us?
            </h1>
            <p className="text-xl text-start text-zinc-500 font-serif">
              We{'\''}re committed to providing our customers with the best shopping experience possible
              and a welcoming and friendly atmosphere.
              We offer curbside and in-store pickup, so you can shop your way.
              Plus, we have a wide range of chilled wines and cocktails, so you can enjoy your drinks right away!
            </p>
            <div className="grid grid-cols-3 w-full items-start justify-center gap-10 p-5 text-center font-serif text-zinc-600">
              <div className="flex flex-col items-center gap-2 justify-start">
                <BiSolidDiscount size={70} className="text-zinc-400" />
                <div>Unbelievably low prices</div>
              </div>

              <div className="flex flex-col items-center gap-2 justify-start">
                <FaConciergeBell size={70} className="text-zinc-400" />
                <div>
                  Curbside and in-store pickup <br />
                  <span className="text-sm">(Must provide valid 21+ ID upon pickup)</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 justify-start">
                <RiTempColdFill size={70} className="text-zinc-400" />
                <div>Chilled wines and RTD beverages</div>
              </div>
            </div>


          </div>
        </div>

      </div>
    </motion.div>
  );
}

export default Home;