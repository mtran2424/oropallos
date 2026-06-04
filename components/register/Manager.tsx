import { motion } from "framer-motion";
import { Transaction } from "../global.utils";
import { useState } from "react";
import TextButton from "../ui/TextButton";
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
        <div className="flex flex-col bg-white w-full h-screen z-50 items-start justify-start space-y-5 px-10 py-5">
          <div className="text-2xl text-zinc-600">
            Manage Transactions
          </div>
          <TextButton onClick={() => setView("currentBatch")}>
            Current Batch
          </TextButton>
          <TextButton onClick={() => setView("previousBatches")}>
            Previous Batches
          </TextButton>
        </div>

        <div className="flex flex-col w-full items-start justify-start py-5">
          {/* TODO: Action to print receipt for each transaction in table */}
          {view === "currentBatch" && <CurrentBatch initialTransactions={transactions} />}
          {view === "previousBatches" && <Batches />}
        </div>

      </div>
    </motion.div>
  );
}

export default Manager;