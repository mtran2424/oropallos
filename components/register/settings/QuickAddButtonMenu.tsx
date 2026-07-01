import { Product } from "@/components/global.utils";
import AddQuickButton from "@/components/utils/AddQuickButton";
import { motion } from "framer-motion";
import { useRef } from "react";

const QuickAddButtonMenu = ({
  products
}:{
  products: Product[]
}) => {
  const modalRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <div className="flex flex-col w-full h-full items-center justify-start gap-5 divide-y divide-zinc-400">
          <div className="flex w-full flex-col">
            <h1
              className="flex w-full text-xl sm:text-2xl font-serif font-semibold text-start text-zinc-900 px-15">
              Quick Add Buttons
            </h1>
            <div
              className="flex w-full text-lg sm:text-xl font-serif text-start px-15">
              <AddQuickButton products={products} ref={modalRef} />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default QuickAddButtonMenu;