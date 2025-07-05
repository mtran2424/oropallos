"use client";
import { AnimatePresence, motion } from "framer-motion";
import { redirect, useParams } from "next/navigation";
import { Product } from "@/components/global.utils";
import { useState } from "react";
import Image from "next/image";
import { FaWineBottle } from "react-icons/fa";
import { MdWaterDrop } from "react-icons/md";
import { CiImageOff } from "react-icons/ci";
import RelatedProducts from "./RelevantProducts";
import { useRouter } from "next/navigation";
import ExpandButton from "../ui/ExpandButton";
import FilterPath from "../utils/FilterPath";
import { ProductCategory } from "@/components/global.utils";
import AvailableSizes from "./AvailableSizes";

const MAX_DESC_LENGTH = 200;

const ProductPage = ({ products }: { products: Product[] }) => {

  // Get the product ID from the URL
  const params = useParams();
  const id = params.id as string;

  const router = useRouter();

  // Manage the state of the description expansion
  const product = products ? products.find((p) => p.id === id) : undefined;
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const truncatedText = product?.description?.slice(0, MAX_DESC_LENGTH) + '...';

  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="my-35"
    >
      {/* Product Filter path component */}
      <div className="flex flex-col items-center mb-5">
        <div className="grid grid-cols-1 max-w-7xl w-full justify-center">
          <FilterPath
            category={product && ({ name: product.category.split("_").join(" "), value: product.category, subcategories: [] } as ProductCategory)}
            subcategory={product && { name: product.subcategory.split("_").join(" "), value: product.subcategory, types: [] }}
            type={product?.type}
            onClearClick={() => redirect("/products")}
            onCategoryClick={() => router.push(`/products?category=${product?.category}`)}
            onSubcategoryClick={() => router.push(`/products?category=${product?.category}&subcategory=${product?.subcategory}`)}
            onTypeClick={() => router.push(`/products?category=${product?.category}&subcategory=${product?.subcategory}&type=${product?.type}`)}
          />
        </div>
      </div>

      {/* Product Page */}
      <div className="flex flex-col items-center h-full min-h-screen mt-10">

        {/* Product Header */}
        <div className="flex flex-col w-full items-start justify-start px-10 max-w-7xl">
          <h1 className="text-2xl sm:text-3xl font-sans text-center sm:text-start text-red-900 mb-4">
            {product?.name} - {product?.size}
          </h1>
        </div>

        {/* Product Image and Content */}
        <div className="flex flex-col md:flex-row items-start justify-center gap-10 px-10 w-full h-full max-w-7xl">
          {/* Image */}
          <div className="flex flex-col w-full h-full items-center font-serif text-zinc-400 gap-2">
            {product && product.imageUrl ?
              <div className="relative w-full md:h-200 min-w-[300px] min-h-[300px]">
                <Image
                  src={product.imageUrl}
                  alt={product.name + " image"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain transform scale-110 hover:scale-100 transition-transform duration-700 ease-out w-full p-2"
                />
              </div>
              :
              <div className="w-full h-full flex items-center justify-center bg-zinc-100 rounded-lg min-h-[300px]">
                <CiImageOff size={200} className="text-zinc-400" />
              </div>
            }
            Disclaimer: Actual product may vary from image.
          </div>

          {/* Product Content */}
          <div className="flex flex-col items-start justify-start w-full h-full gap-10">

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
                <ExpandButton onClick={() => setIsDescExpanded(!isDescExpanded)}>
                  {isDescExpanded ? "Read less" : "Read more"}
                </ExpandButton>
              }
            </div>

            {/* Price and sizing */}
            <div>
              <p className="text-2xl font-sans text-red-900">${product?.price.toFixed(2)} USD</p>
              <p className="text-xl font-serif text-zinc-500">Size: {product?.size}</p>
            </div>

            {/* Details */}
            <div>
              <h1 className="text-xl font-sans text-left text-red-900">Product Details</h1>
              <p className="text-lg font-serif text-zinc-500">
                <FaWineBottle className="inline-block mr-2" />
                {product?.category.split("_").join(" ")}/
                {product?.subcategory.split("_").join(" ")}
                {product?.type ? "/" + product?.type.split("_").join(" ") : ""}
              </p>
              <p className="text-lg font-serif text-zinc-500">
                <MdWaterDrop className="inline-block mr-2" />
                {product?.abv ? `ABV: ${product?.abv.toFixed(1)}%` : "ABV: Not Available"}
              </p>
            </div>

            <AvailableSizes currentProduct={product} products={products} />

          </div>

        </div>

        {/* Related Products Section */}
        {product &&
          <RelatedProducts currentProduct={product} products={products} />
        }
      </div>
    </motion.div>
  );
}

export default ProductPage;