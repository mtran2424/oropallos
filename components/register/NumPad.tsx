import { motion } from "framer-motion";
import { useState } from "react";
import { IoBackspaceOutline } from "react-icons/io5";
import { MdKeyboardReturn } from "react-icons/md";
import { Discount, fifteenPercentDiscount, Item, noDiscount, taxFreeDiscount } from "../global.utils";

const NumPad = ({ onConfirm }: { onConfirm: (item: Item) => void }) => {
  const [input, setInput] = useState<string>("");
  const [item, setItem] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [discount, setDiscount] = useState<Discount>(noDiscount);

  return (
    <motion.div
      initial={{ y: "-100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="bg-zinc-100 border border-zinc-300 w-[35vw] px-5 py-10"
    >
      <motion.div
        className="p-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
        overflow-hidden w-full h-25 mb-10"
      >
        <div className="grid grid-cols-2 text-sm w-full text-zinc-500">
          {quantity ? <div className="text-start">
            Qty: {quantity}
          </div> : <div />}
          {item ? <div className="text-end">
            {item}
          </div> : <div />}
        </div>
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          // placeholder="Search by name, category, subcategory, or type..."
          // initial={{ width: 0, opacity: 0 }}
          // animate={{
          //   // width: isOpen ? "100%" : 0,
          //   // opacity: isOpen ? 1 : 0,
          //   // paddingLeft: isOpen ? "0.75rem" : "0rem",
          //   // paddingRight: isOpen ? "0.75rem" : "0rem",
          // }}
          // transition={{ duration: 0.4, ease: "easeInOut" }}
          className="p-2 text-2xl overflow-hidden w-full focus:outline-none"
          style={{ whiteSpace: "nowrap" }}
        />
        {discount && <div className="text-start text-sm text-zinc-500">
          {discount.name}
        </div>}
      </motion.div>
      <div className="grid grid-cols-4 gap-x-1">
        {/* First Row */}
        <button className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
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
        <button>

        </button>
        <button
          className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => {
            setInput("");
            setDiscount(noDiscount);
            setItem("");
            setQuantity(1);
          }}
        >

          Clear
        </button>
        <button
          className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
        >
          No Sale
        </button>

        {/* Second Row */}
        <button
          className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => setInput(`${input}7`)}
        >
          7
        </button>
        <button
          className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => setInput(`${input}8`)}
        >
          8
        </button>
        <button
          className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => setInput(`${input}9`)}
        >
          9
        </button>
        <button
          className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => {
            setInput(prev => prev.slice(0, -1));
          }}
        >
          <IoBackspaceOutline size={40} />
        </button>


        {/* Third Row */}
        <button
          className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => setInput(`${input}4`)}
        >
          4
        </button>
        <button
          className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => setInput(`${input}5`)}
        >
          5
        </button>
        <button
          className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => setInput(`${input}6`)}
        >
          6
        </button>
        <button
          className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
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
          className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => setInput(`${input}1`)}
        >
          1
        </button>
        <button
          className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => setInput(`${input}2`)}
        >
          2
        </button>
        <button
          className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => setInput(`${input}3`)}
        >
          3
        </button>
        <button
          className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => {
            if (discount !== taxFreeDiscount) {
              setDiscount(taxFreeDiscount);
              if (input)
                setInput((parseFloat(input) /1.07).toFixed(0))
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
          className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear col-span-2"
          onClick={() => setInput(`${input}0`)}
        >
          0
        </button>
        <button
          className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => setInput(`${input}00`)}
        >
          00
        </button>
        <button></button>

        {/* Sixth Row */}
        <button
          className="flex h-15 w-full bg-zinc-800 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear col-span-2"
          onClick={() => {
            setItem("Liquor");
          }}
        >
          Liquor
        </button>

        <button
          className="flex h-15 w-full bg-zinc-800 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear col-span-2"
          onClick={() => setItem("Wine")}
        >
          Wine
        </button>

        {/* Seventh Row */}
        <button
          className="flex h-15 w-full bg-blue-500 text-white font-semibold m-0.5 text-xl justify-center items-center px-10 col-span-4
        
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
          onClick={() => {
            if (item && quantity && discount && input) {
              onConfirm(
                { item: item, qty: quantity, discount: discount, price: parseFloat(input) / 100 }
              );
              setInput("");
              setDiscount(noDiscount);
              setItem("");
              setQuantity(1);
            }
          }}
        >
          <MdKeyboardReturn size={40} />
        </button>

      </div>
    </motion.div>);
}

export default NumPad;