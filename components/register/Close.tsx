import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Transaction } from "../global.utils";
import {
  getCurrentBatchTransactions,
  getTransactions,
} from "@/app/api/transactionapi";
import TextButton from "../ui/TextButton";
import { createBatch } from "@/app/api/batchapi";

const Close = ({
  initialTransactions,
}: {
  initialTransactions: Transaction[];
}) => {
  const date = new Date();
  const { user } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions.filter((transaction) => transaction.batchId === null));
  const [refresh, setRefresh] = useState(false);

  // TODO: Figure out state issue for cash and credit total updating to NaN

  // Totals
  const [grossLiquor, setGrossLiquor] = useState(
    initialTransactions.reduce(
      (sum, transaction) => sum + transaction.liquorSubtotal,
      0,
    ) / 100,
  );
  const [grossWine, setGrossWine] = useState(
    initialTransactions.reduce(
      (sum, transaction) => sum + transaction.wineSubtotal,
      0,
    ) / 100,
  );
  const [grossTotal, setGrossTotal] = useState(
    initialTransactions.reduce(
      (sum, transaction) =>
        sum + transaction.wineSubtotal + transaction.liquorSubtotal,
      0,
    ) / 100,
  );
  const [discountTotal, setDiscountTotal] = useState(
    initialTransactions.reduce(
      (sum, transaction) => sum + transaction.discount,
      0,
    ) / 100,
  );
  const [discountQty, setDiscountQty] = useState(
    initialTransactions.filter((transaction) => transaction.discount > 0)
      .length,
  );
  const [taxTotal, setTaxTotal] = useState(
    initialTransactions.reduce((sum, transaction) => sum + transaction.tax, 0) /
    100,
  );
  const [netTotal, setNetTotal] = useState(
    initialTransactions.reduce(
      (sum, transaction) => sum + transaction.total,
      0,
    ) / 100,
  );
  const [creditTotal, setCreditTotal] = useState(
    initialTransactions.reduce(
      (sum, transaction) => sum + transaction.credit,
      0,
    ) / 100,
  );
  const [cashTotal, setCashTotal] = useState(
    initialTransactions.reduce(
      (sum, transaction) => sum + transaction.cash,
      0,
    ) / 100,
  );

  // Recalculate totals when transactions change
  const recalculateTotals = () => {
    setGrossLiquor(
      transactions.reduce(
        (sum, transaction) => sum + transaction.liquorSubtotal,
        0,
      ) / 100,
    );
    setGrossWine(
      transactions.reduce(
        (sum, transaction) => sum + transaction.wineSubtotal,
        0,
      ) / 100,
    );
    setGrossTotal(
      transactions.reduce(
        (sum, transaction) =>
          sum + transaction.wineSubtotal + transaction.liquorSubtotal,
        0,
      ) / 100,
    );
    setDiscountTotal(
      transactions.reduce((sum, transaction) => sum + transaction.discount, 0) /
      100,
    );
    setDiscountQty(
      transactions.filter((transaction) => transaction.discount > 0).length,
    );
    setTaxTotal(
      transactions.reduce((sum, transaction) => sum + transaction.tax, 0) / 100,
    );
    setNetTotal(
      transactions.reduce((sum, transaction) => sum + transaction.total, 0) /
      100,
    );
    setCreditTotal(
      transactions.reduce((sum, transaction) => sum + transaction.credit, 0) /
      100,
    );
    setCashTotal(
      transactions.reduce((sum, transaction) => sum + transaction.cash, 0) /
      100,
    );
    // console.log("Cash total recalculated:", cashTotal);
    // console.log("Credit total recalculated:", creditTotal);
  };

  const handleSubmitBatch = async () => {
    try {
      const batch = {
        register: user?.username || "Unknown Register",
        wineGross: grossWine,
        liquorGross: grossLiquor,
        gross: grossTotal,
        tax: taxTotal,
        void: 0,
        cashTotal: cashTotal,
        creditTotal: creditTotal,
        discount: discountTotal,
        transactions: transactions.map((transaction) => ({
          id: transaction.id,
        })),
      }
      const res = await createBatch(batch).then((res) => {
        setRefresh((prev) => !prev);
        // setCart([]);
        // setCash(0);
        // setCredit(0);
        // setNote("");
        // setInput("");
        // setCashout(false);
        return res;
      });

      if (!res.ok) throw new Error("Transaction failed");
    } catch (err) {
      console.error(err);
    }
  }

  // Fetch transactions on load and when refresh is toggled
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getCurrentBatchTransactions(user?.username || "");
        setTransactions(data.transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [refresh]);

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
      <div className="flex flex-col w-screen h-full items-center justify-start px-10 gap-5">
        {/* Header */}
        <h1 className="flex w-full text-xl sm:text-2xl font-serif font-semibold text-start text-zinc-900 mb-4 px-15">
          Close Register
        </h1>

        {/* Theoretical feature */}
        <div className="grid grid-cols-5 w-3/4">
          <div className="flex flex-col gap-2">
            <label htmlFor="start-date">Select Date:</label>
            <input
              type="date"
              className="border p-2 rounded-md"
            // Native input value is always yyyy-mm-dd
            />
          </div>

          <div />
          <div />

          <TextButton onClick={() => { }}>Print Report</TextButton>

          <button
            className="text-lg rounded-md mt-2 px-3 py-2 text-white hover:text-blue-600 bg-blue-600 hover:bg-white border order-blue-600 transition-colors font-serif"
            onClick={handleSubmitBatch}
            >
            Close Register
          </button>
        </div>

        <table className="w-full max-w-3/4 border-separate border-spacing-y-4">
          <tbody>
            <tr>
              {/* Liquor Sales */}
              <td className="text-lg">{date.toString()}</td>
              <td className="text-end text-lg">Register: {user?.username}</td>
            </tr>
            <tr>
              {/* Liquor Sales */}
              <td className="font-semibold text-lg">LIQUOR</td>
              <td className="text-end text-lg">
                <div className="flex flex-col">
                  <div>${grossLiquor.toFixed(2)}</div>
                  <div>
                    {grossLiquor && grossTotal
                      ? ((grossLiquor / grossTotal) * 100).toFixed(1)
                      : "0.0"}
                    %
                  </div>
                </div>
              </td>
            </tr>

            {/* Wine Sales */}
            <tr>
              <td className="font-semibold text-lg">WINE</td>
              <td className="text-end text-lg">
                <div className="flex flex-col">
                  <div>${grossWine.toFixed(2)}</div>
                  <div>
                    {grossWine && grossTotal
                      ? ((grossWine / grossTotal) * 100).toFixed(1)
                      : "0.0"}
                    %
                  </div>
                </div>
              </td>
            </tr>

            {/* Total Sales */}
            <tr>
              <td className="font-semibold text-lg">SUBTOTAL</td>
              <td className="text-end text-lg">
                <div>${grossTotal.toFixed(2)}</div>
              </td>
            </tr>

            {/* Total Tax */}
            <tr>
              <td className="font-semibold text-lg">TAX</td>
              <td className="text-end text-lg">
                <div>${taxTotal.toFixed(2)}</div>
              </td>
            </tr>

            {/* Total w/ Tax */}
            <tr>
              <td className="font-semibold text-lg">TTL + TAX</td>
              <td className="text-end text-lg">
                <div>${(grossTotal + taxTotal).toFixed(2)}</div>
              </td>
            </tr>

            {/* Discounts */}
            <tr>
              <td className="font-semibold text-lg">-% ITEM</td>
              <td className="text-end text-lg">
                <div>{discountQty} Q</div>
                <div>-${discountTotal.toFixed(2)}</div>
              </td>
            </tr>

            <tr>
              <td className="font-semibold text-lg">VOID COUNT</td>
              <td className="text-end text-lg">0 Q</td>
            </tr>

            <tr>
              <td className="font-semibold text-lg">TRANSACTION COUNT</td>
              <td className="text-end text-lg">{transactions.length} Q</td>
            </tr>

            <tr>
              <td className="font-semibold text-lg">CASH</td>
              <td className="text-end text-lg">${cashTotal}</td>
            </tr>

            <tr>
              <td className="font-semibold text-lg">CREDIT</td>
              <td className="text-end text-lg">${creditTotal}</td>
            </tr>

            <tr>
              <td className="font-semibold text-lg">NET TOTAL</td>
              <td className="text-end text-lg">${netTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Close;
