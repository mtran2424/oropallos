import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Discount, QuickAddButton } from "@/components/global.utils";
import { useRef, useState } from "react";
import TextButton from "@/components/ui/TextButton";
import Modal from "@/components/ui/Modal";
import { deleteDiscount, deleteQuickAddButton, editDiscount, editQuickAddButton } from "@/app/api/adminapi";
import { FaDeleteLeft } from "react-icons/fa6";

const DiscountTag = ({
  discount,
  onEdit,
  onDelete,
}: {
  discount: Discount;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [loadingEdit, setLoadingEdit] = useState<boolean>(false);
  const [expand, setExpand] = useState<boolean>(false);
  const [multiplier, setMultiplier] = useState<number>((discount.multiplier));
  const [name, setName] = useState<string>(discount.name);

  const openConfirmDeleteModal = () => {
    setConfirmDelete(true);
  }

  const closeConfirmDeleteModal = () => {
    setConfirmDelete(false);
  }

  const handleDeleteQuickButton = async () => {
    try {
      setLoadingDelete(true);
      if (discount.id) {
        await deleteDiscount(discount.id)
          .then((res) => {
            if (res.status === 200) {
              toast.success('Discount deleted successfully');
              onDelete();
              setConfirmDelete(false);
            }
            else {
              console.error('Failed to delete discount');
              setConfirmDelete(false);
            }
            setLoadingDelete(false);
          });
      }
      else {
        throw new Error("Discount ID is missing");
      }

    } catch (error) {
      console.error("Error deleting discount:", error);
      toast.error("Failed to delete discount.");
    } finally {
      setLoadingDelete(false);
    }
  }

  const handleEditQuickButton = async () => {
    setLoadingEdit(true);
    if (!name || !multiplier || !discount.id) {
      toast.error(`Please fill in all required fields.`);
      setLoadingEdit(false);
      return;
    }

    const discountData = {
      id: discount.id,
      name: name,
      value: name.split(' ').join('_'),
      multiplier: multiplier,
    }

    editDiscount(discountData)
      .then(() => {
        toast.success(`Discount ${name} edited successfully!`);
        onEdit();
        setExpand(false);
      }).finally(() => {
        setLoadingEdit(false);
      });
  }

  return (
    <>
      <div
        key={discount.id}
        className="flex flex-col text-xl text-start space-x-3 border border-zinc-300 rounded-lg px-2 py-1"
      >

        <div className="flex flex-row w-full">
          <div className="flex flex-col w-full">
            {discount.name}
          </div>

          {/* Remove Button Button */}
          <div className="w-full text-end">
            <motion.button
              className="text-red-500 hover:text-red-400"
              onClick={openConfirmDeleteModal}
            >
              <FaDeleteLeft size={35} />
            </motion.button>
          </div>
        </div>

        <div className="flex flex-col w-full">
          {(discount.multiplier).toFixed(0)}%
        </div>


        {expand && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: "0" }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.3 }}
            className="col-span-4 w-full h-full rounded-lg p-4 items-center justify-start gap-4"
          >
            <div className="flex flex-col w-full h-full space-y-2">
              <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">name</label>
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
              <div className="flex flex-row w-full space-x-2">

                <div className="flex flex-col w-full">
                  {/* Multiplier Field */}
                  <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Multiplier</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="1"
                    min="0"
                    className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    placeholder="Multiplier"
                    onChange={(e) => {
                      const value = e.target.value;
                      setMultiplier(value === "" ? 0 : parseInt(value));
                    }}
                    value={multiplier || ""}
                  />
                  <div className="text-md font-medium text-zinc-500 text-left px-2 wrap-break-word">
                    Discount percent
                  </div>
                </div>

              </div>

              {loadingEdit ? (
                // Loading spinner
                <div className="flex justify-center items-center py-2">
                  <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="flex flex-row space-x-2 w-full">
                  <button
                    type="button"
                    className="flex h-full w-full bg-blue-600 text-white font-semibold text-2xl p-5 justify-center items-center px-10
                        hover:bg-zinc-400 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                    onClick={() => {
                      if (name && (multiplier > 0)) {
                        handleEditQuickButton();
                      }
                    }}
                  >
                    Confirm
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
        <div className="col-span-4 w-full items-center">
          {expand ? (
            <TextButton onClick={() => {
              setExpand(false);
            }}>
              Cancel
            </TextButton>
          ) : (
            <TextButton onClick={() => {
              setExpand(true);
            }}>
              See more
            </TextButton>
          )}
        </div>



      </div>


      <Modal
        open={confirmDelete}
        title={`Confirm Delete: ${discount.name}`}
        onClose={closeConfirmDeleteModal}
        ref={modalRef}
        width="max-w-2xl"
        height="max-h-[60vh]"
      >
        <div className="flex flex-col gap-4 pb-4">
          <label className="text-xl text-zinc-700 w-full text-left p-5">
            This action cannot be undone. This will permanently delete the button from the database.
          </label>
        </div>

        <div className="flex flex-col items-center gap-2">
          {/* Loading Spinner */}
          {loadingDelete ? (
            <div className="flex justify-center items-center py-2">
              <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="text-2xl font-semibold w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out"
              onClick={() => {
                handleDeleteQuickButton();
              }}
            >
              Confirm
            </motion.button>
          )}
        </div>
      </Modal>
    </>
  );
}

export default DiscountTag;