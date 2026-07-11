import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Batch,
  batchTableColumns,
  formatDate,
  netTableColumns,
} from "@/components/global.utils";
import TextButton from "@/components/ui/TextButton";

const AccountingTable = ({
  batches
}: {
  batches: Batch[]
}) => {

  const sortedBatches = useMemo(() => {
    return batches.sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return dateA.getTime() - dateB.getTime();
    });
  }, [batches]);


  // Action section to view transactions for each batch and to view items in each transaction.
  const renderCell = (batch: Batch, column: keyof Batch) => {
    switch (column) {
      case "date":
        return batch.date instanceof Date ? formatDate(batch.date, "mm/dd/yyyy") :
          batch.date ? formatDate(new Date(batch.date), "mm/dd/yyyy") : "";
      case "wineGross":
        return `$${(batch.wineGross / 100).toFixed(2)}`;
      case "liquorGross":
        return `$${(batch.liquorGross / 100).toFixed(2)}`;
      case "gross":
        return `$${(batch.gross / 100).toFixed(2)}`;
      case "tax":
        return `$${(batch.tax / 100).toFixed(2)}`;
      case "cardReceiptTotal":
        return `$${(batch.cardReceiptTotal / 100).toFixed(2)}`;
      default:
        return "";
    }
  }

  // Export current table as csv
  const exportCSV = () => {
  const headers = [
    ...netTableColumns.map((c) => c.label),
    "Cash",
  ];

  const rows = sortedBatches.map((batch) => [
    batch.date instanceof Date
      ? formatDate(batch.date, "mm/dd/yyyy")
      : batch.date
      ? formatDate(new Date(batch.date), "mm/dd/yyyy")
      : "",
      (batch.liquorGross / 100).toFixed(2),
    (batch.wineGross / 100).toFixed(2),
    (batch.tax / 100).toFixed(2),
    // (batch.gross / 100).toFixed(2),
    (-batch.cardReceiptTotal / 100).toFixed(2),
    (-(batch.gross + batch.tax - batch.cardReceiptTotal) / 100).toFixed(2),
  ]);

  const csvContent =
    headers.join(",") +
    "\n" +
    rows.map((r) => r.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "accounting.csv";
  a.click();

  URL.revokeObjectURL(url);
};

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
              Batch Totals
            </h1>
            <TextButton onClick={exportCSV}>
              Export CSV
            </TextButton>
          </div>

          {/* Current Batch Data Table */}
          <div className="flex w-full max-h-[40vh] overflow-hidden rounded-md shadow-md text-zinc-800 px-5">
            {/* Spreadsheet */}
            <div className="flex overflow-auto w-screen px-5">
              {/* Product Table Start */}
              <table className="w-full divide-y divide-zinc-400" style={{ minWidth: "1200px" }}>
                {/* Table Headers */}
                <thead className="sticky top-0 bg-white z-20">
                  <tr>
                    {netTableColumns.map((column) => (
                      <th
                        key={column.field}
                        className="px-4 py-3 text-left text-md font-medium uppercase tracking-widest whitespace-nowrap"
                        style={{ width: column.width }}
                      >
                        <strong>{column.label}</strong>
                      </th>
                    ))}
                    <th
                      key={"netTotal"}
                      className="px-4 py-3 text-left text-md font-medium uppercase tracking-widest whitespace-nowrap"
                      style={{ width: "200px" }}
                    >
                      <strong>Cash</strong>
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-zinc-400">
                  {sortedBatches.length > 0 ? (
                    sortedBatches.map((batch) => (
                      <tr
                        key={batch.id} className="hover:bg-zinc-200 transition duration-200"
                      >
                        {netTableColumns.map((column) => (
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
                        <td
                          key={"netTotal"}
                          className="px-4 py-3 text-xl align-center"
                          style={{
                            width: "200px",
                            maxWidth: "200px",
                            whiteSpace: "pre-line",
                          }}
                        >
                          ${((batch.gross + batch.tax - batch.cardReceiptTotal) / 100).toFixed(2)}
                        </td>
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
    </>
  );
}

export default AccountingTable;