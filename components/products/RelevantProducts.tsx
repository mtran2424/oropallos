"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Product } from "@/components/global.utils";
import ProductCard from "@/components/products/ProductCard";
import Pagination from "@/components/ui/Pagination";

const PRODUCTS_PER_PAGE = 3;

const RelatedProducts = (
  {
    currentProduct,
    products
  }: {
    currentProduct: Product;
    products: Product[];
  }) => {
  // const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1); // for slide animation

  // Filter products based on the current product's subcategory
  const filtered = products
    .filter(
      (p) =>
        p.id !== currentProduct.id &&
        p.category === currentProduct.category &&
        p.subcategory === currentProduct.subcategory
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const startIdx = (page - 1) * PRODUCTS_PER_PAGE;
  const paginated = filtered.slice(startIdx, startIdx + PRODUCTS_PER_PAGE);

  return (
    <div className="mt-20 w-full max-w-7xl px-10 font-serif h-full">
      {/* Header */}
      <h2 className="text-2xl font-sans text-red-900 mb-6">Related Products</h2>

      {/* Products Display */}
      <div className="relative min-h-75 mb-8">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -50 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full h-full"
          >
            {paginated.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          prevClick={() => {
            setDirection(-1);
            setPage((p) => Math.max(1, p - 1));
          }}
          nextClick={() => {
            setDirection(1);
            setPage((p) => Math.min(totalPages, p + 1));
          }}
          currentPage={page}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};

export default RelatedProducts;
