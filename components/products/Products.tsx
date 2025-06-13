"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Product, ProductCategories, ProductCategory, ProductSubcategory, ProductType } from "@/components/global.utils";
import { FaChevronRight, FaFilter } from "react-icons/fa6";
import { useEffect, useMemo, useState } from "react";
import Collection from "./Collection";
// import { getProducts } from "@/app/api/productapi";
import { IoMdClose } from "react-icons/io";
import { useRouter, useSearchParams } from "next/navigation";
import CategoryDropdownFilter from "../utils/CategoryDropdownFilter";
import SubcategoryDropdownFilter from "../utils/SubcategoryDropdownFilter";
import FilterPath from "../utils/FilterPath";

// Products component - Displays a list of products with filters for categories, subcategories, and types
const Products = ({ products }: { products: Product[] }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category");
  const subcategoryParam = searchParams.get("subcategory");
  const typeParam = searchParams.get("type");

  // Current filter states
  const [currentCategory, setCurrentCategory] = useState<ProductCategory | undefined>(
    categoryParam ? ProductCategories
      .find((cat) => cat.value === categoryParam) : undefined
  );
  const [currentSubcategory, setCurrentSubcategory] = useState<ProductSubcategory | undefined>(
    categoryParam && subcategoryParam ? ProductCategories
      .find((cat) => cat.value === categoryParam)?.subcategories
      .find((subcat) => subcat.value === subcategoryParam) : undefined
  );
  const [currentType, setCurrentType] = useState<string>(typeParam || "");

  // State for expanded categories and subcategories
  const [expandedCategory, setExpandedCategory] = useState<boolean>(categoryParam ? true : false);
  const [expandedSubcategory, setExpandedSubcategory] = useState<boolean>(subcategoryParam ? true : false);
  const [seeMoreCategories, setSeeMoreCategories] = useState<boolean>(false);
  const [seeMoreTypes, setSeeMoreTypes] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  // Apply filters and products
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      if (currentCategory && product.category !== currentCategory.value) {
        return false;
      }
      if (currentSubcategory && product.subcategory !== currentSubcategory.value) {
        return false;
      }
      if (currentType && product.type !== currentType) {
        return false;
      }
      return true;
    });
    return filtered;
  }, [products, currentCategory, currentSubcategory, currentType]);

  // Menu container animation variants
  const menuContainerVariants = {
    hidden: {
      x: '100%', // starts completely off the screen to the right
      transition: { type: 'tween', duration: 0.3 }
    },
    visible: {
      x: 0, // slides into view
      transition: { type: 'tween', duration: 0.3 }
    }
  };

  // Sets category based on click or unsets if already selected
  const handleCategoryClick = (event: string, category: ProductCategory) => {
    if (event === "select") {
      if (currentCategory?.name === category.name) {
        setCurrentCategory(undefined);
        setExpandedCategory(false);
        const currentPath = window.location.pathname;
        router.push(currentPath)
      } else {
        setCurrentCategory(category);
        setExpandedCategory(true);
        router.push(`/products?category=${category.value}`);
      }
      setCurrentSubcategory(undefined)
      setExpandedSubcategory(false);
      setCurrentType("")
    }
    else if (event === "see more") {
      setSeeMoreCategories(!seeMoreCategories);
      setCurrentCategory(undefined);
      setCurrentSubcategory(undefined)
      setExpandedSubcategory(false);
      setCurrentType("")
      const currentPath = window.location.pathname;
      router.push(currentPath)
    }
  }

  // Sets subcategory based on click or unsets if already selected
  const handleSubcategoryClick = (event: string, subcategory: ProductSubcategory) => {
    if (event === "select") {
      // Unselect subcategory if already selected
      if (currentSubcategory && currentSubcategory.name === subcategory.name) {
        setCurrentSubcategory(undefined);
        setExpandedSubcategory(false);
        router.push(`/products?category=${currentCategory?.value}`);
      }
      else {
        // Expand subcategory if not already selected
        setCurrentSubcategory(subcategory);
        setExpandedSubcategory(true);
        router.push(`/products?category=${currentCategory?.value}&subcategory=${subcategory.value}`);
      }

      setCurrentType("");
    }
    else if (event === "see more") {
      setSeeMoreTypes(!seeMoreTypes);
      router.push(`/products?category=${currentCategory?.value}`);
      setCurrentSubcategory(undefined);
      setExpandedSubcategory(false);
    };
  };

  // Sets type based on click or unsets if already selected
  const handleTypeClick = (type: ProductType) => {
    // Logic to handle type filter
    if (currentType === type.name) {
      router.push(`/products?category=${currentCategory?.value}&subcategory=${currentSubcategory?.value}`);
      setCurrentType("");
    }
    else {
      router.push(`/products?category=${currentCategory?.value}&subcategory=${currentSubcategory?.value}&type=${type.value}`);
      setCurrentType(type.value);
    }
  }

  // Ensure that the menu is closed when the window is resized
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div>
      {/* Main Category List */}
      <div className="md:flex md:mt-25"></div>
      <CategoryDropdownFilter
        options={ProductCategories}
        currentOption={currentCategory}
        handleClick={handleCategoryClick}
      />

      {expandedCategory && currentCategory &&
        <SubcategoryDropdownFilter
          options={currentCategory.subcategories}
          currentOption={currentSubcategory}
          handleClick={handleSubcategoryClick}
        />
      }

      {/* Expanded Subcategory */}
      <AnimatePresence mode="wait">
        {expandedSubcategory &&
          currentSubcategory && currentSubcategory.types.length > 0 &&
          <div className="items-center justify-center">
            {/* Show all types */}
            <motion.ul
              key={currentSubcategory.name}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`hidden md:grid 
                ${currentSubcategory && currentSubcategory.types.length === 2 ? "grid-cols-8"
                  : currentSubcategory && currentSubcategory.types.length === 3 ? "grid-cols-12"
                    : "grid-cols-12 lg:grid-cols-16"
                }
              w-full items-start justify-center px-5 mt-2`}
            >
              {/* If liquor subcategory is selected, show liquor subtypes */}
              {currentCategory && currentSubcategory && currentSubcategory.types
                .map((type, index) => (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    key={index}
                    onClick={() => {
                      handleTypeClick(type);
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

        {/* Product Filter path component */}
        <div className="flex flex-col items-center">

          <div className="grid grid-cols-1 max-w-7xl w-full justify-center">
            <FilterPath
              category={currentCategory}
              subcategory={currentSubcategory}
              type={currentType}
              onClearClick={() => {
                // Unset filters and params and collapse filter dropdowns
                setCurrentCategory(undefined);
                setCurrentSubcategory(undefined);
                setCurrentType("");
                setExpandedCategory(false)
                setExpandedSubcategory(false);
                const currentPath = window.location.pathname;
                router.push(currentPath);
              }}
              onCategoryClick={() => {
                // Set category and show subcategories
                router.push(`/products?category=${currentCategory?.value}`)
                setCurrentSubcategory(undefined);
                setCurrentType("");

                // Collapse types
                setExpandedSubcategory(false);
              }}
              onSubcategoryClick={() => {
                // Unset types and set params for subcategory
                setCurrentType("");
                router.push(`/products?category=${currentCategory?.value}&subcategory=${currentSubcategory?.value}`);
              }}
              onTypeClick={() => {
                // Unset type
                setCurrentType("");
              }}
            />
          </div>
        </div>

        {/* Mobile Filter Button */}
        <motion.button
          onClick={() => setOpen(!open)}
          className='md:hidden fixed z-60 bottom-10 right-5 px-5'
          whileHover={{ scale: 1.1 }}
        >
          {/* Filter Icon */}
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key={"close"}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hover:text-[#FFBA04] transition duration-300 ease-in-out"
              >
                {/* Close filter icon */}
                <IoMdClose size={30} />
              </motion.div>
            ) : (
              <motion.div
                key={"filter"}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hover:text-[#FFBA04] transition duration-300 ease-in-out"
              >
                {/* Filter icon */}
                <FaFilter size={35} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Collection of Products */}
        <div
          className="flex flex-col w-full min-h-screen h-full items-center justify-start"
        >
          <Collection products={filteredProducts} />

        </div>
      </motion.div>

      {/* Mobile Filter Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            variants={menuContainerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="md:hidden fixed top-0 right-0 h-full w-3/4 max-w-xs bg-white shadow-lg z-50 font-serif"
          >
            {/* Header */}
            <h2 className="text-lg font-semibold text-zinc-900 mt-2 ml-2">Filters</h2>

            {/* Dropdown filters */}
            <div className="flex flex-col items-start gap-4 p-5 overflow-y-auto h-[90vh]">

              <label className="text-md font-semibold text-zinc-700 w-full text-left px-2 underline">Categories</label>
              {/* Category List */}
              {ProductCategories.map((category, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  onClick={() => {
                    handleCategoryClick("select", category);
                  }}
                  className="text-md lg:text-lg whitespace-nowrap font-serif cursor-pointer flex flex-row items-center"
                >
                  <motion.div animate={currentCategory?.name === category.name ? { rotate: 90 } : {}}>
                    <FaChevronRight className="mr-2" />
                  </motion.div>
                  <div className="text-md lg:text-lg whitespace-nowrap font-serif cursor-pointer underline-animate">
                    {category.name}
                  </div>
                </motion.div>
              ))}

              {/* Subcategory List - appears when category is selected */}
              <AnimatePresence mode="wait">
                {currentCategory && (
                  <motion.div
                    key={currentCategory.name}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="flex flex-col gap-4"
                  >
                    <label className="text-md font-semibold text-zinc-700 w-full text-left px-2 underline">
                      Subcategories
                    </label>
                    {currentCategory.subcategories.map((subcategory, index) => {
                      const isActive = currentSubcategory?.name === subcategory.name;

                      return (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          onClick={() =>
                            handleSubcategoryClick("select", subcategory)
                          }
                          className="text-md lg:text-lg whitespace-nowrap font-serif cursor-pointer flex flex-row items-center"
                        >
                          <motion.div animate={isActive ? { rotate: 90 } : {}}>
                            <FaChevronRight className="mr-2" />
                          </motion.div>
                          <div className="text-md lg:text-lg whitespace-nowrap font-serif cursor-pointer underline-animate">
                            {subcategory.name}
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Type List - appears when subcategory is selected */}
              <AnimatePresence mode="wait">
                {currentSubcategory && (
                  <motion.div
                    key={currentSubcategory.name}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="flex flex-col gap-4"
                  >
                    <label className="text-md font-semibold text-zinc-700 w-full text-left px-2 underline">
                      Types
                    </label>
                    {currentSubcategory.types.map((type, index) => {
                      return (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          onClick={() =>
                            handleTypeClick(type)
                          }
                          className="text-md lg:text-lg whitespace-nowrap font-serif cursor-pointer flex flex-row items-center"
                        >
                          <div className="text-md lg:text-lg whitespace-nowrap font-serif cursor-pointer underline-animate">
                            {type.name}
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Products;