import { motion } from "framer-motion";
import { Transaction } from "../global.utils";
import { useState } from "react";
import TextButton from "../ui/TextButton";

const Settings = ({ configs }: { configs: Transaction[] }) => {
  const [view, setView] = useState<"configs" | "discounts">("discounts");

  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <div className="flex flex-row w-full items-start justify-center gap-5 pt-5">
        <h1
          className="text-xl sm:text-2xl font-serif font-semibold text-center sm:text-start text-zinc-900 mb-4">
          Settings
        </h1>
      </div>

      <div className="flex flex-col w-full items-start justify-start py-5">
        {/* TODO: Add custom discounts */}
        {/* {view === "currentBatch" && <CurrentBatch initialTransactions={transactions} />} */}
        {/* {view === "previousBatches" && <Batches />} */}
      </div>

    </motion.div>
  );
}

export default Settings;