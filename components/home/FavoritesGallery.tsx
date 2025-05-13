import { getFavorites } from "@/app/api/productapi";
import { useEffect, useState } from "react";
import { Product } from "@/components/global.utils";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useKeenSlider } from "keen-slider/react";
import { CiSquareChevLeft, CiSquareChevRight } from "react-icons/ci";

const FavoritesGallery = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    renderMode: "performance",
    defaultAnimation: {
      duration: 400,
      easing: (t) => t,
    },
  });

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
    <div className="flex flex-col items-center justify-center gap-10 px-10">
      <div className="flex flex-col w-full items-start justify-start max-w-6xl">
        <h1 className="text-2xl sm:text-4xl font-sans text-center sm:text-start text-red-900 mb-4">
          Michelle{'\''}s Picks
        </h1>
        <p className="text-xl text-start text-zinc-500 font-serif">
          Check out these favorites, curated by our owner and resident expert, Michelle Oropallo.
        </p>
      </div>

      <div className="relative w-full flex items-center justify-center">
        <button
          onClick={() => instanceRef.current?.prev()}
          className="absolute left-2 z-30 bg-white/80 hover:bg-white text-zinc-800 p-2 rounded-full shadow"
        >
          <CiSquareChevLeft size={32} />
        </button>

        <div ref={sliderRef} className="keen-slider w-full">
          {products.map((product) => (
            <div
              key={product.id}
              className="keen-slider__slide relative h-full w-full flex items-center justify-center"
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden group">
                {product.imageUrl && (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain object-center z-0"
                    priority
                  />
                )}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  key={product.id}
                  className="absolute bottom-0 z-20 flex flex-col items-center w-full font-serif"
                >
                  <div className="text-zinc-800 p-8 w-full text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h2>
                    <p className="mb-6 text-2xl">{product.description}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          ))}
        </div>

        <button
          onClick={() => instanceRef.current?.next()}
          className="absolute right-2 z-30 bg-white/80 hover:bg-white text-zinc-800 p-2 rounded-full shadow"
        >
          <CiSquareChevRight size={32} />
        </button>
      </div>

      <div className="flex items-center gap-2 z-30 mt-4">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => instanceRef.current?.moveToIdx(i)}
            className={`h-3 w-3 rounded-full transition-transform duration-200 ${
              currentSlide === i ? "bg-zinc-800 scale-125" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesGallery;
