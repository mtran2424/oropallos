import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatDate, formatTime, Transaction } from "../global.utils";
import { getCurrentUserBatchTransactions } from "@/app/api/transactionapi";
import TextButton from "../ui/TextButton";
import { createBatch } from "@/app/api/batchapi";
import { useReactToPrint } from "react-to-print";
import toast from "react-hot-toast/headless";
import Modal from "../ui/Modal";
import Receipt from "../utils/Receipt";

const Close = ({
  initialTransactions,
}: {
  initialTransactions: Transaction[];
}) => {
  const date = new Date();
  const { user } = useUser();
  const modalRef = useRef<HTMLDivElement>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions.filter((transaction) => transaction.batchId === null));
  const [refresh, setRefresh] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Printing
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Batch Report",
    pageStyle: `
    @page {
      size: 80mm auto;
      margin: 0;
    }

    @media print {
      html, body {
        width: 80mm;
        margin: 0;
        padding: 0;
      }

      .receipt {
        width: 78mm;
        font-family: monospace;
        font-size: 11px;
      }
    }
  `,
  })

  // Confirmation modal handlers
  // Open the modal
  const openEventModal = () => {
    setConfirm(true);
  };

  // Close the modal
  const closeEventModal = () => {
    setConfirm(false);
  };

  // Close the modal when clicking outside of it
  const closeModalOnOutsideClick = useCallback((e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeEventModal();
    }
  }, []);

  // Totals
  const [grossLiquor, setGrossLiquor] = useState(initialTransactions.filter((t) => t.status !== "Void").reduce(
    (sum, transaction) => sum + transaction.liquorSubtotal,
    0,
  ));
  const [grossWine, setGrossWine] = useState(initialTransactions.filter((t) => t.status !== "Void").reduce(
    (sum, transaction) => sum + transaction.wineSubtotal,
    0,
  ));
  const [grossTotal, setGrossTotal] = useState(initialTransactions.filter((t) => t.status !== "Void").reduce(
    (sum, transaction) =>
      sum + transaction.wineSubtotal + transaction.liquorSubtotal,
    0,
  ));
  const [discountTotal, setDiscountTotal] = useState(initialTransactions.filter((t) => t.status !== "Void").reduce(
    (sum, transaction) => sum + transaction.discount,
    0,
  ));
  const [discountQty, setDiscountQty] = useState(initialTransactions.filter((transaction) => transaction.discount > 0)
    .length,);
  const [taxTotal, setTaxTotal] = useState(initialTransactions.filter((t) => t.status !== "Void").reduce((sum, transaction) => sum + transaction.tax, 0)
  );
  const [netTotal, setNetTotal] = useState(initialTransactions.filter((t) => t.status !== "Void").reduce(
    (sum, transaction) => sum + transaction.total,
    0,
  ));
  const [creditTotal, setCreditTotal] = useState(initialTransactions.filter((t) => t.status !== "Void").reduce(
    (sum, transaction) => sum + transaction.credit,
    0,
  ));
  const [cashTotal, setCashTotal] = useState(initialTransactions.filter((t) => t.status !== "Void").reduce(
    (sum, transaction) => sum + transaction.cash,
    0,
  ));

  const [cardReceiptTotal, setCardReceiptTotal] = useState<number>(0)

  // Recalculate totals when transactions change
  const recalculateTotals = () => {
    setGrossLiquor(
      transactions.filter((t) => t.status !== "Void").reduce(
        (sum, transaction) => sum + transaction.liquorSubtotal,
        0,
      )
    );
    setGrossWine(
      transactions.filter((t) => t.status !== "Void").reduce(
        (sum, transaction) => sum + transaction.wineSubtotal,
        0,
      )
    );
    setGrossTotal(
      transactions.filter((t) => t.status !== "Void").reduce(
        (sum, transaction) =>
          sum + transaction.wineSubtotal + transaction.liquorSubtotal,
        0,
      )
    );
    setDiscountTotal(
      transactions.filter((t) => t.status !== "Void").reduce((sum, transaction) => sum + transaction.discount, 0)
    );
    setDiscountQty(
      transactions.filter((transaction) => transaction.discount > 0).length,
    );
    setTaxTotal(
      transactions.filter((t) => t.status !== "Void").reduce((sum, transaction) => sum + transaction.tax, 0)
    );
    setNetTotal(
      transactions.filter((t) => t.status !== "Void").reduce((sum, transaction) => sum + transaction.total, 0)
    );
    setCreditTotal(
      transactions.filter((t) => t.status !== "Void").reduce((sum, transaction) => sum + transaction.credit, 0)
    );
    setCashTotal(
      transactions.filter((t) => t.status !== "Void").reduce((sum, transaction) => sum + transaction.cash, 0)
    );
  };

  const batchTable = (
    <table className="w-full max-w-3/4 border-separate border-spacing-y-2">
      <tbody>
        <tr>
          {/* Liquor Sales */}
          <td className="">{formatDate(date, "mm/dd/yyyy")} <br /> {formatTime(date)}</td>
          <td className="text-end">Register: <br /> {user?.username}</td>
        </tr>
        <tr>
          {/* Liquor Sales */}
          <td className="font-semibold">LIQUOR</td>
          <td className="text-end">
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
          <td className="font-semibold">WINE</td>
          <td className="text-end">
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
          <td className="font-semibold">SUBTOTAL</td>
          <td className="text-end">
            <div>${(grossTotal / 100).toFixed(2)}</div>
          </td>
        </tr>

        {/* Total Tax */}
        <tr>
          <td className="font-semibold">TAX</td>
          <td className="text-end">
            <div>${(taxTotal / 100).toFixed(2)}</div>
          </td>
        </tr>

        {/* Total w/ Tax */}
        <tr>
          <td className="font-semibold">TTL + TAX</td>
          <td className="text-end">
            <div>${((grossTotal + taxTotal) / 100).toFixed(2)}</div>
          </td>
        </tr>

        {/* Discounts */}
        <tr>
          <td className="font-semibold">-% ITEM</td>
          <td className="text-end">
            <div>{discountQty} Q</div>
            <div>-${(discountTotal / 100).toFixed(2)}</div>
          </td>
        </tr>

        <tr>
          <td className="font-semibold">VOID COUNT</td>
          <td className="text-end">{transactions.filter((t) => t.status === "Void").length} Q</td>
        </tr>

        <tr>
          <td className="font-semibold">TRANSACTION COUNT</td>
          <td className="text-end">{transactions.length} Q</td>
        </tr>

        <tr>
          <td className="font-semibold">CASH</td>
          <td className="text-end">${(cashTotal / 100).toFixed(2)}</td>
        </tr>

        <tr>
          <td className="font-semibold">CREDIT</td>
          <td className="text-end">${(creditTotal / 100).toFixed(2)}</td>
        </tr>

        <tr>
          <td className="font-semibold">NET TOTAL</td>
          <td className="text-end">${(netTotal / 100).toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  );

  const printableBatch = (
    <Receipt ref={componentRef} title="Batch Report">
      {batchTable}
    </Receipt>
  );

  // Create batch and submit transactions in batch
  const handleSubmitBatch = async () => {
    try {
      setLoading(true);

      const batch = {
        register: user?.username || "Unknown Register",
        wineGross: grossWine,
        liquorGross: grossLiquor,
        gross: grossTotal,
        tax: taxTotal,
        void: transactions.filter((t) => t.status === "Void").reduce((sum, transaction) => sum + transaction.total, 0),
        cashTotal: cashTotal,
        creditTotal: creditTotal,
        discount: discountTotal,
        cardReceiptTotal: parseInt((cardReceiptTotal * 100).toFixed(0)),
        transactions: transactions.map((transaction) => ({
          id: transaction.id,
        })),
      }
      const res = await createBatch(batch).then((res) => {
        setRefresh((prev) => !prev);
        setConfirm(false);
        return res;
      });

      if (!res.ok) {
        setLoading(false);
        toast.error("Batch failed");
        throw new Error("Batch failed");
      }
      else {
        setLoading(false);
        toast.success("Batch successful")
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Fetch transactions on load and when refresh is toggled
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getCurrentUserBatchTransactions(user?.username || "");
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

  // Add event listener for closing the modal when clicking outside of it
  useEffect(() => {
    if (confirm) {
      document.addEventListener('mousedown', closeModalOnOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', closeModalOnOutsideClick);
    };
  }, [closeModalOnOutsideClick, confirm]);

  return (
    <>
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <div className="flex flex-col w-full min-w-[80vw] h-full items-center justify-start px-10 gap-5 pt-5">
          {/* Header */}
          <h1 className="flex w-full text-xl sm:text-2xl font-serif font-semibold text-start text-zinc-900 mb-4 px-15">
            Close Register
          </h1>

          {/* Theoretical feature */}
          <div className="grid grid-cols-5 w-3/4">
            {/* <div className="flex flex-col gap-2">
              <label htmlFor="start-date">Select Date:</label>
              <input
                type="date"
                className="border p-2 rounded-md"
              // Native input value is always yyyy-mm-dd
              />
            </div> */}

            <div />
            <div />
            <div />

            <TextButton onClick={handlePrint}>Print Report</TextButton>

            {/* Confirm batch button */}
            <button
              className="h-20 text-xl rounded-md mt-2 px-3 py-2 text-white hover:text-blue-600 bg-blue-600 hover:bg-white border order-blue-600 transition-colors font-serif"
              onClick={openEventModal}
              disabled={user?.username === "admin"}
            >
              Close Register
            </button>
          </div>

          <div className="flex justify-center w-full text-2xl">
            {batchTable}
          </div>

          <div className="hidden">
            <div
              className="print-area receipt"
              ref={componentRef}
            >
              {printableBatch}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Confirmation modal */}
      <Modal open={confirm} title="Are you sure?" onClose={closeEventModal} ref={modalRef} height="max-h-[50vh]" width="max-w-2xl">

        <div className="flex flex-col gap-4 mb-15">
          <label className="text-xl text-zinc-700 w-full text-left px-2">
            Date: {formatDate(date, "mm/dd/yyyy")} {formatTime(date)}
          </label>

          <label className="text-xl text-zinc-700 w-full text-left px-2">
            Closing Register: {user?.username}
          </label>

          <label className="text-lg font-semibold text-zinc-700 w-full text-left px-2">Card Receipt Total From Batch</label>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            className="border border-zinc-500 rounded-lg text-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
            placeholder="Card Total"
            onChange={(e) => {
              const value = e.target.value;
              setCardReceiptTotal(parseFloat(value));
            }}
            value={cardReceiptTotal || "0"}
          />
        </div>

        {/* Card Receipt Field */}

        <div className="flex flex-col items-center gap-2">
          {/* Loading Spinner */}
          {loading ? (
            <div className="flex justify-center items-center py-2">
              <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="text-2xl font-semibold w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out"
              onClick={handleSubmitBatch}
            >
              Submit
            </motion.button>
          )}

          <TextButton onClick={handlePrint}>Print Report</TextButton>
        </div>

      </Modal>
    </>
  );
};

export default Close;
