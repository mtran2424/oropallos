import { useState } from "react";
import { motion } from "framer-motion";
import { Batch, Discount, Product, QuickAddButton } from "@/components/global.utils";
import QuickAddButtonMenu from "./settings/QuickAddButtonMenu";
import AccountingMenu from "./settings/AccountingMenu";
import DiscountMenu from "./settings/DiscountMenu";

const Settings = ({
  products,
  quickAddButtons,
  batches,
  discounts,
  onEdit,
  onDelete,
  onAdd
}:{
  products: Product[],
  quickAddButtons: QuickAddButton[],
  batches: Batch[];
  discounts: Discount[];
  onEdit: () => void,
  onDelete: () => void,
  onAdd: () => void
}) => {
  const [view, setView] = useState<string>("quickButtons")
  return (
    <>
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <div className="flex flex-row w-full h-full items-start justify-start divide-x divide-zinc-400">
          <div className="hidden lg:flex flex-col bg-white w-[15vw] h-screen justify-start items-start z-50 space-y-2 px-1">
            <div className="px-2 py-5 text-2xl text-zinc-600">
              Settings
            </div>

            <button
              type="button"
              className={`w-full text-start text-xl text-nowrap text-zinc-900 hover:bg-zinc-200 rounded-xl p-2 
                ${view === "quickButtons" ? "bg-zinc-300" : ""}
                transition-colors ease-in-out
                `}
              onClick={() => setView("quickButtons")}
            >
              Quick Buttons
            </button>
            <button
              type="button"
              className={`w-full text-start text-xl text-nowrap text-zinc-900 hover:bg-zinc-200 rounded-xl p-2 
                ${view === "discounts" ? "bg-zinc-300" : ""}
                transition-colors ease-in-out
                `}
              onClick={() => setView("discounts")}
            >
              Discounts
            </button>
            <button
              type="button"
              className={`w-full text-start text-xl text-nowrap text-zinc-900 hover:bg-zinc-200 rounded-xl p-2 
                ${view === "accounting" ? "bg-zinc-300" : ""}
                transition-colors ease-in-out
                `}
              onClick={() => setView("accounting")}
            >
              Accounting
            </button>
          </div>
          <div className="flex flex-col w-full items-start justify-start py-5">
            {view === "quickButtons" && <QuickAddButtonMenu products={products} quickAddButtons={quickAddButtons} onEdit={onEdit} onDelete={onDelete} onAdd={onAdd}/>}
            {view === "discounts" && <DiscountMenu discounts={discounts} onEdit={onEdit} onDelete={onDelete} onAdd={onAdd}/>}
            {view === "accounting" && <AccountingMenu batches={batches}/>}
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default Settings;