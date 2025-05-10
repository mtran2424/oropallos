"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ProductCategories } from "@/components/global.utils";
import { FaChevronRight } from "react-icons/fa6";
import { useState } from "react";

const Products = () => {
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [currentSubcategory, setCurrentSubcategory] = useState<string>("");
  const [expandedCategory, setExpandedCategory] = useState<boolean>(false);
  const [expandedSubcategory, setExpandedSubcategory] = useState<boolean>(false);
  const [seeMore, setSeeMore] = useState<boolean>(false);

  return (
    <div>
      {/* Main Category List */}
      <motion.ul
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="hidden xl:flex w-full items-center justify-center space-x-16 p-5 mt-25"
      >
        {ProductCategories.map((category, index) => (
          // Dropdowns for each wine category
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            key={index}
            onClick={() => {
              // Toggle off children filters too
              if (currentCategory === category.name) {
                setExpandedSubcategory(false);
                setCurrentSubcategory("");
                setExpandedCategory(false);
                setCurrentCategory("");
              }
              else {
                // Close out other categories still open
                setExpandedSubcategory(false);
                setCurrentSubcategory("");
                setCurrentCategory(category.name);
                setExpandedCategory(true);
              }
            }}
            className="text-lg whitespace-nowrap font-serif cursor-pointer flex flex-row items-center">

            <motion.div
              animate={category.name === currentCategory ? { rotate: 90 } : {}}
            >
              <FaChevronRight className="mr-2" />
            </motion.div>

            <li
              className="text-lg whitespace-nowrap font-serif cursor-pointer underline-animate"
            >
              {category.name}
            </li>
          </motion.div>
        ))
        }
      </motion.ul>

      {/* Expanded Category */}
      <AnimatePresence>
        {expandedCategory &&
          <div className="items-center justify-center">
            <motion.ul
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={`hidden xl:flex w-full items-center justify-center space-x-16 p-5`}
            >
              {/* If liquor category is selected, show liquor subcategories */}
              {ProductCategories.filter((category) => category.name === currentCategory)[0].subcategories.length < 6 &&
                // If wine category is selected, show wine subcategories
                ProductCategories.filter((category) => category.name === currentCategory)[0].subcategories
                  .map((subcategory, index) => (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      key={index}
                      onClick={() => {
                        // Unselect subcategory if already selected
                        if (currentSubcategory === subcategory.name) {
                          setCurrentSubcategory("");
                          setExpandedSubcategory(false);
                        }
                        else {
                          // Expand subcategory if not already selected
                          setCurrentSubcategory(subcategory.name);
                          setExpandedSubcategory(true);
                        }
                      }}
                      className="col-span-3 text-lg whitespace-nowrap font-serif cursor-pointer flex flex-row items-center justify-center"
                    >
                      <motion.div
                        animate={currentSubcategory === subcategory.name ? { rotate: 90 } : {}}
                      >
                        <FaChevronRight className="mr-2" />
                      </motion.div>

                      <li className="text-lg whitespace-nowrap font-serif cursor-pointer underline-animate">
                        {subcategory.name}
                      </li>
                    </motion.div>
                  ))}

              {ProductCategories.filter((category) => category.name === currentCategory)[0].subcategories.length > 5 && !seeMore &&
                ProductCategories.filter((category) => category.name === currentCategory)[0].subcategories
                  .slice(0, 5)
                  .map((subcategory, index) => (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      key={index}
                      onClick={() => {
                        // Unselect subcategory if already selected
                        if (currentSubcategory === subcategory.name) {
                          setCurrentSubcategory("");
                          setExpandedSubcategory(false);
                        }
                        else {
                          // Expand subcategory if not already selected
                          setCurrentSubcategory(subcategory.name);
                          setExpandedSubcategory(true);
                        }
                      }}
                      className="col-span-3 text-lg whitespace-nowrap font-serif cursor-pointer flex flex-row items-center justify-center"
                    >
                      <motion.div
                        animate={currentSubcategory === subcategory.name ? { rotate: 90 } : {}}
                      >
                        <FaChevronRight className="mr-2" />
                      </motion.div>

                      <li className="text-lg whitespace-nowrap font-serif cursor-pointer underline-animate">
                        {subcategory.name}
                      </li>
                    </motion.div>
                  ))}

              {ProductCategories.filter((category) => category.name === currentCategory)[0].subcategories.length > 5 && seeMore &&
                ProductCategories.filter((category) => category.name === currentCategory)[0].subcategories
                  .slice(5, ProductCategories.filter((category) => category.name === currentCategory)[0].subcategories.length)
                  .map((subcategory, index) => (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      key={index}
                      onClick={() => {
                        // Unselect subcategory if already selected
                        if (currentSubcategory === subcategory.name) {
                          setCurrentSubcategory("");
                          setExpandedSubcategory(false);
                        }
                        else {
                          // Expand subcategory if not already selected
                          setCurrentSubcategory(subcategory.name);
                          setExpandedSubcategory(true);
                        }
                      }}
                      className="col-span-3 text-lg whitespace-nowrap font-serif cursor-pointer flex flex-row items-center justify-center z-20"
                    >
                      <motion.div
                        animate={currentSubcategory === subcategory.name ? { rotate: 90 } : {}}
                      >
                        <FaChevronRight className="mr-2" />
                      </motion.div>

                      <li className="text-lg whitespace-nowrap font-serif cursor-pointer underline-animate">
                        {subcategory.name}
                      </li>
                    </motion.div>
                  ))}


              {/* See More Button */}
              {ProductCategories.filter((category) => category.name === currentCategory)[0].subcategories.length > 5 &&
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  onClick={() => {
                    setSeeMore(!seeMore);
                    setCurrentSubcategory("");
                    setExpandedSubcategory(false);
                  }}
                  className="col-span-3 text-lg whitespace-nowrap font-serif cursor-pointer flex flex-row items-center justify-center"
                >

                  <li className="text-lg whitespace-nowrap font-serif cursor-pointer underline-animate">
                    ...
                  </li>
                </motion.div>}
            </motion.ul>
          </div>
        }
      </AnimatePresence>

      {/* Expanded Subcategory */}
      <AnimatePresence>
        {expandedSubcategory && ProductCategories.filter((category) => category.name === currentCategory)[0].subcategories
                  .filter((subcategory) => subcategory.name === currentSubcategory)[0].types.length > 0 &&
          <div className="items-center justify-center">
            <motion.ul
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={`hidden xl:grid ${ProductCategories.filter((category) => category.name === currentCategory)[0].subcategories
                  .filter((subcategory) => subcategory.name === currentSubcategory)[0].types.length === 2 ? "grid-cols-8"
                  : ProductCategories.filter((category) => category.name === currentCategory)[0].subcategories
                    .filter((subcategory) => subcategory.name === currentSubcategory)[0].types.length === 3 ? "grid-cols-12"
                    : "grid-cols-16"
                }
              w-full items-start justify-center p-5`}
            >
              {/* If liquor subcategory is selected, show liquor subtypes */}
              {
                ProductCategories.filter((category) => category.name === currentCategory)[0].subcategories
                  .filter((subcategory) => subcategory.name === currentSubcategory)[0].types
                  .map((type, index) => (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      key={index}
                      onClick={() => {
                        // Logic to handle type filter
                      }}
                      className="col-span-4 text-lg whitespace-nowrap font-serif cursor-pointer flex flex-row items-center justify-center"
                    >
                      <li className="text-lg whitespace-nowrap font-serif cursor-pointer underline-animate">
                        {type.name}
                      </li>
                    </motion.div>
                  ))}
            </motion.ul>
          </div>
        }
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="xl:mt-0 mt-25"
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