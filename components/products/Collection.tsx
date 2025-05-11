import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";
import { Product } from "@/components/global.utils";

const PRODUCTS_PER_PAGE = 25;

const Collection = ({ products }: { products: Product[] }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered product list
  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return products.filter((product) =>
      [product.name, product.category, product.subcategory, product.type]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
  }, [products, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIdx = Math.min(startIdx + PRODUCTS_PER_PAGE, filteredProducts.length);
  const currentProducts = filteredProducts.slice(startIdx, endIdx);

  // Reset to page 1 when search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full font-serif px-4">
      {/* Search Bar */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search by name, category, subcategory, or type..."
        className="w-full max-w-md px-4 py-2 mt-6 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Products Grid with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage + searchTerm} // triggers animation on page/search change
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 py-8 max-w-7xl w-full"
        >
          {currentProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Showing X of Y */}
      <p className="text-md font-semibold mb-2 text-zinc-500">
        Showing {endIdx} of {filteredProducts.length} products
      </p>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-2 mb-8">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Prev
        </button>
        <span className="text-lg font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Collection;
