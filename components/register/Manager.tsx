import { motion } from "framer-motion";
import { managerTableColumns } from "../global.utils";

const Manager = () => {
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

        {/* Telemetry Cluster */}
        <div className="grid grid-cols-6 w-full items-center px-20">
          <div>
            <h2 className="text-zinc-500 text-xl">Transactions:</h2>
            <h2 className="font-semibold text-2xl">8</h2>
          </div>
          <div>
            <h2 className="text-zinc-500 text-xl">Gross:</h2>
            <h2 className="font-semibold text-2xl">$3498.37</h2>
          </div>
          <div>
            <h2 className="text-zinc-500 text-xl">Wine Gross:</h2>
            <h2 className="font-semibold text-2xl">$3498.37</h2>
          </div>
          <div>
            <h2 className="text-zinc-500 text-xl">Liquor Gross:</h2>
            <h2 className="font-semibold text-2xl">$3498.37</h2>
          </div>
          <div>
            <h2 className="text-zinc-500 text-xl">Net:</h2>
            <h2 className="text-green-600 font-semibold text-2xl">$3498.37</h2>
          </div>
          <div>
            <h2 className="text-zinc-500 text-xl">Discount:</h2>
            <h2 className="text-red-500 font-semibold text-2xl">-$780.92</h2>
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
                <tr>
                  <td colSpan={managerTableColumns.length} className="text-center py-4 text-zinc-900">
                    No transactions.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Manager;