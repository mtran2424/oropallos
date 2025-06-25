import { Product } from "@/components/global.utils";
import Link from "next/link";

const AvailableSizes = ({
  currentProduct,
  products
}: {
  currentProduct: Product | undefined;
  products: Product[];
}) => {
  const sizes = products.filter(p => p.name === currentProduct?.name).sort((a, b) => a.size.localeCompare(b.size)) ;

  return (
    <div>
      <h1 className="text-xl font-sans text-left text-red-900">Available Sizes</h1>
      {sizes.map((product, index) => (
        <p
          className="text-lg font-serif font-semibold text-zinc-500"
          key={index}
        >
          <Link
            href={`/products/${product?.id}`}
            className="underline-animate hover:text-red-900 transition-colors duration-300">
            {product?.size}
          </Link>
        </p>
      ))}
    </div>

  );
}

export default AvailableSizes;