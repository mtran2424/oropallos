import { motion } from "framer-motion";
import { formatDate, formatTime, getDiscount, managerTableColumns, Transaction, TransactionItem, transactionItemTableColumns } from "../global.utils";
import CopyButton from "../ui/CopyButton";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getCurrentBatchTransactions, updateTransactionStatus } from "@/app/api/transactionapi";
import { useUser } from "@clerk/nextjs";
import TextButton from "../ui/TextButton";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";

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

  const sortedTransactions = useMemo(() => {
    return transactions.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });
  }, [transactions]);

  // Transaction Modal
  const modalRef = useRef<HTMLDivElement>(null);
  const [showTransaction, setShowTransaction] = useState(false);
  const [transactionItems, setTransactionItems] = useState<TransactionItem[]>([]);
  const [loadingStatus, setLoadingStatus] = useState<{id: string, state: boolean}>({id: "", state: false});

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
    setGrossLiquor(transactions.filter((t) => t.status === "Cashed").reduce((sum, transaction) => sum + transaction.liquorSubtotal, 0) / 100);
    setGrossWine(transactions.filter((t) => t.status === "Cashed").reduce((sum, transaction) => sum + transaction.wineSubtotal, 0) / 100);
    setGrossTotal(transactions.filter((t) => t.status === "Cashed").reduce((sum, transaction) => sum + transaction.wineSubtotal + transaction.liquorSubtotal, 0) / 100);
    setDiscountTotal(transactions.filter((t) => t.status === "Cashed").reduce((sum, transaction) => sum + transaction.discount, 0) / 100);
    setTaxTotal(transactions.filter((t) => t.status === "Cashed").reduce((sum, transaction) => sum + transaction.tax, 0) / 100);
    setNetTotal(transactions.filter((t) => t.status === "Cashed").reduce((sum, transaction) => sum + transaction.total, 0) / 100);
  }

  // Action section to view transaction items
  const renderCell = (transaction: Transaction, column: keyof Transaction) => {
    switch (column) {
      case "id":
        return transaction.id;
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
      setLoadingStatus({id, state: true});

      await updateTransactionStatus(id, status)
        .then((res) => {
          if (res.status === 200) {
            toast.success('Status changed successfully');
            setRefresh(!refresh);
            setLoadingStatus({id: "", state: false});
          }
        });
    } catch (error) {
      console.error('Error updating transaction status:', error);
      toast.error('Failed to update transaction status');
      setLoadingStatus({id: "", state: false});
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
          <div className="flex w-[80vw] max-h-[70vh] overflow-hidden rounded-md shadow-md text-zinc-800 px-5">
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
                    <th
                      key={'status'}
                      className="px-4 py-3 text-left text-md font-medium uppercase tracking-widest whitespace-nowrap"
                      style={{ width: "150px" }}
                    >
                      <strong>Status</strong>
                    </th>
                    <th
                      key={'actions'}
                      className="px-4 py-3 text-left text-md font-medium uppercase tracking-widest whitespace-nowrap"
                      style={{ width: "150px" }}
                    >
                      <strong>Actions</strong>
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-zinc-400">
                  {sortedTransactions.length > 0 ? (
                    sortedTransactions.map((transaction) => (
                      <tr key={transaction.id}
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
                        <td
                          key={'status'}
                          className="px-4 py-3 text-xl align-center"
                          style={{
                            width: "150px",
                            maxWidth: "150px",
                          }}
                        >
                          {loadingStatus.state && loadingStatus.id === transaction.id ? (
                            // Loading spinner
                            <div className="flex justify-center items-center py-2">
                              <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                          ) : (
                            <TextButton onClick={() => handleStatusToggle(transaction.id || "", transaction.status === "Cashed" ? "Void" : "Cashed")}>
                              {transaction.status}
                            </TextButton>
                          )}
                        </td>
                        <td
                          key={'actions'}
                          className="px-4 py-3 text-xl align-center"
                          style={{
                            width: "100px",
                            maxWidth: "100px",
                          }}
                        >
                          <TextButton
                            onClick={() => handleShowTransaction(transaction)}
                          >
                            View
                          </TextButton>
                        </td>
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

      <Modal open={showTransaction} title="Transaction Items" onClose={closeTransactionModal} ref={modalRef} height="max-h-[90vh]" width="max-w-[90vw]">
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
      </Modal>
    </>
  );
}

export default CurrentBatch;