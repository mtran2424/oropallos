import { useState } from "react";
import { motion } from "framer-motion";
import { Transaction } from "@/components/global.utils";
import CurrentBatch from "./CurrentBatch";
import Batches from "./Batches";

const Manager = ({ transactions }: { transactions: Transaction[] }) => {
  const [view, setView] = useState<"currentBatch" | "previousBatches">("currentBatch");

  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <div className="flex flex-row w-full h-full items-start justify-start divide-x divide-zinc-400">
        <div className="hidden md:flex flex-col bg-white w-full h-screen justify-start items-start z-50 space-y-2 px-1">
          <div className="px-2 py-5 text-2xl text-zinc-600">
            Manage Transactions
          </div>

          <button
            type="button"
            className={`w-full text-start text-xl text-nowrap text-zinc-900 hover:bg-zinc-200 rounded-xl p-2 
                ${view === "currentBatch" ? "bg-zinc-300" : ""}
                transition-colors ease-in-out
                `}
            onClick={() => setView("currentBatch")}
          >
            Current Batch
          </button>
          <button
            type="button"
            className={`w-full text-start text-xl text-nowrap text-zinc-900 hover:bg-zinc-200 rounded-xl p-2 
                ${view === "previousBatches" ? "bg-zinc-300" : ""}
                transition-colors ease-in-out
                `}
            onClick={() => setView("previousBatches")}
          >
            Previous Batches
          </button>
        </div>

        <div className="flex flex-col w-full items-start justify-start py-5">
          {view === "currentBatch" && <CurrentBatch initialTransactions={transactions} />}
          {view === "previousBatches" && <Batches />}
        </div>

      </div>
    </motion.div>
  );
}

export default Manager;