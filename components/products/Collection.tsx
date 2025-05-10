import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";

const products = [
  { name: "Tito's Handmade Vodka 1.75L", price: 36.99, category: "Vodka", subcategory: "Plain", type: "American" },
  { name: "Grey Goose Vodka 750ml", price: 29.99, category: "Vodka", subcategory: "Premium", type: "French" },
  { name: "Jack Daniel's Tennessee Whiskey 1L", price: 42.99, category: "Whiskey", subcategory: "Tennessee", type: "Sour Mash" },
  { name: "Jameson Irish Whiskey 750ml", price: 34.99, category: "Whiskey", subcategory: "Irish", type: "Blended" },
  { name: "Maker's Mark Bourbon 750ml", price: 37.99, category: "Whiskey", subcategory: "Bourbon", type: "Kentucky" },
  { name: "Patrón Silver Tequila 750ml", price: 49.99, category: "Tequila", subcategory: "Silver", type: "Jalisco" },
  { name: "Casamigos Blanco Tequila 750ml", price: 47.99, category: "Tequila", subcategory: "Blanco", type: "Jalisco" },
  { name: "Don Julio Reposado 750ml", price: 58.99, category: "Tequila", subcategory: "Reposado", type: "Jalisco" },
  { name: "Hendrick's Gin 750ml", price: 38.99, category: "Gin", subcategory: "Premium", type: "Scottish" },
  { name: "Tanqueray Gin 750ml", price: 29.99, category: "Gin", subcategory: "London Dry", type: "British" },
  { name: "Bacardi Superior Rum 1L", price: 19.99, category: "Rum", subcategory: "White", type: "Puerto Rican" },
  { name: "Captain Morgan Spiced Rum 750ml", price: 22.99, category: "Rum", subcategory: "Spiced", type: "Caribbean" },
  { name: "Ciroc Vodka 750ml", price: 39.99, category: "Vodka", subcategory: "Flavored", type: "French" },
  { name: "Belvedere Vodka 750ml", price: 42.99, category: "Vodka", subcategory: "Premium", type: "Polish" },
  { name: "Johnnie Walker Black Label 750ml", price: 44.99, category: "Whiskey", subcategory: "Scotch", type: "Blended" },
  { name: "The Macallan 12 Year Scotch 750ml", price: 69.99, category: "Whiskey", subcategory: "Scotch", type: "Single Malt" },
  { name: "Glenfiddich 12 Year Scotch 750ml", price: 64.99, category: "Whiskey", subcategory: "Scotch", type: "Single Malt" },
  { name: "Remy Martin VSOP Cognac 750ml", price: 55.99, category: "Cognac", subcategory: "VSOP", type: "French" },
  { name: "Hennessy VS Cognac 750ml", price: 49.99, category: "Cognac", subcategory: "VS", type: "French" },
  { name: "Courvoisier VS Cognac 750ml", price: 46.99, category: "Cognac", subcategory: "VS", type: "French" },
];

const PRODUCTS_PER_PAGE = 25;

const Collection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIdx = Math.min(startIdx + PRODUCTS_PER_PAGE, products.length);
  const currentProducts = products.slice(startIdx, endIdx);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full font-serif">
      {/* Showing X of Y */}
      <p className="text-lg font-semibold mb-4">
        Showing {endIdx} of {products.length} products
      </p>

      {/* Products Grid with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage} // triggers animation on page change
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 py-8"
        >
          {currentProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </motion.div>
      </AnimatePresence>

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
