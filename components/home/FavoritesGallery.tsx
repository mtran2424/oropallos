import { getFavorites } from "@/app/api/productapi";
import { useEffect, useState } from "react";
import { Product } from "@/components/global.utils";
import Image from "next/image";
import { motion } from "framer-motion";
import { CiSquareChevLeft, CiSquareChevRight } from "react-icons/ci";
import { redirect } from "next/navigation";

const FavoritesGallery = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [current, setCurrent] = useState(0);

  // Function to handle the previous and next button clicks
  const prev = () => setCurrent((prev) => (prev - 1 + products.length) % products.length);
  const next = () => setCurrent((prev) => (prev + 1) % products.length);

  // Displaces product relative to the current product
  const getPosition = (index: number) => {
    const offset = index - current;
    if (offset === 0) return 'center';
    if (offset === -1 || (current === 0 && index === products.length - 1)) return 'left';
    if (offset === 1 || (current === products.length - 1 && index === 0)) return 'right';
    return 'hidden';
  };

  // Fetch products from the API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getFavorites();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center px-10">
      {products.length > 0 ? <div>
        <div className="flex flex-col w-full items-start justify-start max-w-6xl">
          <h1 className="text-2xl sm:text-4xl font-sans text-center sm:text-start text-red-900 mb-4">
            Michelle{'\''}s Picks
          </h1>
          <p className="text-xl text-start text-zinc-500 font-serif">
            Check out these favorites, curated by our owner and resident expert, Michelle Oropallo.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative w-full flex items-center justify-center overflow-hidden">
          {/* Prev arrow */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={prev}
            className="absolute left-0 z-10 p-2"
          >
            <CiSquareChevLeft size={30} />
          </motion.button>

          <div className="flex items-center justify-center w-full h-[70vh] gap-4">
            {products.map((product, index) => {
              const position = getPosition(index);
              let scale = 0.8;
              let opacity = 0.3;
              let zIndex = 0;
              let x = '0%';

              if (position === 'center') {
                scale = 1;
                opacity = 1;
                zIndex = 10;
                x = '0%';
              } else if (position === 'left') {
                x = '-100%';
                zIndex = 5;
              } else if (position === 'right') {
                x = '100%';
                zIndex = 5;
              } else {
                opacity = 0;
              }

              return (
                <motion.div
                  key={index}
                  className="absolute flex flex-col items-center justify-center w-64 font-serif"
                  animate={{ scale, opacity, x, zIndex }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <div className="relative w-60 h-80">
                    {product.imageUrl && <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />}
                  </div>
                  <h1 className="mt-4 text-lg font-semibold text-zinc-800 text-center">{product.name}</h1>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="mt-2 px-4 py-2 text-white bg-red-900 border-1 border-red-900 rounded-full hover:bg-white hover:text-red-900 transition duration-300 ease-in-out"
                    onClick={() => {
                      redirect(`/products/${product.id}`);
                    }}
                  >
                    View Product
                  </motion.button>
                </motion.div>
              );
            })}
          </div>

          {/* Next arrow */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={next}
            className="absolute right-0 z-10 p-2">
            <CiSquareChevRight size={30} />
          </motion.button>
        </div>

      </div> : <></>}
    </div>
  );
};

export default FavoritesGallery;
