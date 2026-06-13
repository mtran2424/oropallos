import { motion } from "framer-motion";
import { Product, Transaction } from "../global.utils";
import { useState } from "react";
import StatCard from "../ui/StatCard";
import DonutChart from "../utils/DonutChart";
import SidewaysBarChart from "../utils/SidewaysBarChart";
import LineGraph from "../utils/LineGraph";

const Sales = ({
  products,
  transactions
}: {
  products: Product[],
  transactions: Transaction[]
}) => {
  const date = new Date();
  const [inventory, setInventory] = useState<number>(products.reduce((sum, product) => sum + ((product.unitPrice ? product.unitPrice : 0) * product.unitCount), 0));
  const data = [
    { date: "Mon", sales: 1200 },
    { date: "Tue", sales: 1800 },
    { date: "Wed", sales: 1500 },
    { date: "Thu", sales: 2200 },
  ];
  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <div className="flex flex-col w-screen h-full justify-start px-10 gap-5 pt-5">
        {/* Header */}
        <h1 className="flex w-full text-xl sm:text-2xl font-serif font-semibold text-start text-zinc-900 mb-4 px-15">
          Sales Dashboard
        </h1>
        <div className="absolute h-screen w-screen rounded-full bg-white/20 blur-3xl" />

        <div className="grid lg:grid-cols-8 grid-cols-4 w-full items-center px-10 pb-5 gap-2">
          <StatCard
            title="Inventory On Hand"
            value={(inventory / 100).toFixed(2)}
            gradient="bg-linear-to-r from-violet-700 to-blue-600"
            columns="2"
          />
          <StatCard
            title="Liquor Sales"
            value={(inventory / 100).toFixed(2)}
            gradient="bg-linear-to-r from-blue-700 to-cyan-600"
            columns="2"
          />
          <StatCard
            title="Wine Sales"
            value={(inventory / 100).toFixed(2)}
            gradient="bg-linear-to-r from-cyan-700 to-emerald-600"
            columns="2"
          />
          <StatCard
            title="Total Sales"
            value={(inventory / 100).toFixed(2)}
            gradient="bg-linear-to-r from-emerald-700 to-emerald-200"
            columns="2"
          />
          <StatCard
            title="Overall Profit"
            value={(inventory / 100).toFixed(2)}
            gradient="bg-linear-to-r from-violet-700 to-blue-600"
            columns="2"
          />
          <StatCard
            title="Average Liquor Profit Margin"
            value={(inventory / 100).toFixed(2)}
            gradient="bg-linear-to-r from-blue-700 to-cyan-600"
            columns="2"
          />
          <StatCard
            title="Average Wine Profit Margin"
            value={(inventory / 100).toFixed(2)}
            gradient="bg-linear-to-r from-cyan-700 to-emerald-600"
            columns="2"
          />
          <StatCard
            title="Total Tax"
            value={(inventory / 100).toFixed(2)}
            gradient="bg-linear-to-r from-emerald-700 to-emerald-200"
            columns="2"
          />
        </div>
        {/* Graph Usage Examples
        <div className="grid grid-cols-2">
          <SidewaysBarChart title="Top 10 Bestsellers" data={[{ name: "Liquor", Qty: 100, fill: "#1447e6" }, { name: "Wines", Qty: 100, fill: "#1447e6" }]} unit="Qty" width={75} height={300} />
          <SidewaysBarChart title="Top 10 Bestsellers" data={[{ name: "Liquor", Qty: 100, fill: "#1447e6" }, { name: "Wines", Qty: 100, fill: "#1447e6" }]} unit="Qty" width={75} height={300} />
        </div>
        <LineGraph title="Weekly Sales" data={data} category="date" metric="sales"/> */}
      </div>
    </motion.div>
  );
}

export default Sales;