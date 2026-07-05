import { motion } from "framer-motion";
import { Batch } from "@/components/global.utils";
import Calendar from "@/components/utils/calendar/Calendar";

const AccountingMenu = ({
  batches
}:{
  batches: Batch[]
}) => {
  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <div className="flex flex-col w-full h-full items-center justify-start gap-5 divide-y divide-zinc-400">
        <h1
          className="flex w-full text-xl sm:text-2xl font-serif font-semibold text-start text-zinc-900 px-15">
          Accounting
        </h1>
        <div className="flex flex-col w-[80vw] h-full">
          <Calendar batches={batches} onClick={() => {
          }} />
        </div>
      </div>
    </motion.div>
  );
}

export default AccountingMenu;