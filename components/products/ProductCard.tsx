import { Product } from "@/components/global.utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { redirect } from "next/navigation";
import { CiImageOff } from "react-icons/ci";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <motion.div
      className="flex flex-col bg-white shadow-md rounded-lg border-1 border-zinc-300 p-4 w-full min-w-[200px]"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={() => {
        redirect(`/products/${product.id}`);
      }}
    >
      {/* Product Image */}
      <div className="relative w-32 h-32 mx-auto mb-2 overflow-hidden rounded-lg">
        {product.imageUrl ? (
          <motion.div
            className="w-full h-full"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              priority
              src={product.imageUrl}
              alt={product.name}
              className="object-cover w-full h-full"
              width={200}
              height={200}
            />
          </motion.div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-100">
            <CiImageOff size={40} className="text-zinc-400" />
          </div>
        )}
      </div>

      <h2 className="text-md md:text-lg font-semibold mt-2 font-serif">{product.name} - {product.size}</h2>
      <p className="text-gray-700 mt-1 font-serif">${product.price.toFixed(2)} USD</p>
      <p className="text-gray-500 mt-1 font-serif">
        {product.category.split("_").join(" ")}/
        {product.subcategory.split("_").join(" ")}
        {product.type ? 
        "/" + product.type.split("_").join(" "):
        ""}
      </p>
      <p className="text-gray-500 mt-1 font-serif">
      </p>
      <p className="text-gray-500 mt-1 font-serif">
      </p>
    </motion.div>
  );
}

export default ProductCard;