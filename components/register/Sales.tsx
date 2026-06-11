import { motion } from "framer-motion";
import { Product, Transaction } from "../global.utils";

const Sales = ({
  products,
  transactions
}: {
  products: Product[],
  transactions: Transaction[]
}) => {
  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <div className="flex flex-col w-full min-w-[80vw] h-full items-center justify-start px-10 gap-5 pt-5">
        {/* Header */}
        <h1 className="flex w-full text-xl sm:text-2xl font-serif font-semibold text-start text-zinc-900 mb-4 px-15">
          Sales Dashboard
        </h1>
      </div>
    </motion.div>
  );
}

export default Sales;