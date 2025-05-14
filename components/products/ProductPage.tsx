"use client";
import { AnimatePresence, motion } from "framer-motion";
import { redirect, useParams } from "next/navigation";
import { Product } from "@/components/global.utils";
import { useEffect, useState } from "react";
import { getProduct } from "@/app/api/productapi";
import Image from "next/image";
import { FaChevronRight, FaWineBottle } from "react-icons/fa";
import { MdWaterDrop } from "react-icons/md";

const MAX_DESC_LENGTH = 200;

const ProductPage = () => {
  const [product, setProduct] = useState<Product>();

  // Get the product ID from the URL
  const params = useParams();
  const id = params.id as string;

  // Manage the state of the description expansion
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const truncatedText = product?.description?.slice(0, MAX_DESC_LENGTH) + '...';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data.product);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);
  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="my-25"
    >
      {/* Product Filter path component */}
      <div className="flex flex-col items-center mb-5">
        <div className="grid grid-cols-1 max-w-7xl w-full justify-center">
          {/* Filter Path */}
          <div className="flex flex-row items-center px-5 font-serif text-md">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              onClick={() => {
                redirect("/products");
              }}
            >
              Products
            </motion.button>

            {/* General Categories - Red Wine, White Wine, Liquor, etc... */}
            <AnimatePresence mode="wait">
              {product && product.category &&
                <motion.div
                  key={product.category}
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
                    }}
                  >
                    {product?.category}
                  </motion.button>
                </motion.div>
              }
            </AnimatePresence>

            {/* Subcategories - Flavor Profiles, liquor types, etc... */}
            <AnimatePresence mode="wait">
              {product && product.subcategory &&
                <motion.div
                  key={product.subcategory}
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
                    }}
                  >
                    {product.subcategory}
                  </motion.button>
                </motion.div>
              }
            </AnimatePresence>


            <AnimatePresence mode="wait">
              {product && product.type &&
                <motion.div
                  key={product.type}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="flex flex-row items-center"
                >
                  <FaChevronRight className="mx-2" />
                  {product.type}
                </motion.div>
              }
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Product Page */}
      <div className="flex flex-col items-center h-full h-min-screen mt-10">

        {/* Product Header */}
        <div className="flex flex-col w-full items-start justify-start px-10 max-w-7xl">
          <h1 className="text-2xl sm:text-3xl font-sans text-center sm:text-start text-red-900 mb-4">
            {product?.name}
          </h1>
        </div>

        {/* Product Image and Content */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 px-10 w-full h-full max-w-7xl">
          {/* Image */}
          {product && product.imageUrl &&
            <div className="relative w-full h-200 font-serif text-zinc-400 min-w-[300px]">
              <Image
                src={product.imageUrl}
                alt={product.name + " image"}
                fill
                className="object-contain transform scale-110 hover:scale-100 transition-transform duration-700 ease-out w-full"
              />
              Disclaimer: Actual product may vary from image.
            </div>
          }

          {/* Product Content */}
          <div className="flex flex-col items-start justify-start w-full h-full space-y-4">

            {/* Description Logic */}
            <div>
              <h1 className="text-2xl font-sans text-left text-red-900">Description</h1>
              {product && product.description ? <AnimatePresence initial={false}>
                <motion.div
                  key={isDescExpanded ? 'expanded' : 'collapsed'}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="text-xl text-left text-zinc-500 font-serif">
                    {isDescExpanded ? product?.description : truncatedText}
                  </p>
                </motion.div>
              </AnimatePresence> :
                <p className="text-xl text-left text-zinc-500 font-serif">
                  No description available.
                </p>}

              {product && product.description &&
                <motion.button
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                  className="text-lg rounded-full mt-2 px-3 py-2 text-white hover:text-red-900 bg-red-900 hover:bg-white border border-red-900 transition-colors font-serif"
                >
                  {isDescExpanded ? "Read less" : "Read more"}
                </motion.button>}
            </div>

            <p className="text-2xl font-sans text-red-900">${product?.price.toFixed(2)} USD</p>
            <p className="text-xl font-serif text-zinc-500">Size: {product?.size}</p>


            <h1 className="text-2xl font-sans text-left text-red-900">Product Details</h1>
            {/* Details */}
            <p className="text-lg font-serif text-zinc-500">
              <FaWineBottle className="inline-block mr-2" />
              {product?.category}/
              {product?.subcategory}
              {product?.type ? "/" + product?.type : ""}
            </p>
            <p className="text-lg font-serif text-zinc-500">
              <MdWaterDrop  className="inline-block mr-2" />
              {product?.abv ? `ABV: ${product?.abv.toFixed(1)}%` : "ABV: Not Available"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductPage;