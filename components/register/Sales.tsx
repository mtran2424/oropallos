import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getBatches } from "@/app/api/batchapi";
import { getTransactions } from "@/app/api/transactionapi";
import {
  Batch,
  colorPool,
  getDateObject,
  getDateTime,
  Product,
  Transaction
} from "@/components/global.utils";
import DonutChart from "@/components/utils/charts/DonutChart";
import SidewaysBarChart from "@/components/utils/charts/SidewaysBarChart";
import LineGraph from "@/components/utils/charts/LineGraph";
import StatCard from "@/components/ui/StatCard";

interface breakdownObject {
  type: string,
  value: number,
  fill: string
}

interface reportObject {
  name: string,
  value: number,
  fill?: string
}

const Sales = ({
  products,
  initialTransactions,
  initialBatches,
}: {
  products: Product[],
  initialTransactions: Transaction[],
  initialBatches: Batch[]
}) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [batches, setBatches] = useState<Batch[]>(initialBatches);
  const [items, setItems] = useState<{ product: Product | undefined, value: number, quantity: number }[]>(
    initialTransactions.flatMap((transaction) =>
      transaction.transactionItems.map((item) => {
        return { product: item.product, value: item.itemPrice * item.quantity, quantity: item.quantity }
      })));
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [inventory, setInventory] = useState<number>(products.reduce((sum, product) => sum + ((product.unitPrice ? product.unitPrice : 0) * product.unitCount), 0));
  const [liquorSales, setLiquorSales] = useState<number>(initialTransactions.reduce((sum, transaction) => sum + transaction.tax, 0));
  const [salesTax, setSalesTax] = useState<number>(initialTransactions.reduce((sum, transaction) => sum + transaction.tax, 0));
  const [wineSales, setWineSales] = useState<number>(initialTransactions.reduce((sum, transaction) => sum + transaction.wineSubtotal, 0));
  const [liquorProfit, setLiquorProfit] = useState<number>(
    initialTransactions.reduce((transactionSum, transaction) => {
      return (
        transactionSum +
        transaction.transactionItems.reduce((itemSum, item) => {
          return (
            itemSum +
            (item.type === "Liquor"
              ? item.itemPrice - (item.unitPrice ?? 0)
              : 0)
          );
        }, 0)
      );
    }, 0));
  const [wineProfit, setWineProfit] = useState<number>(
    initialTransactions.reduce((transactionSum, transaction) => {
      return (
        transactionSum +
        transaction.transactionItems.reduce((itemSum, item) => {
          return (
            itemSum +
            (item.type === "Wine"
              ? item.itemPrice - (item.unitPrice ?? 0)
              : 0)
          );
        }, 0)
      );
    }, 0));
  const [liquorBreakdown, setLiquorBreakdown] = useState<breakdownObject[]>(
    Object.entries(
      items
        .filter((item) => item.product?.category === "Liquor")
        .reduce((count, item) => {
          if (item.product?.subcategory) {
            count[item.product?.subcategory] =
              (count[item.product?.subcategory] || 0) + (item.value);
          }
          return count;
        }, {} as Record<string, number>)
    ).map(([type, value], index) => ({
      type,
      value,
      fill: colorPool[index],
    })));
  const [wineBreakdown, setWineBreakdown] = useState<breakdownObject[]>(
    Object.entries(
      items
        .filter((item) => item?.product?.category !== "Liquor")
        .reduce((count, item) => {
          if (item.product?.type) {
            count[item.product?.type] =
              (count[item.product?.type] || 0) + item.value;
          }
          else if (item.product?.subcategory) {
            count[item.product?.subcategory] =
              (count[item.product?.subcategory] || 0) + item.value;
          }
          return count;
        }, {} as Record<string, number>)
    ).map(([type, value], index) => ({
      type,
      value,
      fill: colorPool[index],
    })));
  const [liquorWineReport, setLiquorWineReport] = useState<reportObject[]>([
    { name: 'Liquor', value: liquorSales, fill: colorPool[0] },
    { name: 'Wine', value: wineSales, fill: colorPool[1] }
  ]);
  const [frequencyByValueReport, setFrequencyByValueReport] = useState<breakdownObject[]>(
    Object.entries(
      items
        .reduce((count, item) => {
          if (item.product)
            count[item.product.name] =
              (count[item.product.name] || 0) + item.value;
          return count;
        }, {} as Record<string, number>)
    ).map(([type, value], index) => ({
      type,
      value,
      fill: colorPool[2],
    })).sort((a, b) =>
      (b.value || 0) - (a.value || 0)
    ).slice(0, 14));

  const [frequencyByVolumeReport, setFrequencyByVolumeReport] = useState<breakdownObject[]>(
    Object.entries(
      items
        .reduce((count, item) => {
          if (item.product)
            count[item.product.name] =
              (count[item.product.name] || 0) + item.quantity;
          return count;
        }, {} as Record<string, number>)
    ).map(([type, value], index) => ({
      type,
      value,
      fill: colorPool[3],
    })).sort((a, b) =>
      (b.value || 0) - (a.value || 0)
    ).slice(0, 14));



  const [salesReport, setSalesReport] = useState(
    Object.entries(
      initialBatches
        .reduce((count, batch) => {
          count[getDateTime(batch.date)] = batch.gross / 100;
          return count;
        }, {} as Record<string, number>)
    ).map(([date, sales], index) => ({
      date,
      sales
    })));


  const recalculateTotals = () => {
    setItems(
      transactions.flatMap((transaction) =>
        transaction.transactionItems.map((item) => {
          return { product: item.product, value: item.quantity * item.itemPrice, quantity: item.quantity }
        }))
    );

    setLiquorBreakdown(
      Object.entries(
        items
          .filter((item) => item.product?.category === "Liquor")
          .reduce((count, item) => {
            if (item.product?.subcategory) {
              count[item.product?.subcategory] =
                (count[item.product?.subcategory] || 0) + item.value;
            }
            return count;
          }, {} as Record<string, number>)
      ).map(([type, value], index) => ({
        type,
        value,
        fill: colorPool[index],
      }))
    );

    setWineBreakdown(
      Object.entries(
        items
          .filter((item) => item?.product?.category !== "Liquor")
          .reduce((count, item) => {
            if (item.product?.type) {
              count[item.product?.type] =
                (count[item.product?.type] || 0) + item.value;
            }
            else if (item.product?.subcategory) {
              count[item.product?.subcategory] =
                (count[item.product?.subcategory] || 0) + item.value;
            }
            return count;
          }, {} as Record<string, number>)
      ).map(([type, value], index) => ({
        type,
        value,
        fill: colorPool[index],
      }))
    );

    setInventory(
      products.reduce((sum, product) => sum + ((product.unitPrice ? product.unitPrice : 0) * product.unitCount), 0)
    );

    setLiquorSales(
      transactions.reduce((sum, transaction) => sum + transaction.liquorSubtotal, 0)
    );

    setWineSales(
      transactions.reduce((sum, transaction) => sum + transaction.wineSubtotal, 0)
    );

    setSalesTax(
      transactions.reduce((sum, transaction) => sum + transaction.tax, 0)
    );

    setLiquorProfit(
      transactions.reduce((transactionSum, transaction) => {
        return (
          transactionSum +
          transaction.transactionItems.reduce((itemSum, item) => {
            return (
              itemSum +
              (item.type === "Liquor"
                ? item.itemPrice - (item.unitPrice ?? 0)
                : 0)
            );
          }, 0)
        );
      }, 0));

    setWineProfit(
      transactions.reduce((transactionSum, transaction) => {
        return (
          transactionSum +
          transaction.transactionItems.reduce((itemSum, item) => {
            return (
              itemSum +
              (item.type === "Wine"
                ? item.itemPrice - (item.unitPrice ?? 0)
                : 0)
            );
          }, 0)
        );
      }, 0));

    setLiquorWineReport([
      { name: 'Liquor', value: liquorSales, fill: colorPool[0] },
      { name: 'Wine', value: wineSales, fill: colorPool[1] }
    ]);

    setFrequencyByValueReport(
      Object.entries(
        items
          .reduce((count, item) => {
            if (item.product)
              count[item.product.name] =
                (count[item.product.name] || 0) + item.value;
            return count;
          }, {} as Record<string, number>)
      ).map(([type, value], index) => ({
        type,
        value,
        fill: colorPool[2],
      })).sort((a, b) =>
        (b.value || 0) - (a.value || 0)
      ).slice(0, 14)
    );

    setFrequencyByVolumeReport(
      Object.entries(
        items
          .reduce((count, item) => {
            if (item.product)
              count[item.product.name] =
                (count[item.product.name] || 0) + item.quantity;
            return count;
          }, {} as Record<string, number>)
      ).map(([type, value], index) => ({
        type,
        value,
        fill: colorPool[3],
      })).sort((a, b) =>
        (b.value || 0) - (a.value || 0)
      ).slice(0, 14)
    );

    setSalesReport(
      Object.entries(
        batches
          .reduce((count, batch) => {
            count[getDateTime(batch.date)] = batch.gross / 100;
            return count;
          }, {} as Record<string, number>)
      ).map(([date, sales], index) => ({
        date,
        sales
      })));
  };

  useEffect(() => {
    setBatches(initialBatches.filter((batch) => {
      if (!batch.date) return false;

      const batchDate = new Date(batch.date);

      if (startDate) {
        const startObject = getDateObject(startDate);
        const start = new Date(
          startObject.year,
          startObject.month,
          startObject.day
        );

        if (batchDate < start) return false;
      }

      if (endDate) {
        const endObject = getDateObject(endDate);
        const end = new Date(
          endObject.year,
          endObject.month,
          endObject.day
        );

        // Include the entire end day
        end.setHours(23, 59, 59, 999);

        if (batchDate > end) return false;
      }

      return true;
    }))

    setTransactions(initialTransactions.filter((transaction) => {
      if (!transaction.createdAt) return false;

      const transactionDate = new Date(transaction.createdAt);

      if (startDate) {
        const startObject = getDateObject(startDate);
        const start = new Date(
          startObject.year,
          startObject.month,
          startObject.day
        );

        if (transactionDate < start) return false;
      }

      if (endDate) {
        const endObject = getDateObject(endDate);
        const end = new Date(
          endObject.year,
          endObject.month,
          endObject.day
        );

        // Include the entire end day
        end.setHours(23, 59, 59, 999);

        if (transactionDate > end) return false;
      }

      return true;
    }))
  }, [startDate, endDate]);

  // Fetch batches on load and when refresh is toggled
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const data = await getBatches();
        setBatches(data.batches);
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };

    const fetchTransactions = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data.transactions);
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };

    fetchTransactions();
    fetchBatches();
  }, [initialTransactions, initialBatches]);

  useEffect(() => {
    recalculateTotals();
  }, [transactions, batches]);

  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <div className="flex flex-row w-full">

        <div className="flex flex-col w-full h-full justify-start px-10 gap-5 pt-5">
          {/* Header */}
          <h1 className="flex w-full text-xl sm:text-2xl font-serif font-semibold text-start text-zinc-900 mb-4 px-15">
            Sales Dashboard
          </h1>
          <div className="absolute h-screen w-screen rounded-full bg-white/20 blur-3xl" />

          {/* Stat card cluster*/}
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
          {/* Graphs and figures */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
            <DonutChart
              title="Liquor/Wine Sale Report"
              data={liquorWineReport}
              height={300}
              width={95}
              format
              nameKey="name"
              dataKey="value"
            />
            <DonutChart
              title="Liquor Breakdown"
              data={liquorBreakdown}
              dataKey="value"
              nameKey="type"
              height={300}
              width={95}
              format
            />
            <DonutChart
              title="Wine Breakdown"
              data={wineBreakdown}
              dataKey="value"
              nameKey="type"
              format
              height={300}
              width={95}
            />
            <SidewaysBarChart
              title="Top 15 Bestsellers By Value"
              data={frequencyByValueReport}
              dataKey="value"
              nameKey="type"
              format
              width={95}
              height={300}
            />

            <SidewaysBarChart
              title="Top 15 Bestsellers By Volume"
              data={frequencyByVolumeReport}
              dataKey="value"
              nameKey="type"
              width={95}
              height={300}
            />

            <LineGraph title="Daily Sales" data={salesReport} category="date" metric="sales" height={500} />
          </div>
          {/* Graph Usage Examples
        <div className="grid grid-cols-2">
          <SidewaysBarChart title="Top 10 Bestsellers" data={[{ name: "Liquor", Qty: 100, fill: "#1447e6" }, { name: "Wines", Qty: 100, fill: "#1447e6" }]} unit="Qty" width={75} height={300} />
        </div>
        */}
        </div>

        {/* Sidebar Filter Menu */}
        <div className="hidden lg:flex p-5 justify-start self-start sticky top-5 h-fit">
          <div className="flex flex-col border-gray-400 border p-5 rounded w-full h-1/4 min-w-70 overflow-hidden">
            {/* Close filter */}
            <div className="flex w-full justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="text-md text-blue-500 hover:text-zinc-200"
              // onClick={handleClearClick}
              >
                Clear
              </motion.button>
            </div>
            {/* Title */}
            <h2 className="flex text-lg font-semibold text-zinc-900 mb-2">Data Filters</h2>

            {/* Filter Categories */}
            <div className="flex flex-col overflow-auto h-full space-y-2 pb-10">
              <div className="flex flex-col gap-2">
                <label htmlFor="start-date">Start Date:</label>
                <input
                  type="date"
                  className="border p-2 rounded-md z-100"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value)
                  }}
                // Native input value is always yyyy-mm-dd
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="start-date">End Date:</label>
                <input
                  type="date"
                  className="border p-2 rounded-md z-100"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value)
                  }}
                // Native input value is always yyyy-mm-dd
                />
              </div>
            </div>
          </div>

        </div>
      </div>

    </motion.div>
  );
}

export default Sales;