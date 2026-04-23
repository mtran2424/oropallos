import { motion } from "framer-motion";
import { managerTableColumns, Transaction } from "../global.utils";
import CopyButton from "../ui/CopyButton";
import { useEffect, useState } from "react";
import { getTransactions } from "@/app/api/transactionapi";

const Manager = ({ initialTransactions }: { initialTransactions: Transaction[] }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [refresh, setRefresh] = useState(false);

  // Totals
  const [grossLiquor, setGrossLiquor] = useState(initialTransactions.reduce((sum, transaction) => sum + transaction.liquorSubtotal, 0) / 100);
  const [grossWine, setGrossWine] = useState(initialTransactions.reduce((sum, transaction) => sum + transaction.wineSubtotal, 0) / 100);
  const [grossTotal, setGrossTotal] = useState(initialTransactions.reduce((sum, transaction) => sum + transaction.wineSubtotal + transaction.liquorSubtotal, 0) / 100);
  const [discountTotal, setDiscountTotal] = useState(initialTransactions.reduce((sum, transaction) => sum + transaction.discount, 0) / 100);
  const [taxTotal, setTaxTotal] = useState(initialTransactions.reduce((sum, transaction) => sum + transaction.tax, 0) / 100);
  const [netTotal, setNetTotal] = useState(initialTransactions.reduce((sum, transaction) => sum + transaction.total, 0) / 100);

  // Recalculate totals when transactions change
  const recalculateTotals = () => {
    setGrossLiquor(transactions.reduce((sum, transaction) => sum + transaction.liquorSubtotal, 0) / 100);
    setGrossWine(transactions.reduce((sum, transaction) => sum + transaction.wineSubtotal, 0) / 100);
    setGrossTotal(transactions.reduce((sum, transaction) => sum + transaction.wineSubtotal + transaction.liquorSubtotal, 0) / 100);
    setDiscountTotal(transactions.reduce((sum, transaction) => sum + transaction.discount, 0) / 100);
    setTaxTotal(transactions.reduce((sum, transaction) => sum + transaction.tax, 0) / 100);
    setNetTotal(transactions.reduce((sum, transaction) => sum + transaction.total, 0) / 100);
  }

  // TODO: Make popup to show items in transaction when transaction is clicked on
  const renderCell = (transaction: Transaction, column: keyof Transaction) => {
    switch (column) {
      case "id":
        return transaction.id;
      case "status":
        return transaction.status;
      case "register":
        return transaction.register;
      case "liquorSubtotal":
        return `$${(transaction.liquorSubtotal/100).toFixed(2)}`;
      case "wineSubtotal":
        return `$${(transaction.wineSubtotal/100).toFixed(2)}`;
      case "discount":
        return `$${(transaction.discount/100).toFixed(2)}`;
      case "tax":
        return `$${(transaction.tax/100).toFixed(2)}`;
      case "total":
        return `$${(transaction.total/100).toFixed(2)}`;
      case "notes":
        return (
          <div
            className="flex flex-col items-center justify-center space-y-2"
          >
            <textarea
              readOnly
              className="w-full h-22.5 border border-zinc-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={transaction.notes || ""}
            ></textarea>
            {transaction.notes && <CopyButton text={transaction.notes} />}
          </div>)
      case "createdAt":
        return transaction.createdAt instanceof Date ? transaction.createdAt.toString() : transaction.createdAt;
      default:
        return "";
    }
  }

  // Fetch transactions on load and when refresh is toggled
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data.transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [refresh]);

  // Recalculate totals when transactions change
  useEffect(() => {
    recalculateTotals();
  }, [transactions]);

  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <div className="flex flex-col w-screen h-full min-h-screen items-center justify-start px-10 gap-5">
        {/* Header */}
        <h1
          className="flex w-full text-xl sm:text-2xl font-serif font-semibold text-start text-zinc-900 mb-4 px-15">
          Manager
        </h1>

        {/* Sales stat Cluster */}
        <div className="grid lg:grid-cols-7 grid-cols-4 w-full items-center px-20">
          <div>
            <h2 className="text-zinc-500 text-xl">Transactions:</h2>
            <h2 className="font-semibold text-2xl">{transactions.length}</h2>
          </div>
          <div>
            <h2 className="text-zinc-500 text-xl">Gross:</h2>
            <h2 className="font-semibold text-2xl">${grossTotal.toFixed(2)}</h2>
          </div>
          <div>
            <h2 className="text-zinc-500 text-xl">Wine Gross:</h2>
            <h2 className="font-semibold text-2xl">${grossWine.toFixed(2)}</h2>
          </div>
          <div>
            <h2 className="text-zinc-500 text-xl">Liquor Gross:</h2>
            <h2 className="font-semibold text-2xl">${grossLiquor.toFixed(2)}</h2>
          </div>
          <div>
            <h2 className="text-zinc-500 text-xl">Sales Tax:</h2>
            <h2 className="font-semibold text-2xl">${taxTotal.toFixed(2)}</h2>
          </div>
          <div>
            <h2 className="text-zinc-500 text-xl">Discount:</h2>
            <h2 className="text-red-500 font-semibold text-2xl">-${discountTotal.toFixed(2)}</h2>
          </div>
          <div>
            <h2 className="text-zinc-500 text-xl">Net:</h2>
            <h2 className="text-green-600 font-semibold text-2xl">${netTotal.toFixed(2)}</h2>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex max-w-[90vw] max-h-[65vh] overflow-hidden rounded-md shadow-md border border-zinc-400 text-zinc-800">
          {/* Spreadsheet */}
          <div className="flex overflow-auto w-screen">
            {/* Product Table Start */}
            <table className="w-full divide-y divide-zinc-400" style={{ minWidth: "2000px" }}>
              {/* Table Headers */}
              <thead className="sticky top-0 bg-white z-20">
                <tr>
                  {managerTableColumns.map((column) => (
                    <th
                      key={column.field}
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest whitespace-nowrap"
                      style={{ width: column.width }}
                    >
                      <strong>{column.label}</strong>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-zinc-400">
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-zinc-200 transition duration-200">
                      {managerTableColumns.map((column) => (
                        // Render each cell based on the column field
                        <td
                          key={column.field}
                          className="px-4 py-3 text-sm align-center"
                          style={{
                            width: column.width,
                            maxWidth: column.width,
                            whiteSpace: "pre-line",
                          }}
                        >
                          {renderCell(transaction, column.field as keyof Transaction)}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                <tr>
                  <td colSpan={managerTableColumns.length} className="text-center py-4 text-zinc-900">
                    No transactions.
                  </td>
                </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Manager;