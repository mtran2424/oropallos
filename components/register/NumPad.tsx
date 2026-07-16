import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { motion } from "framer-motion";
import { IoBackspaceOutline } from "react-icons/io5";
import { MdKeyboardReturn } from "react-icons/md";
import {
  Discount,
  fifteenPercentDiscount,
  noDiscount,
  taxFreeDiscount,
  TransactionItemRequest
} from "@/components/global.utils";
import Receipt from "@/components/utils/Receipt";
import Modal from "../ui/Modal";

const NumPad = ({ 
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
      <div className="grid grid-cols-4 gap-x-1 gap-y-1">
        {/* First Row */}

        {/* Multi item button */}
        <button className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
      hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => {
            if (input !== "") {
              setQuantity(parseInt(input));
              setInput("");
            }
          }}
        >
          @/for
        </button>

        <button></button>

        {/* Clear inputs */}
        <button
          className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => {
            setInput("");
            setDiscount(noDiscount);
            setType("");
            setItem("");
            setQuantity(1);
          }}
        >

          Clear
        </button>

        {/* TODO: Implement no sale order */}
        <button
          className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => {
            handlePrint();
          }}
        >
          No Sale
        </button>

        {/* Second Row */}
        <button
          className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => setInput(`${input}7`)}
        >
          7
        </button>

        <button
          className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => setInput(`${input}8`)}
        >
          8
        </button>

        <button
          className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => setInput(`${input}9`)}
        >
          9
        </button>

        {/* Back space button */}
        <button
          className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => {
            setInput(prev => prev.slice(0, -1));
          }}
        >
          <IoBackspaceOutline size={40} />
        </button>


        {/* Third Row */}
        <button
          className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => setInput(`${input}4`)}
        >
          4
        </button>

        <button
          className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => setInput(`${input}5`)}
        >
          5
        </button>

        <button
          className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => setInput(`${input}6`)}
        >
          6
        </button>

        {/* 15% Discount Shortcut button */}
        <button
          className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => {
            if (discount !== fifteenPercentDiscount) {
              setDiscount(fifteenPercentDiscount);
            }
            else {
              setDiscount(noDiscount);
            }
          }}
        >
          15%
        </button>

        {/* Fourth Row */}
        <button
          className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => setInput(`${input}1`)}
        >
          1
        </button>

        <button
          className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => setInput(`${input}2`)}
        >
          2
        </button>

        <button
          className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => setInput(`${input}3`)}
        >
          3
        </button>

        {/* Tax Free Discount Shortcut button */}
        <button
          className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => {
            if (discount !== taxFreeDiscount) {
              setDiscount(taxFreeDiscount);
              if (input)
                setInput((parseFloat(input) / 1.07).toFixed(0))
            }
            else {
              setDiscount(noDiscount);
            }
          }}
        >
          Tax Free
        </button>

        {/* Fifth Row */}
        <button
          className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear col-span-2"
          onClick={() => setInput(`${input}0`)}
        >
          0
        </button>

        <button
          className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => setInput(`${input}00`)}
        >
          00
        </button>

        <button
          className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => setOtherDiscount(true)}
        >
          Other Disc
        </button>

        {/* Sixth Row */}
        {/* Liquor type selector */}
        <button
          className="flex h-full w-full bg-zinc-800 text-white font-semibold text-2xl p-5 justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear col-span-2"
          onClick={() => {
            setType("Liquor");
          }}
        >
          Liquor
        </button>

        {/* Wine type selector */}
        <button
          className="flex h-full w-full bg-zinc-800 text-white font-semibold text-2xl p-5 justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear col-span-2"
          onClick={() =>
            setType("Wine")
          }
        >
          Wine
        </button>

        {/* Seventh Row */}
        {/* Confirm item button */}
        <button
          className="flex h-full w-full bg-blue-600 text-white font-semibold text-2xl p-5 justify-center items-center px-10 col-span-4
        hover:bg-zinc-400 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => {
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
        >
          <MdKeyboardReturn size={40} />
        </button>

        <div className="hidden" >
          <div className="print-area" ref={componentRef} >
            {noSaleReceipt}
          </div>
        </div>
      </div>

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

export default NumPad;