import { motion } from "framer-motion";
import { useState } from "react";
import { IoBackspaceOutline } from "react-icons/io5";
import { MdKeyboardReturn } from "react-icons/md";

const NumPad = () => {
  const [amount, setAmount] = useState<string>("");
  // Qty, discount


  return (<motion.div
    initial={{ x: "-100%", opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: "100%", opacity: 0 }}
    transition={{ duration: 1, ease: "easeInOut" }}
    className="bg-zinc-100 border border-zinc-300 w-[30vw] px-5 py-10"
  >
    <motion.input
      type="text"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      // placeholder="Search by name, category, subcategory, or type..."
      // initial={{ width: 0, opacity: 0 }}
      // animate={{
      //   // width: isOpen ? "100%" : 0,
      //   // opacity: isOpen ? 1 : 0,
      //   // paddingLeft: isOpen ? "0.75rem" : "0rem",
      //   // paddingRight: isOpen ? "0.75rem" : "0rem",
      // }}
      // transition={{ duration: 0.4, ease: "easeInOut" }}
      className="p-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
        text-2xl
        overflow-hidden w-full h-20 mb-10"
      style={{ whiteSpace: "nowrap" }}
    />
    <div className="grid grid-cols-4 gap-x-1">
      {/* First Row */}
      <button className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
      hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear">
        @/for
      </button>
      <button>

      </button>
      <button
        className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
        onClick={() => setAmount("")}
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
        onClick={() => setAmount(`${amount}7`)}
      >
        7
      </button>
      <button
        className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
        onClick={() => setAmount(`${amount}8`)}
      >
        8
      </button>
      <button
        className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
        onClick={() => setAmount(`${amount}9`)}
      >
        9
      </button>
      <button
        className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
        onClick={() => setAmount("")}
      >
        <IoBackspaceOutline size={40} />
      </button>


      {/* Third Row */}
      <button
        className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
        onClick={() => setAmount(`${amount}4`)}
      >
        4
      </button>
      <button
        className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
        onClick={() => setAmount(`${amount}5`)}
      >
        5
      </button>
      <button
        className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
        onClick={() => setAmount(`${amount}6`)}
      >
        6
      </button>
      <button
        className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
      >
        15%
      </button>

      {/* Fourth Row */}
      <button
        className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
        onClick={() => setAmount(`${amount}1`)}
      >
        1
      </button>
      <button
        className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
        onClick={() => setAmount(`${amount}2`)}
      >
        2
      </button>
      <button
        className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
        onClick={() => setAmount(`${amount}3`)}
      >
        3
      </button>
      <button
        className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
      >
        Tax Free
      </button>

      {/* Fifth Row */}
      <button
        className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear col-span-2"
        onClick={() => setAmount(`${amount}0`)}
      >
        0
      </button>
      <button
        className="flex h-15 w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
        onClick={() => setAmount(`${amount}00`)}
      >
        00
      </button>
      <button></button>

      {/* Sixth Row */}
      <button
        className="flex h-15 w-full bg-yellow-500 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear col-span-2"
      >
        Liquor
      </button>

      <button
        className="flex h-15 w-full bg-red-500 text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear col-span-2"
      >
        Wine
      </button>

      {/* Seventh Row */}
      <button
        className="flex h-15 w-full bg-blue-500 text-white font-semibold m-0.5 text-xl justify-center items-center px-10 col-span-4
        
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
        onClick={() => setAmount("")}
      >
        <MdKeyboardReturn size={40} />
      </button>

    </div>
  </motion.div>);
}

export default NumPad;