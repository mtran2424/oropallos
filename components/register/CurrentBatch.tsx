import { AnimatePresence, motion } from "framer-motion";
import { formatDate, formatTime, getDiscount, managerTableColumns, noDiscount, Transaction, TransactionItem, transactionItemTableColumns } from "../global.utils";
import CopyButton from "../ui/CopyButton";
import { useCallback, useEffect, useRef, useState } from "react";
import { getCurrentBatchTransactions, updateTransactionStatus } from "@/app/api/transactionapi";
import { useUser } from "@clerk/nextjs";
import TextButton from "../ui/TextButton";
import toast from "react-hot-toast";

const CurrentBatch = ({ initialTransactions }: { initialTransactions: Transaction[] }) => {
  const { user } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions.filter((transaction) => transaction.batchId === null));
  const [refresh, setRefresh] = useState(false);

  // Totals
  const [grossLiquor, setGrossLiquor] = useState(initialTransactions.reduce((sum, transaction) => sum + transaction.liquorSubtotal, 0) / 100);
  const [grossWine, setGrossWine] = useState(initialTransactions.reduce((sum, transaction) => sum + transaction.wineSubtotal, 0) / 100);
  const [grossTotal, setGrossTotal] = useState(initialTransactions.reduce((sum, transaction) => sum + transaction.wineSubtotal + transaction.liquorSubtotal, 0) / 100);
  const [discountTotal, setDiscountTotal] = useState(initialTransactions.reduce((sum, transaction) => sum + transaction.discount, 0) / 100);
  const [taxTotal, setTaxTotal] = useState(initialTransactions.reduce((sum, transaction) => sum + transaction.tax, 0) / 100);
  const [netTotal, setNetTotal] = useState(initialTransactions.reduce((sum, transaction) => sum + transaction.total, 0) / 100);

  // Transaction Modal
  const modalRef = useRef<HTMLDivElement>(null);
  const [showTransaction, setShowTransaction] = useState(false);
  const [transactionItems, setTransactionItems] = useState<TransactionItem[]>([]);

  const handleShowTransaction = (transaction: Transaction) => {
    setShowTransaction(true);
    setTransactionItems(transaction.transactionItems);
  }

  const closeTransactionModal = () => {
    setShowTransaction(false);
    setTransactionItems([]);
  };

  const closeModalOnOutsideClick = useCallback((e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeTransactionModal();
    }
  }, []);

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
  // Action section to view transaction items
  const renderCell = (transaction: Transaction, column: keyof Transaction) => {
    switch (column) {
      case "id":
        return transaction.id;
      case "status":
        // TODO: Loading spinner for when status is being updated
        if (transaction.status === "Cashed")
          return (<TextButton onClick={() => handleStatusToggle(transaction.id || "", "Voided")}>
            Cashed
          </TextButton>)
        else if (transaction.status === "Voided")
          return (<TextButton onClick={() => handleStatusToggle(transaction.id || "", "Cashed")}>
            Voided
          </TextButton>)
      case "register":
        return transaction.register;
      case "liquorSubtotal":
        return `$${(transaction.liquorSubtotal / 100).toFixed(2)}`;
      case "wineSubtotal":
        return `$${(transaction.wineSubtotal / 100).toFixed(2)}`;
      case "discount":
        return `$${(transaction.discount / 100).toFixed(2)}`;
      case "tax":
        return `$${(transaction.tax / 100).toFixed(2)}`;
      case "total":
        return `$${(transaction.total / 100).toFixed(2)}`;
      case "cash":
        return `$${(transaction.cash / 100).toFixed(2)}`;
      case "credit":
        return `$${(transaction.credit / 100).toFixed(2)}`;
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
        return transaction.createdAt instanceof Date ? formatDate(transaction.createdAt, "mm/dd/yyyy") + " " + formatTime(transaction.createdAt) :
          transaction.createdAt ? formatDate(new Date(transaction.createdAt), "mm/dd/yyyy") + " " + formatTime(new Date(transaction.createdAt)) : "";
      default:
        return "";
    }
  }

  const renderTransactionItemCell = (item: TransactionItem, column: keyof TransactionItem) => {
    switch (column) {
      case "id":
        return item.id;
      case "name":
        return item.name;
      case "quantity":
        return item.quantity;
      case "unitPrice":
        return `$${(item.unitPrice / 100).toFixed(2)}`;
      case "discount":
        return getDiscount(item.discount).name;
      case "type":
        return item.type;
      default:
        return "";
    }
  }

  const handleStatusToggle = async (id: string, status: string) => {
    try {
      await updateTransactionStatus(id, status)
        .then((res) => {
          if (res.status === 200) {
            toast.success('Status changed successfully');
            setRefresh(!refresh);
          }
        });
    } catch (error) {
      console.error('Error updating transaction status:', error);
      toast.error('Failed to update transaction status');
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

  // Recalculate totals when transactions change
  useEffect(() => {
    recalculateTotals();
  }, [transactions]);

  useEffect(() => {
    if (showTransaction) {
      document.addEventListener('mousedown', closeModalOnOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', closeModalOnOutsideClick);
    };
  }, [closeModalOnOutsideClick, showTransaction]);

  return (
    <>
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <div className="flex flex-col w-full h-full items-center justify-start gap-5 divide-y divide-zinc-400">
          {/* Header */}
          <div className="flex w-full flex-col">
            <h1
              className="flex w-full text-xl sm:text-2xl font-serif font-semibold text-start text-zinc-900 px-15">
              Current Batch
            </h1>
            <h1
              className="flex w-full text-lg sm:text-xl font-serif text-start text-zinc-900 pb-4 px-15">
              Register: {user?.username}
            </h1>
          </div>

          {/* Sales stat Cluster */}
          <div className="grid lg:grid-cols-7 grid-cols-4 w-full items-center px-20 pb-5 divide-x divide-zinc-400">
            <div>
              <h2 className="text-center text-zinc-500 text-xl">Transactions:</h2>
              <h2 className="text-center font-semibold text-2xl">{transactions.length}</h2>
            </div>
            <div>
              <h2 className="text-center text-zinc-500 text-xl">Gross:</h2>
              <h2 className="text-center font-semibold text-2xl">${grossTotal.toFixed(2)}</h2>
            </div>
            <div>
              <h2 className="text-center text-zinc-500 text-xl">Wine Gross:</h2>
              <h2 className="text-center font-semibold text-2xl">${grossWine.toFixed(2)}</h2>
            </div>
            <div>
              <h2 className="text-center text-zinc-500 text-xl">Liquor Gross:</h2>
              <h2 className="text-center font-semibold text-2xl">${grossLiquor.toFixed(2)}</h2>
            </div>
            <div>
              <h2 className="text-center text-zinc-500 text-xl">Sales Tax:</h2>
              <h2 className="text-center font-semibold text-2xl">${taxTotal.toFixed(2)}</h2>
            </div>
            <div>
              <h2 className="text-center text-zinc-500 text-xl">Discount:</h2>
              <h2 className="text-center text-red-500 font-semibold text-2xl">-${discountTotal.toFixed(2)}</h2>
            </div>
            <div>
              <h2 className="text-center text-zinc-500 text-xl">Net:</h2>
              <h2 className="text-center text-green-600 font-semibold text-2xl">${netTotal.toFixed(2)}</h2>
            </div>
          </div>

          {/* Current Batch Data Table */}
          <div className="flex w-[80vw] max-h-[80vh] overflow-hidden rounded-md shadow-md text-zinc-800 px-5">
            {/* Spreadsheet */}
            <div className="flex overflow-auto w-screen px-5">
              {/* Product Table Start */}
              <table className="w-full divide-y divide-zinc-400" style={{ minWidth: "2000px" }}>
                {/* Table Headers */}
                <thead className="sticky top-0 bg-white z-20">
                  <tr>
                    {managerTableColumns.map((column) => (
                      <th
                        key={column.field}
                        className="px-4 py-3 text-left text-md font-medium uppercase tracking-widest whitespace-nowrap"
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
                      <tr key={transaction.id}
                        onClick={() => handleShowTransaction(transaction)}
                        className="hover:bg-zinc-200 transition duration-200"
                      >
                        {managerTableColumns.map((column) => (
                          // Render each cell based on the column field
                          <td
                            key={column.field}
                            className="px-4 py-3 text-xl align-center"
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
                      <td colSpan={managerTableColumns.length} className="text-center py-4 text-xl text-zinc-900">
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
      <AnimatePresence mode="wait">
        {showTransaction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-200">
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: "0" }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3 }}
              ref={modalRef}
              className="relative bg-white p-6 rounded-2xl max-w-[90vw] w-full shadow-lg max-h-[90vh] overflow-auto border border-zinc-500"
            >
              {/* Modal Header */}
              <h3 className="text-2xl text-zinc-900 mb-4 mt-2 text-left">Transaction Items</h3>

              {/* Close Modal Button */}
              <div className="absolute top-4 right-4">
                <TextButton onClick={closeTransactionModal}>
                  Close
                </TextButton>
              </div>

              <div className="flex w-full h-[75vh] overflow-hidden rounded-md shadow-md text-zinc-800 p-10">
                {/* Spreadsheet */}
                <div className="flex overflow-auto w-screen px-5">
                  {/* Product Table Start */}
                  <table className="w-full divide-y divide-zinc-400" style={{ minWidth: "2000px" }}>
                    {/* Table Headers */}
                    <thead className="sticky top-0 bg-white z-20">
                      <tr>
                        {transactionItemTableColumns.map((column) => (
                          <th
                            key={column.field}
                            className="px-4 py-3 text-left text-md font-medium uppercase tracking-widest whitespace-nowrap"
                            style={{ width: column.width }}
                          >
                            <strong>{column.label}</strong>
                          </th>
                        ))}
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-zinc-400">
                      {transactionItems.length > 0 ? (
                        transactionItems.map((transactionItem) => (
                          <tr key={transactionItem.id} className="hover:bg-zinc-200 transition duration-200">
                            {transactionItemTableColumns.map((column) => (
                              // Render each cell based on the column field
                              <td
                                key={column.field}
                                className="px-4 py-3 text-xl align-center"
                                style={{
                                  width: column.width,
                                  maxWidth: column.width,
                                  whiteSpace: "pre-line",
                                }}
                              >
                                {renderTransactionItemCell(transactionItem, column.field as keyof TransactionItem)}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={managerTableColumns.length} className="text-center py-4 text-xl text-zinc-900">
                            No transactions.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default CurrentBatch;