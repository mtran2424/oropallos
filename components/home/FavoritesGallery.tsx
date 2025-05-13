import { getFavorites } from "@/app/api/productapi";
import { useEffect, useState } from "react";
import { Product } from "@/components/global.utils";
import Image from "next/image";

const FavoritesGallery = () => {
  const [products, setProducts] = useState<Product[]>([]);
  // Fetch products from the server when the component mounts or refreshes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getFavorites();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };

    fetchProducts();
  }, []);
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-10 px-10 max-w-6xl">
      <div className="flex flex-col w-full items-start justify-start">
        <h1 className="text-2xl sm:text-4xl font-sans text-center sm:text-start text-red-900 mb-4">
          Michelle{'\''}s Picks
        </h1>
        <p className="text-xl text-start text-zinc-500 font-serif">
          Check out these favorites, curated by our owner and expert, Michelle Oropallo.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            {product.imageUrl && <Image src={product.imageUrl} alt={product.name} width={200} height={200} className="w-full h-auto rounded-lg" />}
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p>{product.description}</p>
            <p className="text-red-900 font-bold">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoritesGallery;