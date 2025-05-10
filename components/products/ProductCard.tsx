import { Product } from "@/components/global.utils";
import Image from "next/image";
import { CiImageOff } from "react-icons/ci";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="flex flex-col bg-white shadow-md rounded-lg border-1 border-zinc-300 p-4 w-full min-w-[200px]">
      <div className="flex items-center justify-center">
        {product.imageUrl ? <Image
          priority
          src={``}
          alt={product.name}
          className="w-32 h-32 object-cover rounded-lg"
          width={200}
          height={200}
        /> : 
        <div className="w-32 h-32 rounded-lg flex items-center justify-center">
          <CiImageOff size={200} />
        </div>
      }
      </div>
      <h2 className="text-xl font-semibold mt-2 font-serif">{product.name}</h2>
      <p className="text-gray-700 mt-1 font-serif">${product.price.toFixed(2)} USD</p>
      <p className="text-gray-500 mt-1 font-serif">{product.category.split("_").join(" ")}</p>
      <p className="text-gray-500 mt-1 font-serif">{product.subcategory.split("_").join(" ")}</p>
      <p className="text-gray-500 mt-1 font-serif">{product.type.split("_").join(" ")}</p>
    </div>
  );
}

export default ProductCard;