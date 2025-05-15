import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";
import { Product } from "@/components/global.utils";
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const PRODUCTS_PER_PAGE = 24;

const Collection = ({ products }: { products: Product[] }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [sortOption, setSortOption] = useState("popular");

  // Search + Sort
  const sortedAndFilteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const filtered = products.filter((product) =>
      [product.name, product.category, product.subcategory, product.type]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );

    const sorted = [...filtered];
    switch (sortOption) {
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-desc":
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "popular":
        sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        })
        break;

    }

    return sorted;
  }, [products, searchTerm, sortOption]);

  const totalPages = Math.ceil(sortedAndFilteredProducts.length / PRODUCTS_PER_PAGE);
  const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIdx = Math.min(startIdx + PRODUCTS_PER_PAGE, sortedAndFilteredProducts.length);
  const currentProducts = sortedAndFilteredProducts.slice(startIdx, endIdx);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full font-serif px-4">

      <div className="flex flex-col gap-2 md:flex-row items-center w-full max-w-7xl">
        {/* Search Bar */}
        <div className="flex flex-center items-center w-full mt-2 max-w-7xl">
          {isOpen ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => {
                setIsOpen(false);
                setSearchTerm("");
              }}
              className="text-gray-600 p-2 focus:outline-none"
            >
              <IoMdClose size={20} />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => {
                setIsOpen((prev) => !prev);
              }}
              className="text-gray-600 p-2 focus:outline-none"
            >
              <FaSearch size={20} />
            </motion.button>
          )}

          {/* Search Input */}
          <motion.input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name, category, subcategory, or type..."
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: isOpen ? "100%" : 0,
              opacity: isOpen ? 1 : 0,
              paddingLeft: isOpen ? "0.75rem" : "0rem",
              paddingRight: isOpen ? "0.75rem" : "0rem",
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden"
            style={{ whiteSpace: "nowrap" }}
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex justify-center md:justify-end w-full md:w-fit max-w-7xl">
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="popular">Most Popular</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low → High)</option>
            <option value="price-desc">Price (High → Low)</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage + searchTerm + sortOption}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-8 max-w-7xl w-full"
        >
          {currentProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Showing Count */}
      <p className="text-md font-semibold mb-2 text-zinc-500">
        Showing {endIdx} of {sortedAndFilteredProducts.length} products
      </p>

      {/* Pagination */}
      <div className="flex items-center space-x-2 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className={`px-4 py-2 rounded-full
            border-1 border-red-900 
            bg-red-900 disabled:border-0 disabled:bg-zinc-900 hover:bg-white
            text-white disabled:text-white hover:text-red-900
            transition-colors ease-in-out
            disabled:cursor-not-allowed disabled:opacity-50`}
        >
          Prev
        </motion.button>
        <span className="text-lg font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className={`px-4 py-2 rounded-full
            border-1 border-red-900 
            bg-red-900 disabled:border-0 disabled:bg-zinc-900 hover:bg-white
            text-white disabled:text-white hover:text-red-900
            transition-colors ease-in-out
            disabled:cursor-not-allowed disabled:opacity-50`}
        >
          Next
        </motion.button>
      </div>
    </div>
  );
};

export default Collection;
