import { motion } from "framer-motion";
import { colorPool, Product, Transaction } from "../global.utils";
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
  const [liquorSales, setLiquorSales] = useState<number>(transactions.reduce((sum, transaction) => sum + transaction.liquorSubtotal, 0));
  const [salesTax, setSalesTax] = useState<number>(transactions.reduce((sum, transaction) => sum + transaction.tax, 0));
  const [wineSales, setWineSales] = useState<number>(transactions.reduce((sum, transaction) => sum + transaction.wineSubtotal, 0))
  const [liquorProfit, setLiquorProfit] = useState<number>(transactions.reduce((sum, transaction) => sum + transaction.transactionItems.reduce((sum, item) => sum + (item.type === "Liquor" ? sum + (item.itemPrice - (item.unitPrice ? item.unitPrice : 0)) : 0), 0), 0));
  const [wineProfit, setWineProfit] = useState<number>(transactions.reduce((sum, transaction) => sum + transaction.transactionItems.reduce((sum, item) => sum + (item.type === "Wine" ? sum + (item.itemPrice - (item.unitPrice ? item.unitPrice : 0)) : 0), 0), 0));

  const LiquorWineReport = [
    { name: 'Liquor', value: liquorSales, fill: colorPool[0] },
    { name: 'Wine', value: wineSales, fill: colorPool[1] }
  ]

  const items = transactions.flatMap((transaction) => transaction.transactionItems.map((item) => products.find((product) => product.id === item.productId)));
  const liquorBreakdown = Object.entries(
    items
      .filter((item) => item?.category === "Liquor")
      .reduce((count, item) => {
        if (item?.subcategory) {
          count[item.subcategory] =
            (count[item.subcategory] || 0) + 1;
        }
        return count;
      }, {} as Record<string, number>)
  ).map(([type, qty], index) => ({
    type,
    qty,
    fill: colorPool[index],
  }));
  const wineBreakdown = Object.entries(
    items
      .filter((item) => item?.category !== "Liquor")
      .reduce((count, item) => {
        if (item?.type) {
          count[item.type] =
            (count[item.type] || 0) + 1;
        }
        else if (item?.subcategory) {
          count[item.subcategory] =
            (count[item.subcategory] || 0) + 1;
        }
        return count;
      }, {} as Record<string, number>)
  ).map(([type, qty], index) => ({
    type,
    qty,
    fill: colorPool[index],
  }))

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
            value={(liquorSales / 100).toFixed(2)}
            gradient="bg-linear-to-r from-blue-700 to-cyan-600"
            columns="2"
          />
          <StatCard
            title="Wine Sales"
            value={(wineSales / 100).toFixed(2)}
            gradient="bg-linear-to-r from-cyan-700 to-emerald-600"
            columns="2"
          />
          <StatCard
            title="Total Sales"
            value={((liquorSales + wineSales) / 100).toFixed(2)}
            gradient="bg-linear-to-r from-emerald-700 to-emerald-200"
            columns="2"
          />
          <StatCard
            title="Overall Profit"
            value={((liquorProfit + wineProfit) / 100).toFixed(2)}
            gradient="bg-linear-to-r from-violet-700 to-blue-600"
            columns="2"
          />
          <StatCard
            title="Average Liquor Profit Margin"
            value={((liquorProfit / liquorSales) * 100).toFixed(2)}
            gradient="bg-linear-to-r from-blue-700 to-cyan-600"
            columns="2"
          />
          <StatCard
            title="Average Wine Profit Margin"
            value={((wineProfit / wineSales) * 100).toFixed(2)}
            gradient="bg-linear-to-r from-cyan-700 to-emerald-600"
            columns="2"
          />
          <StatCard
            title="Total Sales Tax"
            value={(salesTax / 100).toFixed(2)}
            gradient="bg-linear-to-r from-emerald-700 to-emerald-200"
            columns="2"
          />
        </div>
        <div className="grid grid-cols-2">
          <DonutChart
            title="Liquor/Wine Sale Report"
            data={LiquorWineReport}
            height={300}
            width={100}
            format
          />
          <DonutChart
            title="Liquor Breakdown"
            data={liquorBreakdown}
            dataKey="qty"
            nameKey="type"
            height={300}
            width={100}
          />
          <DonutChart
            title="Wine Breakdown"
            data={wineBreakdown}
            dataKey="qty"
            nameKey="type"
            height={300}
            width={100}
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