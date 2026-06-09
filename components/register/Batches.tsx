import { motion } from "framer-motion";
import { Batch, batchTableColumns, formatDate, formatTime, getDiscount, managerTableColumns, Transaction, TransactionItem, transactionItemTableColumns } from "../global.utils";
import CopyButton from "../ui/CopyButton";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getBatches } from "@/app/api/batchapi";
import Modal from "../ui/Modal";

const Batches = () => {
  const { user } = useUser();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [refresh, setRefresh] = useState(false);

  // Totals
  const [grossLiquor, setGrossLiquor] = useState(0);
  const [grossWine, setGrossWine] = useState(0);
  const [grossTotal, setGrossTotal] = useState(0);
  const [discountTotal, setDiscountTotal] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  const [netTotal, setNetTotal] = useState(0);

  // Transactions Popup
  const [showBatch, setShowBatch] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [showTransaction, setShowTransaction] = useState(false);
  const [transactionItems, setTransactionItems] = useState<TransactionItem[]>([]);

  const sortedBatches = useMemo(() => {
    return batches.sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return dateB.getTime() - dateA.getTime();
    });
  }, [batches]);

  const handleShowBatch = (batch: Batch) => {
    setShowBatch(true);
    setTransactions(batch.transactions);
  }

  const handleShowTransaction = (transaction: Transaction) => {
    setShowTransaction(true);
    setTransactionItems(transaction.transactionItems);
  }

  // TODO: Figure out cluster items for batches (gross, net, tax, discount, etc...)

  // Recalculate totals when transactions change
  const recalculateTotals = () => {
    setGrossLiquor(batches.reduce((sum, batch) => sum + batch.liquorGross, 0) / 100);
    setGrossWine(batches.reduce((sum, batch) => sum + batch.wineGross, 0) / 100);
    setGrossTotal(batches.reduce((sum, batch) => sum + batch.gross, 0) / 100);
    setDiscountTotal(batches.reduce((sum, batch) => sum + batch.discount, 0) / 100);
    setTaxTotal(batches.reduce((sum, batch) => sum + batch.tax, 0) / 100);
    setNetTotal(batches.reduce((sum, batch) => sum + batch.gross, 0) / 100);
  }

  // TODO: Create filters for batches by date, register, etc...

  // Action section to view transactions for each batch and to view items in each transaction.
  const renderCell = (batch: Batch, column: keyof Batch) => {
    switch (column) {
      case "id":
        return batch.id;
      case "register":
        return batch.register;
      case "gross":
        return `$${(batch.gross / 100).toFixed(2)}`;
      case "wineGross":
        return `$${(batch.wineGross / 100).toFixed(2)}`;
      case "liquorGross":
        return `$${(batch.liquorGross / 100).toFixed(2)}`;
      case "discount":
        return `$${(batch.discount / 100).toFixed(2)}`;
      case "tax":
        return `$${(batch.tax / 100).toFixed(2)}`;
      case "cashTotal":
        return `$${(batch.cashTotal / 100).toFixed(2)}`;
      case "creditTotal":
        return `$${(batch.creditTotal / 100).toFixed(2)}`;
      case "date":
        return batch.date instanceof Date ? formatDate(batch.date, "mm/dd/yyyy") + " " + formatTime(batch.date) :
          batch.date ? formatDate(new Date(batch.date), "mm/dd/yyyy") + " " + formatTime(new Date(batch.date)) : "";
      default:
        return "";
    }
  }

  const renderTransactionCell = (transaction: Transaction, column: keyof Transaction) => {
    switch (column) {
      case "id":
        return transaction.id;
      case "status":
        return transaction.status;
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
      case "itemPrice":
        return `$${(item.itemPrice / 100).toFixed(2)}`;
      case "discount":
        return item.discount ? getDiscount(item.discount).name : "";
      case "type":
        return item.type;
      case "upc":
        return item.upc;
      default:
        return "";
    }
  }

  // Close the modal for adding a product
  const closeBatchModal = () => {
    setShowBatch(false);
    setTransactions([]);
  };

  const closeTransactionModal = () => {
    setShowTransaction(false);
    setShowBatch(true);
    setTransactionItems([]);
  };

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

    fetchBatches();
  }, [refresh]);

  // Recalculate totals when transactions change
  useEffect(() => {
    recalculateTotals();
  }, [batches]);

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
              Previous Batches
            </h1>
            <h1
              className="flex w-full text-lg sm:text-xl font-serif text-start text-zinc-900 pb-4 px-15">
              Register: {user?.username}
            </h1>
          </div>

          {/* Sales stat Cluster */}
          <div className="grid lg:grid-cols-7 grid-cols-4 w-full items-center px-20 pb-5 divide-x divide-zinc-400">
            <div>
              <h2 className="text-center text-zinc-500 text-xl">Batches:</h2>
              <h2 className="text-center font-semibold text-2xl">{batches.length}</h2>
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
                    {batchTableColumns.map((column) => (
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
                  {sortedBatches.length > 0 ? (
                    sortedBatches.map((batch) => (
                      <tr
                        key={batch.id} className="hover:bg-zinc-200 transition duration-200"
                        onClick={() => handleShowBatch(batch)}
                      >
                        {batchTableColumns.map((column) => (
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
                            {renderCell(batch, column.field as keyof Batch)}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={batchTableColumns.length} className="text-center py-4 text-xl text-zinc-900">
                        No batches.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </motion.div>

      <Modal open={showBatch} title="Transactions" height="max-h-[90vh]" width="max-w-[90vw]" onClose={closeBatchModal} ref={modalRef}>
        <div className="flex w-full h-[75vh] overflow-hidden rounded-md shadow-md text-zinc-800 p-10">
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
                          {renderTransactionCell(transaction, column.field as keyof Transaction)}
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

      <Modal open={showTransaction} title="Transaction Items" height="max-h-[90vh]" width="max-w-[90vw]" onClose={closeTransactionModal} ref={modalRef}>
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

export default Batches;