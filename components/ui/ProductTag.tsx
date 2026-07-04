import { motion } from "framer-motion";
import Image from "next/image"
import { CiImageOff } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { Product } from "@/components/global.utils";

/**
 * Tag component displaying product details
 * @param product Product - item being displayed
 * @param onDelete () => void - Function defining action on onClick of X icon
 * @returns 
 */
const ProductTag = ({
  product,
  onDelete
}: {
  product: Product;
  onDelete: () => void
}) => {
  return (
    <div className="grid grid-cols-5 text-xl justify-center items-center space-x-3 border border-zinc-300 rounded-lg px-2 py-1">
      {/* Close Button */}
      <motion.div
        key={"close"}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={onDelete}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex flex-col hover:text-[#FFBA04] items-center"
      >
        <IoMdClose size={25} />
      </motion.div>
      {/* Product image if applicable */}
      <div className="flex flex-col items-center">
        <div className="relative w-10 h-10 mx-auto mb-2 overflow-hidden rounded-lg">
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
                width={300}
                height={300}
              />
            </motion.div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-100">
              <CiImageOff size={40} className="text-zinc-400" />
            </div>
          )}
        </div>
      </div>
      {/* Product name and size */}
      <div className="col-span-3">
        {product.name + " - " + product.size}
      </div>

    </div>
  );
}

export default ProductTag;