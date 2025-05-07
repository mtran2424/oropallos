"use client";
import { motion } from "framer-motion";
import { ProductCategories } from "@/components/global.utils";
import { FaChevronRight } from "react-icons/fa6";
import { useState } from "react";

const Products = () => {
  const [prod, setProd] = useState<string>("");
  return (
    <div>

      <motion.ul
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="hidden lg:flex items-center space-x-16 p-5 mt-25"
      >
        {
          ProductCategories.map((category, index) => (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              key={index}
              onClick={() => {
                if (prod === category) {
                  setProd("");
                }
                else {
                  setProd(category);
                }
              }}
              className="text-lg whitespace-nowrap font-serif cursor-pointer flex flex-row items-center">

              {/* TODO: Add rotate animation when category is expanded */}
              <motion.div
                animate={category === prod ? { rotate: 90 }: {}}
              >
                <FaChevronRight className="mr-2" />
              </motion.div>

              <li
                className="text-lg whitespace-nowrap font-serif cursor-pointer underline-animate"
              >
                {category}
              </li>
            </motion.div>
          ))

        }
      </motion.ul>

      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="lg:mt-0 mt-25"
      >
        <div
          className="flex flex-col w-full min-h-screen h-full items-center justify-start"
        >
          <h1 className="text-2xl sm:text-4xl font-sans text-center sm:text-start mb-4">
            Products
          </h1>
          <p className="text-xl text-center sm:text-start font-serif">
            Check out our selection of wines and liquors!<br />
            <br />
            <a
              href="tel:+15187983988"
              className="underline-animate"
            >
              (518) 798-3988
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Products;