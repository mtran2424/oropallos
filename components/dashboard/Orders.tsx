import React, { useState } from "react";
import { Product } from "../global.utils";
import { motion } from "framer-motion";

const Orders = ({ initialProducts }: { initialProducts: Product[] }) => {
  const [searchTerm, setSearchTerm] = useState<string>();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }

  const findProduct = (upc: string) => {
    return initialProducts.find((product) => product.upc === upc);
  };

  return (
    <div>
      <div className="flex flex-col justify-between items-start mb-3 space-y-4 px-2">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-zinc-900">Orders</h1>
        <motion.input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by name, category, subcategory, or type..."
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: "100%",
            opacity: 1,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden"
          style={{ whiteSpace: "nowrap" }}
        />
      </div>
    </div>);
}

export default Orders;