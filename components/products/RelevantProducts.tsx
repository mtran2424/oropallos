// components/RelatedProducts.tsx
"use client";
import { getProducts } from "@/app/api/productapi";
import { Product } from "@/components/global.utils";
import ProductCard from "@/components/products/ProductCard";
import { useEffect, useState } from "react";

type RelatedProductsProps = {
  currentProduct: Product
};

const RelatedProducts = ({ currentProduct }: RelatedProductsProps) => {
  const [products, setProducts] = useState<Product[]>();
  const filtered = products ? products
    .filter(p => p.id !== currentProduct.id && p.subcategory == currentProduct.subcategory)
    .sort((a, b) => a.name.localeCompare(b.name)) : [];

  // Fetch products from the server when the component mounts or refreshes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="mt-20 w-full max-w-7xl px-10">
      <h2 className="text-2xl font-sans text-red-900 mb-6">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
