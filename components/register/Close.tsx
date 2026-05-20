import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Transaction } from "../global.utils";
import {
  getCurrentBatchTransactions,
  // getTransactions,
} from "@/app/api/transactionapi";
import TextButton from "../ui/TextButton";
import { createBatch } from "@/app/api/batchapi";
import { useReactToPrint } from "react-to-print";

const Close = ({
  initialTransactions,
}: {
  initialTransactions: Transaction[];
}) => {
  const date = new Date();
  const { user } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions.filter((transaction) => transaction.batchId === null));
  const [refresh, setRefresh] = useState(false);

  // Printing
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Batch Report",
    pageStyle: `
    @page {
      size: 80mm auto;
      margin: 4mm;
    }

    @media print {
      html, body {
        width: 80mm;
        margin: 0;
        padding: 0;
      }

      .receipt {
        width: 72mm;
        font-family: monospace;
        font-size: 12px;
      }
    }
  `,
  })

  // Totals
  const [grossLiquor, setGrossLiquor] = useState(initialTransactions.reduce(
    (sum, transaction) => sum + transaction.liquorSubtotal,
    0,
  ));
  const [grossWine, setGrossWine] = useState(initialTransactions.reduce(
    (sum, transaction) => sum + transaction.wineSubtotal,
    0,
  ));
  const [grossTotal, setGrossTotal] = useState(initialTransactions.reduce(
    (sum, transaction) =>
      sum + transaction.wineSubtotal + transaction.liquorSubtotal,
    0,
  ));
  const [discountTotal, setDiscountTotal] = useState(initialTransactions.reduce(
    (sum, transaction) => sum + transaction.discount,
    0,
  ));
  const [discountQty, setDiscountQty] = useState(initialTransactions.filter((transaction) => transaction.discount > 0)
    .length,);
  const [taxTotal, setTaxTotal] = useState(initialTransactions.reduce((sum, transaction) => sum + transaction.tax, 0)
  );
  const [netTotal, setNetTotal] = useState(initialTransactions.reduce(
    (sum, transaction) => sum + transaction.total,
    0,
  ));
  const [creditTotal, setCreditTotal] = useState(initialTransactions.reduce(
    (sum, transaction) => sum + transaction.credit,
    0,
  ));
  const [cashTotal, setCashTotal] = useState(initialTransactions.reduce(
    (sum, transaction) => sum + transaction.cash,
    0,
  ));

  // Recalculate totals when transactions change
  const recalculateTotals = () => {
    setGrossLiquor(
      transactions.reduce(
        (sum, transaction) => sum + transaction.liquorSubtotal,
        0,
      )
    );
    setGrossWine(
      transactions.reduce(
        (sum, transaction) => sum + transaction.wineSubtotal,
        0,
      )
    );
    setGrossTotal(
      transactions.reduce(
        (sum, transaction) =>
          sum + transaction.wineSubtotal + transaction.liquorSubtotal,
        0,
      )
    );
    setDiscountTotal(
      transactions.reduce((sum, transaction) => sum + transaction.discount, 0)
    );
    setDiscountQty(
      transactions.filter((transaction) => transaction.discount > 0).length,
    );
    setTaxTotal(
      transactions.reduce((sum, transaction) => sum + transaction.tax, 0)
    );
    setNetTotal(
      transactions.reduce((sum, transaction) => sum + transaction.total, 0)
    );
    setCreditTotal(
      transactions.reduce((sum, transaction) => sum + transaction.credit, 0)
    );
    setCashTotal(
      transactions.reduce((sum, transaction) => sum + transaction.cash, 0)
    );
    // console.log("Cash total recalculated:", cashTotal);
    // console.log("Credit total recalculated:", creditTotal);
  };


  const batchTable = (
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
              <div>${(grossLiquor / 100).toFixed(2)}</div>
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
              <div>${(grossWine / 100).toFixed(2)}</div>
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
            <div>${(grossTotal / 100).toFixed(2)}</div>
          </td>
        </tr>

        {/* Total Tax */}
        <tr>
          <td className="font-semibold text-lg">TAX</td>
          <td className="text-end text-lg">
            <div>${(taxTotal / 100).toFixed(2)}</div>
          </td>
        </tr>

        {/* Total w/ Tax */}
        <tr>
          <td className="font-semibold text-lg">TTL + TAX</td>
          <td className="text-end text-lg">
            <div>${((grossTotal + taxTotal) / 100).toFixed(2)}</div>
          </td>
        </tr>

        {/* Discounts */}
        <tr>
          <td className="font-semibold text-lg">-% ITEM</td>
          <td className="text-end text-lg">
            <div>{discountQty} Q</div>
            <div>-${(discountTotal / 100).toFixed(2)}</div>
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
          <td className="text-end text-lg">${(cashTotal / 100).toFixed(2)}</td>
        </tr>

        <tr>
          <td className="font-semibold text-lg">CREDIT</td>
          <td className="text-end text-lg">${(creditTotal / 100).toFixed(2)}</td>
        </tr>

        <tr>
          <td className="font-semibold text-lg">NET TOTAL</td>
          <td className="text-end text-lg">${(netTotal / 100).toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  );

  const printableBatch = (
    <div ref={componentRef} className="flex flex-col w-full items-center p-5">
      <h1 className="text-2xl font-bold mb-4">OROPALLO'S</h1>
      <h1 className="text-2xl font-bold mb-4 text-center">WINE & LIQUOR</h1>
      <h1 className="text-xl mb-4">376 DIX AVENUE</h1>
      <h1 className="text-xl mb-4">QUEENSBURY, NY 12804</h1>
      <h1 className="text-2xl font-bold mb-4">518-798-3988</h1>
      <h1 className="text-2xl font-bold mb-4">Batch Report</h1>
      {batchTable}
    </div>
  );

  //TODO: Make confirmation popup for closing register with totals and option to print report

  // Create batch and submit transactions in batch
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

          <TextButton onClick={handlePrint}>Print Report</TextButton>

          {/* Confirm batch button */}
          <button
            className="text-lg rounded-md mt-2 px-3 py-2 text-white hover:text-blue-600 bg-blue-600 hover:bg-white border order-blue-600 transition-colors font-serif"
            onClick={handleSubmitBatch}
          >
            Close Register
          </button>
        </div>

        {batchTable}

        <div
          className="hidden"
        >
          <div
            className="print-area"
            ref={componentRef}
          >
            {printableBatch}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Close;
