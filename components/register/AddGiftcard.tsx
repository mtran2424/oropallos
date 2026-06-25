import { useState } from "react";
import Modal from "../ui/Modal";
import { motion } from "framer-motion";
import Image from "next/image";
import { IoBackspaceOutline } from "react-icons/io5";
import { MdKeyboardReturn } from "react-icons/md";

const AddGiftcard = ({ ref, onClick }: {
  // products: Product[];
  ref: React.Ref<HTMLDivElement>;
  onClick: (price: number) => void
}) => {
  const [add, setAdd] = useState(false);
  const [amount, setAmount] = useState<number>(0)

  const [input, setInput] = useState<string>("");

  const openModal = () => {
    setAdd(true);
  }
  const closeModal = () => {
    setAdd(false);
    setAmount(0);
    setInput("");
  }
  const handleConfirm = () => {
    if (amount > 0) {
      onClick(amount);
      closeModal();
    }
  }

  return (
    <>
      <button
        className="font-semibold bg-blue-900 text-white text-2xl hover:bg-zinc-400 hover:text-zinc-600 transition-colors ease-linear py-10 px-2 rounded-sm"
        onClick={openModal}
      >
        Gift Card
      </button>

      <Modal
        open={add}
        title="Gift Card"
        onClose={closeModal}
        ref={ref}
        width="max-w-[85vw]"
      >
        <div className="grid grid-cols-2 w-full space-y-5">
          {/* Product Search */}
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="bg-zinc-100 border border-zinc-300 w-[40vw] px-5 py-10 space-y-5"
          >

            <div className="flex flex-col w-full">

              {/* Amount Field */}
              <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Price</label>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                placeholder="Amount"
                readOnly
                value={(amount / 100).toFixed(2)}
              />

              <div className="mt-5 text-xl font-medium text-zinc-500 text-left px-2 wrap-break-word">
                Please only use this for gift card purchases paid for with CREDIT.
                <br />
                Add $2 to the amount for processing fees.
                <br />
                DO NOT USE IF PAID FOR IN CASH!
              </div>
            </div>

          </motion.div>

          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="bg-zinc-100 border border-zinc-300 w-[40vw] px-5 py-10"
          >
            {/* Input bar */}
            <motion.div
              className="p-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                        overflow-hidden w-full h-30 mb-5"
            >
              <input
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="px-2 text-4xl overflow-hidden w-full h-full focus:outline-none"
                style={{ whiteSpace: "nowrap" }}
              />
            </motion.div>

            {/* Num Pad */}
            <div className="grid grid-cols-3 gap-x-1 gap-y-1">
              {/* First Row */}

              {/* Clear inputs */}
              <button
                className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
                        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                onClick={() => {
                  setInput("");
                }}
              >
                Clear
              </button>

              <button />

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

              <button />

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

              <button />


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

              <button />

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


              {/* Seventh Row */}
              {/* Confirm item button */}
              <button
                className="flex h-full w-full bg-blue-600 text-white font-semibold text-2xl p-5 justify-center items-center px-10 col-span-4
                        hover:bg-zinc-400 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                onClick={() => {
                  if (input) {
                    setAmount(parseInt(input));
                    setInput("");
                  }
                }}
              >
                <MdKeyboardReturn size={40} />
              </button>

            </div>
          </motion.div>
          <div />
          <button
            className="flex h-full w-full bg-blue-600 text-white font-semibold text-2xl p-5 justify-center items-center px-10
                        hover:bg-zinc-400 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
            onClick={() => {
              if (amount > 0) {
                handleConfirm();
              }
            }}
          >
            Confirm
          </button>
        </div>
      </Modal>

    </>
  );
}

export default AddGiftcard;