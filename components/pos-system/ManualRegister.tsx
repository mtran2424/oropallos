import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { motion } from "framer-motion";
import {
  Discount,
  fifteenPercentDiscount,
  noDiscount,
  taxFreeDiscount,
  TransactionItemRequest
} from "@/components/global.utils";
import Receipt from "@/components/utils/Receipt";
import Modal from "../ui/Modal";
import NumPad from "./num-pad/NumPad";

const ManualRegister = ({
  discounts,
  onConfirm
}: {
  discounts: Discount[];
  onConfirm: (item: TransactionItemRequest) => void;
}) => {
  const modalRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [item, setItem] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [discount, setDiscount] = useState<Discount>(noDiscount);
  const [otherDiscount, setOtherDiscount] = useState(false);

  const componentRef = useRef<HTMLDivElement>(null);

  const closeDiscountModal = () => {
    setOtherDiscount(false);
  }

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Transaction Receipt",
    pageStyle: `
    @page {
      size: 80mm auto;
      margin: 0;
    }

    @media print {
      html, body {
        width: 80mm;
        margin: 0;
        padding: 0;
      }

      .receipt {
        width: 78mm;
        font-family: monospace;
        font-size: 11px;
      }
    }
  `,
  })

  const noSaleReceipt = (
    <Receipt ref={componentRef}>
      <h1 className=" w-full text-left">
        No Sale
      </h1>
    </Receipt>
  );

  return (
    <motion.div
      initial={{ y: "-100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="bg-zinc-100 border border-zinc-300 w-[40vw] px-5 py-5"
    >
      {/* Input bar */}
      <motion.div
        className="p-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
        overflow-hidden w-full h-30 mb-5"
      >
        {/* Current input dash display */}
        <div className="grid grid-cols-2 text-lg w-full text-zinc-500">
          {quantity ? <div className="text-start">
            Qty: {quantity}
          </div> : <div />}
          {type ? <div className="text-end">
            {type}
          </div> : <div />}
        </div>
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="p-2 text-3xl overflow-hidden w-full focus:outline-none"
          style={{ whiteSpace: "nowrap" }}
        />
        {discount && <div className="text-start text-lg text-zinc-500">
          {discount.name}
        </div>}
      </motion.div>

      {/* Numerical to adjust attributes of item */}
      <NumPad
        typeSelector
        onQuantityClick={() => {
          if (input !== "") {
            setQuantity(parseInt(input));
            setInput("");
          }
        }}
        onClearClick={() => {
          setInput("");
          setDiscount(noDiscount);
          setType("");
          setItem("");
          setQuantity(1);
        }}
        onBackspaceClick={() => {
          setInput(prev => prev.slice(0, -1));
        }}
        onFifteenPercentClick={() => {
          if (discount !== fifteenPercentDiscount) {
            setDiscount(fifteenPercentDiscount);
          }
          else {
            setDiscount(noDiscount);
          }
        }}
        onOtherDiscountClick={() => setOtherDiscount(true)}
        onNumberClick={(value) => setInput(`${input}${value}`)}
        onTaxFreeClick={() => {
          if (discount !== taxFreeDiscount) {
            setDiscount(taxFreeDiscount);
            if (input)
              setInput((parseFloat(input) / 1.07).toFixed(0))
          }
          else {
            setDiscount(noDiscount);
          }
        }}
        onTypeClick={(value) => {
          setType(value);
        }}
        onConfirmClick={() => {
          if (type && quantity && discount && input) {
            onConfirm(
              { type: type, name: item, quantity: quantity, discount: discount, itemPrice: parseInt(input) }
            );
            setInput("");
            setDiscount(noDiscount);
            setType("");
            setQuantity(1);
          }
        }}
      />

      {/* Other Discount Modal */}
      <Modal open={otherDiscount} title="Other Discount" height="max-h-[80vh]" width="max-w-3xl" onClose={closeDiscountModal} ref={modalRef}>
        <div className="grid grid-cols-4 w-full gap-1">
          {discounts.map((disc) => (
            <button
              key={disc.id}
              className={`p-5 rounded-md text-white text-2xl 
                  ${discount === disc ? "bg-zinc-500" : "bg-blue-600"}
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
    </motion.div>);
}

export default ManualRegister;