import { motion } from "framer-motion";
import { useDeferredValue, useMemo, useState } from "react";
import { IoIosAdd, IoMdClose } from "react-icons/io";
import Image from "next/image";
import Modal from "@/components/ui/Modal";
import { Product, sanitize } from "@/components/global.utils";
import { FaSearch } from "react-icons/fa";
import { CiImageOff } from "react-icons/ci";
import toast from "react-hot-toast";
import { createDiscount, createQuickAddButton } from "@/app/api/adminapi";

const AddDiscount = ({
  ref,
  onAdd
}: {
  ref: React.Ref<HTMLDivElement>;
  onAdd: () => void;
}) => {
  const [add, setAdd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [multiplier, setMultiplier] = useState<number>(0);
  const [name, setName] = useState<string>("");

  const openModal = () => {
    setAdd(true);
  }

  const closeModal = () => {
    setAdd(false);
  }

  const handleConfirm = () => {
    setLoading(true);

    if (!name || !multiplier) {
      toast.error(`Please fill in all required fields.`);
      setLoading(false);
      return;
    }

    const discountData = {
      name: name,
      value: name.split(' ').join('_'),
      multiplier: parseInt((multiplier).toFixed(0)),
    }

    createDiscount(discountData)
      .then(() => {
        toast.success(`Discount ${name} added successfully!`);

        onAdd();
        setName("");
        setMultiplier(0);
        setAdd(false);
      }).finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      {/* Add event button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        className="flex flex-row text-md items-center text-blue-500 hover:text-blue-300 p-1"
        onClick={openModal}>
        <IoIosAdd size={25} />
        New Discount
      </motion.button>

      <Modal
        open={add}
        title="New Button"
        onClose={closeModal}
        ref={ref}
        width="max-w-[80vw] md:max-w-[60vw]"
      >
        <div className="grid grid-cols-1 w-full space-y-5">

          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="h-full bg-zinc-100 border border-zinc-300 w-full px-5 py-10 space-y-5"
          >
            {/* Name Field */}
            <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Name</label>
            <input
              type="text"
              required
              className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out w-full"
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
              }}
            />

            {/* Input Fields */}
            <div className="flex flex-col md:flex-row w-full space-x-2">

              <div className="flex flex-col w-full md:w-1/4">
                {/* Units Field */}
                <label className="text-md font-semibold text-zinc-700 w-full text-left px-2 text-nowrap">Multiplier</label>
                <input
                  type="number"
                  step="1"
                  min={1}
                  className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                  placeholder="Multiplier"
                  onChange={(e) => {
                    const value = e.target.value;
                    setMultiplier(value === "" ? 0 : parseInt(value) ?? 0);
                  }}
                  value={multiplier || ""}
                />
                <div className="text-md font-medium text-zinc-500 text-left px-2 wrap-break-word">
                  Percent discounted
                </div>
              </div>

            </div>

            {loading ? (
              // Loading spinner
              <div className="flex justify-center items-center py-2">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="flex flex-row space-x-2 w-full">
                <button
                  className="flex h-full w-full bg-blue-600 text-white font-semibold text-2xl p-5 justify-center items-center px-10
                        hover:bg-zinc-400 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                  onClick={() => {
                    if (name && (multiplier > 0)) {
                      handleConfirm();
                    }
                  }}
                >
                  Confirm
                </button>
              </div>
            )}
          </motion.div>
          <div />
        </div>
      </Modal>
    </>
  );
}

export default AddDiscount;