"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Product, ProductCategories, ProductCategory, ProductSubcategory } from "@/components/global.utils";
import { FaChevronRight } from "react-icons/fa6";
import { useEffect, useState } from "react";
import Collection from "./Collection";
import { getProducts } from "@/app/api/productapi";

const Products = () => {
  const [currentCategory, setCurrentCategory] = useState<ProductCategory>();
  const [currentSubcategory, setCurrentSubcategory] = useState<ProductSubcategory>();
  const [currentType, setCurrentType] = useState<string>("");
  const [expandedCategory, setExpandedCategory] = useState<boolean>(false);
  const [expandedSubcategory, setExpandedSubcategory] = useState<boolean>(false);
  const [seeMoreCategories, setSeeMoreCategories] = useState<boolean>(false);
  const [seeMoreTypes, setSeeMoreTypes] = useState<boolean>(false);

  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products from the server when the component mounts or refreshes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (currentCategory) {
      setCurrentSubcategory(undefined);
      setExpandedCategory(true);
      setCurrentType("");
    }
    else {
      // Reset all states when no category is selected
      setCurrentSubcategory(undefined);
      setExpandedCategory(false);
      setCurrentType("");
    }
  }, [currentCategory]);

  useEffect(() => {
    if (currentSubcategory) {
      setExpandedSubcategory(true);
      setCurrentType("");
    }
    else {
      // Reset all states when no category is selected
      setExpandedSubcategory(false);
      setCurrentType("");
    }
  }, [currentSubcategory]);

  return (
    <div>
      {/* Main Category List */}
      <AnimatePresence mode="wait">
        <motion.ul
          key={seeMoreCategories.toString()}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="hidden md:flex flex-row w-full items-center justify-center space-x-16 p-2 mt-25 overflow-hidden"
        >
          {((!seeMoreCategories ? ProductCategories.slice(0, 4) : ProductCategories.slice(4, 6))
          ).map((category, index) => (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              key={index}
              onClick={() => {
                if (currentCategory?.name === category.name) {
                  setCurrentCategory(undefined);
                } else {
                  setCurrentCategory(category);
                }
              }}
              className="text-md lg:text-lg whitespace-nowrap font-serif cursor-pointer flex flex-row items-center"
            >
              <motion.div animate={currentCategory?.name === category.name ? { rotate: 90 } : {}}>
                <FaChevronRight className="mr-2" />
              </motion.div>
              <li className="text-md lg:text-lg whitespace-nowrap font-serif cursor-pointer underline-animate">
                {category.name}
              </li>
            </motion.div>
          ))}

          {<motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            onClick={() => {
              setSeeMoreCategories(!seeMoreCategories);
              setCurrentCategory(undefined);
            }}
            className="text-md lg:text-lg whitespace-nowrap font-serif cursor-pointer flex flex-row items-center justify-center"
          >
            <li className="text-md lg:text-lg whitespace-nowrap font-serif cursor-pointer underline-animate">
              ...
            </li>
          </motion.div>
          }
        </motion.ul>
      </AnimatePresence>

      {/* Expanded Category */}
      <AnimatePresence mode="wait">
        {expandedCategory && currentCategory &&
          <div className="items-center justify-center">
            <motion.ul
              key={currentCategory.name + seeMoreTypes.toString()}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={`hidden md:flex w-full items-center justify-center space-x-16 p-5`}
            >

              {currentCategory && (currentCategory.subcategories.length > 5 ?
                (!seeMoreTypes ? currentCategory.subcategories.slice(0, 5) :
                  currentCategory.subcategories.slice(5, currentCategory.subcategories.length)) :
                currentCategory.subcategories)
                .map((subcategory, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    key={index}
                    onClick={() => {
                      // Unselect subcategory if already selected
                      if (currentSubcategory && currentSubcategory.name === subcategory.name) {
                        setCurrentSubcategory(undefined);
                      }
                      else {
                        // Expand subcategory if not already selected
                        setCurrentSubcategory(subcategory);
                      }
                    }}
                    className="col-span-3 text-md lg:text-lg whitespace-nowrap font-serif cursor-pointer flex flex-row items-center justify-center"
                  >
                    <motion.div
                      animate={currentSubcategory && currentSubcategory.name === subcategory.name ? { rotate: 90 } : {}}
                    >
                      <FaChevronRight className="mr-2" />
                    </motion.div>

                    <li className="text-md lg:text-lg whitespace-nowrap font-serif cursor-pointer underline-animate">
                      {subcategory.name}
                    </li>
                  </motion.div>
                ))}

              {/* See More Button */}
              {currentCategory && currentCategory.subcategories.length > 5 &&
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  onClick={() => {
                    setSeeMoreTypes(!seeMoreTypes);
                    setCurrentSubcategory(undefined);
                  }}
                  className="col-span-3 text-md lg:text-lg whitespace-nowrap font-serif cursor-pointer flex flex-row items-center justify-center"
                >

                  <li className="text-md lg:text-lg whitespace-nowrap font-serif cursor-pointer underline-animate">
                    ...
                  </li>
                </motion.div>}
            </motion.ul>
          </div>
        }
      </AnimatePresence>

      {/* Expanded Subcategory */}
      <AnimatePresence mode="wait">
        {expandedSubcategory &&
          currentSubcategory && currentSubcategory.types.length > 0 &&
          <div className="items-center justify-center">
            <motion.ul
              key={currentSubcategory.name}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={`hidden md:grid 
                ${currentSubcategory && currentSubcategory.types.length === 2 ? "grid-cols-8"
                  : currentSubcategory && currentSubcategory.types.length === 3 ? "grid-cols-12"
                    : "grid-cols-12 lg:grid-cols-16"
                }
              w-full items-start justify-center p-5`}
            >
              {/* If liquor subcategory is selected, show liquor subtypes */}
              {
                currentSubcategory && currentSubcategory.types
                  .map((type, index) => (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      key={index}
                      onClick={() => {
                        // Logic to handle type filter
                        if (currentType === type.name) {
                          setCurrentType("");
                        }
                        else {
                          setCurrentType(type.name);
                        }
                      }}
                      className="col-span-4 text-md lg:text-lg whitespace-nowrap font-serif cursor-pointer flex flex-row items-center justify-center"
                    >
                      <li className="text-md lg:text-lg whitespace-nowrap font-serif cursor-pointer underline-animate">
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
        className="md:mt-0 mt-25"
      >

        {/* Product Filter path */}
        <div className="flex flex-col items-center">

          <div className="grid grid-cols-1 max-w-7xl w-full justify-center">
            {/* Filter Header */}
            <h2 className="text-lg font-bold text-zinc-900 px-5">Filters</h2>

            {/* Filter Path */}
            <div className="flex flex-row items-center px-5 font-serif text-md">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                onClick={() => {
                  setCurrentCategory(undefined);
                  setCurrentSubcategory(undefined);
                  setCurrentType("");
                }}
              >
                Products
              </motion.button>

              <AnimatePresence mode="wait">
                {currentCategory &&
                  <motion.div
                    key={currentCategory.name}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="flex flex-row items-center"
                  >
                    <FaChevronRight className="mx-2" />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      onClick={() => {
                        setCurrentSubcategory(undefined);
                        setCurrentType("");
                      }}
                    >
                      {currentCategory?.name}
                    </motion.button>
                  </motion.div>
                }
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {currentSubcategory &&
                  <motion.div
                    key={currentSubcategory.name}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="flex flex-row items-center"
                  >
                    <FaChevronRight className="mx-2" />

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      onClick={() => {
                        setCurrentType("");
                      }}
                    >
                      {currentSubcategory?.name}
                    </motion.button>
                  </motion.div>
                }
              </AnimatePresence>


              <AnimatePresence mode="wait">
                {currentType &&
                  <motion.div
                    key={currentType}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="flex flex-row items-center"
                  >
                    <FaChevronRight className="mx-2" />
                    {currentType}
                  </motion.div>
                }
              </AnimatePresence>
            </div>
          </div>
        </div>


        <div
          className="flex flex-col w-full min-h-screen h-full items-center justify-start"
        >
          <Collection products={products} />

        </div>
      </motion.div>
    </div>
  );
}

export default Products;