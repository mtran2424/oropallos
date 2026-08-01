import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import {
  Discount,
  fifteenPercentDiscount,
  noDiscount,
  Product,
  QuickAddButton,
  taxFreeDiscount
} from "@/components/global.utils";
import Modal from "@/components/ui/Modal";

const QuickButton = ({
  quickButton,
  discounts,
  discountsDisabled,
  onClick,
  color
}: {
  quickButton: QuickAddButton
  discounts: Discount[];
  discountsDisabled?: boolean;
  onClick: (
    product: Product,
    quantity: number,
    name: string,
    type: string,
    discount: Discount,
    price: number) => void;
  color?: string;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [discount, setDiscount] = useState<Discount>(noDiscount);
  const [otherDiscount, setOtherDiscount] = useState(false);

  const openModal = () => {
    setOpen(true);
  }
  const closeModal = () => {
    setOpen(false);
  }

  const closeDiscountModal = () => {
    setOtherDiscount(false);
  }

  // Calculate price
  const getPrice = (discount: string, price: number) => {
    switch (discount) {
      case "Tax_Free": return (price / 1.07);
      default: return price;
    }
  }

  const handleSubmit = () => {
    if (quantity > 0 && quickButton.product) {
      onClick(
        quickButton.product,
        quantity * quickButton.units,
        quickButton.name,
        quickButton.type,
        discount,
        (quickButton.units > 1) ? (getPrice(discount.value, quickButton.price) / quickButton.units) : getPrice(discount.value, quickButton.price)
      );

      setQuantity(1);
      setDiscount(noDiscount);
      closeModal();
    }
  }

  return (
    <>
      <button
        key={quickButton.id}
        className={`font-semibold bg-${color ? color : "blue"}-900 text-white text-2xl hover:bg-zinc-400 hover:text-zinc-600 transition-colors ease-linear py-10 px-2 rounded-sm`}
        onClick={openModal}
      >
        {quickButton.label}
      </button>

      <Modal
        open={open}
        title="Add Item"
        height={discountsDisabled ? "max-h-[40vh]" : "max-h-[60vh]"}
        width="max-w-3xl"
        onClose={closeModal}
        ref={modalRef}
      >
        <div className="mt-6 w-full border-t border-zinc-500 text-lg rounded-lg p-4">
          <div className="flex flex-col items-center justify-center w-full gap-4">
            <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Quantity</label>
            <div className="flex flex-row">
              <button
                className={`text-${color ? color : "blue"}-600 hover:text-zinc-400`}
                onClick={() => {
                  if (quantity > 1)
                    setQuantity(quantity - 1)
                }}
                disabled={quantity <= 1}
              >
                <MdNavigateBefore size={60} />
              </button>
              <div className="flex w-full items-center justify-center">
                <input
                  type="number"
                  step="1"
                  min={0}
                  className={`text-5xl font-semibold text-center rounded-lg w-40 p-2 focus:outline-none focus:ring-2 focus:ring-${color ? color : "blue"}-500 transition duration-200 ease-in-out`}
                  onChange={(e) => {
                    const value = e.target.value;
                    setQuantity(parseInt(value));
                  }}
                  value={quantity || "0"}
                />
              </div>
              <button
                className={`text-${color ? color : "blue"}-600 hover:text-zinc-400`}
                onClick={() => setQuantity(quantity + 1)}
              >
                <MdNavigateNext size={60} />
              </button>
            </div>

            {!discountsDisabled && (
              <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Discount</label>
            )}
            {!discountsDisabled && (
              <div className="grid grid-cols-4 w-full gap-1">
                <button
                  className={`p-5 rounded-md text-white text-2xl 
                  ${discount === noDiscount ? "bg-zinc-500" : `bg-${color ? color : "blue"}-600`}
                  hover:bg-zinc-400`}
                  onClick={() => setDiscount(noDiscount)}
                >
                  No Discount
                </button>
                <button
                  className={`p-5 rounded-md text-white text-2xl 
                  ${discount === fifteenPercentDiscount ? "bg-zinc-500" : `bg-${color ? color : "blue"}-600`} 
                  hover:bg-zinc-400`}
                  onClick={() => setDiscount(fifteenPercentDiscount)}
                >
                  15% Discount
                </button>
                <button
                  className={`p-5 rounded-md text-white text-2xl 
                  ${discount === taxFreeDiscount ? "bg-zinc-500" : `bg-${color ? color : "blue"}-600`} 
                  hover:bg-zinc-400`}
                  onClick={() => setDiscount(taxFreeDiscount)}
                >
                  Tax Free
                </button>
                <button
                  className={`p-5 rounded-md text-white text-2xl 
                  ${discount !== taxFreeDiscount && discount !== fifteenPercentDiscount && discount !== noDiscount ? "bg-zinc-500" : `bg-${color ? color : "blue"}-600`} 
                  hover:bg-zinc-400`}
                  onClick={() => setOtherDiscount(true)}
                >
                  Other
                </button>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              className={`h-20 text-2xl font-semibold w-full bg-${color ? color : "blue"}-600 text-white py-2 px-4 rounded-lg hover:bg-zinc-400 transition duration-200 ease-in-out`}
              onClick={handleSubmit}
            >
              Submit
            </motion.button>
          </div>
        </div>
      </Modal>

      <Modal open={otherDiscount} title="Other Discount" height="max-h-[80vh]" width="max-w-3xl" onClose={closeDiscountModal} ref={modalRef}>
        <div className="grid grid-cols-4 w-full gap-1">
          {discounts.map((disc) => (
            <button
              key={disc.id}
              className={`p-5 rounded-md text-white text-2xl 
                  ${discount === disc ? "bg-zinc-500" : `bg-${color ? color : "blue"}-600`}
                  hover:bg-zinc-400`}
              onClick={() => {
                setDiscount(disc);
                closeDiscountModal();
              }}
            >
              {disc.label}
            </button>))}
        </div>
      </Modal>
    </>
  );
}

export default QuickButton;