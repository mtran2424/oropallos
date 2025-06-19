import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";
import { Product } from "@/components/global.utils";
import SearchBar from "@/components/ui/SearchBar";
import Pagination from "@/components/ui/Pagination";

const PRODUCTS_PER_PAGE = 24;

const Collection = ({ products }: { products: Product[] }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("relevant");
  const productsRef = useRef<HTMLDivElement | null>(null);

  // Scroll to products grid on pagination/search/sort change
  useEffect(() => {
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentPage, searchTerm, sortOption]);

  // Search + Sort
  const sortedAndFilteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const sanitize = (str: string) =>
      str
        .normalize('NFD') // decompose accented characters into base + accent
        .replace(/[\u0300-\u036f]/g, '') // remove accents
        .replace(/[^a-z0-9]/gi, '') // remove non-alphanumerics
        .toLowerCase();

    const filtered = products.filter((product) =>
      [product.name, product.category, product.subcategory, product.type]
        .filter(Boolean)
        .some((field) => sanitize(field).includes(sanitize(term)))
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
      case "relevant":
        sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateA.getTime() - dateB.getTime();
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

      <div className="flex flex-col gap-2 md:flex-row items-center w-full max-w-7xl mt-2">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearchChange={handleSearchChange}
        />

        {/* Sort Dropdown */}
        <div className="flex justify-center md:justify-end w-full md:w-fit max-w-7xl">
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="relevant">Most Relevant</option>
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
          ref={productsRef}
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
      <Pagination
        prevClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        nextClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default Collection;
