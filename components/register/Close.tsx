import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Transaction } from "../global.utils";
import { getCurrentBatchTransactions, getTransactions } from "@/app/api/transactionapi";

const Close = ({ initialTransactions }: { initialTransactions: Transaction[] }) => {
  const date = new Date();
  const { user } = useUser();
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

  // Fetch transactions on load and when refresh is toggled
    useEffect(() => {
      const fetchTransactions = async () => {
        try {
          const data = await getCurrentBatchTransactions(user?.username || '');
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
          Close Register
        </h1>

        <table className="w-full max-w-3/4 border-separate border-spacing-y-4">
          <tbody>
            <tr>
              {/* Liquor Sales */}
              <td className="text-lg">
                {date.toString()}
              </td>
              <td className="text-end text-lg">
                Register: {user?.username}
              </td>
            </tr>
            <tr>
              {/* Liquor Sales */}
              <td className="font-semibold text-lg">
                LIQUOR
              </td>
              <td className="text-end text-lg">
                <div className="flex flex-col">
                  <div>${grossLiquor.toFixed(2)}</div>
                  <div>34.5%</div>
                </div>
              </td>
            </tr>

            {/* Wine Sales */}
            <tr>
              <td className="font-semibold text-lg">
                WINE
              </td>
              <td className="text-end text-lg">
                <div className="flex flex-col">
                  <div>${grossWine.toFixed(2)}</div>
                  <div>65.5%</div>
                </div>
              </td>
            </tr>

            {/* Total Sales */}
            <tr>
              <td className="font-semibold text-lg">
                SUBTOTAL
              </td>
              <td className="text-end text-lg">
                <div>${grossTotal.toFixed(2)}</div>
              </td>
            </tr>

            {/* Total Tax */}
            <tr>
              <td className="font-semibold text-lg">
                TAX
              </td>
              <td className="text-end text-lg">
                <div>${taxTotal.toFixed(2)}</div>
              </td>
            </tr>

            {/* Total w/ Tax */}
            <tr>
              <td className="font-semibold text-lg">
                TTL + TAX
              </td>
              <td className="text-end text-lg">
                <div>${(grossTotal + taxTotal).toFixed(2)}</div>
              </td>
            </tr>

            {/* Discounts */}
            <tr>
              <td className="font-semibold text-lg">
                -% ITEM
              </td>
              <td className="text-end text-lg">
                <div>0 Q</div>
                  <div>-${discountTotal.toFixed(2)}</div>
              </td>
            </tr>

            <tr>
              <td className="font-semibold text-lg">
                VOID COUNT
              </td>
              <td className="text-end text-lg">
                0 Q
              </td>
            </tr>

            <tr>
              <td className="font-semibold text-lg">
                TRANSACTION COUNT
              </td>
              <td className="text-end text-lg">
                {transactions.length} Q
              </td>
            </tr>

            <tr>
              <td className="font-semibold text-lg">
                CASH
              </td>
              <td className="text-end text-lg">
                $0.00
              </td>
            </tr>

            <tr>
              <td className="font-semibold text-lg">
                CREDIT
              </td>
              <td className="text-end text-lg">
                $0.00
              </td>
            </tr>

            <tr>
              <td className="font-semibold text-lg">
                NET TOTAL
              </td>
              <td className="text-end text-lg">
                ${netTotal.toFixed(2)}
              </td>
            </tr>

          </tbody>
        </table>

      </div>
    </motion.div>
  );
}

export default Close;