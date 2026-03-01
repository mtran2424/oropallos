import { motion } from "framer-motion";
import { useState } from "react";

const NumPad = () => {
  const [amount, setAmount] = useState<string>("");
  return ( <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="bg-zinc-300 rounded-xl border border-zinc-300 w-[40vw]"
    >
      <motion.input
        type="text"
        value={amount}
        onChange={()=> {

        }}
        // placeholder="Search by name, category, subcategory, or type..."
        // initial={{ width: 0, opacity: 0 }}
        // animate={{
        //   // width: isOpen ? "100%" : 0,
        //   // opacity: isOpen ? 1 : 0,
        //   // paddingLeft: isOpen ? "0.75rem" : "0rem",
        //   // paddingRight: isOpen ? "0.75rem" : "0rem",
        // }}
        // transition={{ duration: 0.4, ease: "easeInOut" }}
        className="py-2 border border-gray-300 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 
        text-2xl
        overflow-hidden w-full"
        style={{ whiteSpace: "nowrap" }}
      />
      <div className="grid grid-cols-5">
        <button>
          
        </button>
        <button>
          
        </button>
        <button>
          
        </button>
        <button
          onClick={()=> setAmount("")}
        >
          Clear
        </button>
        <button>
          
        </button>
        <button>
          discount
        </button>
        <button
          onClick={()=> setAmount(`${amount}7`)}
        >
          7
        </button>
        <button
          onClick={()=> setAmount(`${amount}8`)}
        >
          8
        </button>
        <button
          onClick={()=> setAmount(`${amount}9`)}
        >
          9
        </button>
        <button>
          Liquor
        </button>
        <button>
          discount
        </button>
        <button>
          4
        </button>
        <button>
          5
        </button>
        <button>
          6
        </button>
        <button>
          Wine
        </button>
        <button>
          discount
        </button>
        <button>
          1
        </button>
        <button>
          2
        </button>
        <button>
          3
        </button>
        <button>
          
        </button>
        <button>
          
        </button>
        <button>
          
        </button>
        <button>
          99
        </button>
        <button
          onClick={()=> setAmount(`${amount}00`)}
        >
          00
        </button>
      </div>
    </motion.div> );
}
 
export default NumPad;