"use client";
import { getProducts } from "@/app/api/productapi";
import { Product } from "@/components/global.utils";
import ProductCard from "@/components/products/ProductCard";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const PRODUCTS_PER_PAGE = 3;

const RelatedProducts = ({ currentProduct }: {
  currentProduct: Product;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1); // for slide animation

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on the current product's subcategory
  const filtered = products
    .filter(
      (p) =>
        p.id !== currentProduct.id &&
        p.subcategory === currentProduct.subcategory
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const startIdx = (page - 1) * PRODUCTS_PER_PAGE;
  const paginated = filtered.slice(startIdx, startIdx + PRODUCTS_PER_PAGE);

  return (
    <div className="mt-20 w-full max-w-7xl px-10 font-serif">
      {/* Header */}
      <h2 className="text-2xl font-sans text-red-900 mb-6">Related Products</h2>

      {/* Products Display */}
      <div className="relative min-h-[300px]">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -50 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 absolute w-full"
          >
            {paginated.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          {/* Previous Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            onClick={() => {
              setDirection(-1);
              setPage((p) => Math.max(1, p - 1));
            }}
            disabled={page === 1}
            className={`px-4 py-2 rounded-full
            border-1 border-red-900 
            bg-red-900 disabled:border-0 disabled:bg-zinc-900 hover:bg-white
            text-white disabled:text-white hover:text-red-900
            transition-colors ease-in-out
            disabled:cursor-not-allowed disabled:opacity-50`}
          >
            Previous
          </motion.button>
          <span className="text-sm font-medium">
            Page {page} of {totalPages}
          </span>
          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            onClick={() => {
              setDirection(1);
              setPage((p) => Math.min(totalPages, p + 1));
            }}
            disabled={page === totalPages}
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
      )}
    </div>
  );
};

export default RelatedProducts;
