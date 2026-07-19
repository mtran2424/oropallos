import { useRef } from "react";
import { motion } from "framer-motion";
import { Discount } from "@/components/global.utils";
import AddDiscount from "@/components/utils/AddDiscount";
import DiscountTag from "@/components/utils/DiscountTag";

const DiscountMenu = ({
  discounts,
  onEdit,
  onDelete,
  onAdd
}: {
  discounts: Discount[],
  onEdit: () => void,
  onDelete: () => void,
  onAdd: () => void
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
              Discounts
            </h1>
            <div
              className="flex w-full text-lg sm:text-xl font-serif text-start px-15">
              <AddDiscount ref={modalRef} onAdd={onAdd}/>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 space-x-2 space-y-2 w-[80vw] px-2">
            {discounts && discounts.map((discount) => (
              <DiscountTag key={discount.id} discount={discount} onEdit={onEdit} onDelete={onDelete}/>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default DiscountMenu;