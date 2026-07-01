import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { QuickAddButton } from "../global.utils";
import { MdDelete } from "react-icons/md";
import { useRef, useState } from "react";
import TextButton from "../ui/TextButton";
import Modal from "../ui/Modal";
import { deleteQuickAddButton, editQuickAddButton } from "@/app/api/adminapi";
import { FaDeleteLeft } from "react-icons/fa6";

const QuickButtonTag = ({
  quickButton,
  onEdit,
  onDelete,
}: {
  quickButton: QuickAddButton
  onEdit: () => void
  onDelete: () => void
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [loadingEdit, setLoadingEdit] = useState<boolean>(false);
  const [expand, setExpand] = useState<boolean>(false);
  const [units, setUnits] = useState<number>(quickButton.units);
  const [type, setType] = useState<"Liquor" | "Wine">(quickButton.type);
  const [price, setPrice] = useState<number>((quickButton.price / 100));
  const [label, setLabel] = useState<string>(quickButton.label);

  const openConfirmDeleteModal = () => {
    setConfirmDelete(true);
  }

  const closeConfirmDeleteModal = () => {
    setConfirmDelete(false);
  }

  const handleDeleteQuickButton = async () => {
    try {
      setLoadingDelete(true);
      if (quickButton.id) {
        await deleteQuickAddButton(quickButton.id)
          .then((res) => {
            if (res.status === 200) {
              toast.success('Button deleted successfully');
              onDelete();
              setConfirmDelete(false);
            }
            else {
              console.error('Failed to delete button');
              setConfirmDelete(false);
            }
            setLoadingDelete(false);
          });
      }
      else {
        throw new Error("Quick button ID is missing");
      }

    } catch (error) {
      console.error("Error deleting quick button:", error);
      toast.error("Failed to delete quick button.");
    } finally {
      setLoadingDelete(false);
    }
  }

  const handleEditQuickButton = async () => {
    setLoadingEdit(true);
    if (!label || !price || !type || !quickButton.product) {
      toast.error(`Please fill in all required fields.`);
      setLoadingEdit(false);
      return;
    }

    const buttonData = {
      id: quickButton.id,
      productId: quickButton.product.id,
      label: label,
      name: quickButton.product.name,
      price: parseInt((price * 100).toFixed(0)),
      units: units,
      type: type,
    }

    editQuickAddButton(buttonData)
      .then(() => {
        toast.success(`Button ${label} edited successfully!`);
        onEdit();
        setExpand(false);
      }).finally(() => {
        setLoadingEdit(false);
      });
  }

  return (
    <>
      <div
        key={quickButton.id}
        className="grid grid-cols-4 text-xl justify-start items-center space-x-3 border border-zinc-300 rounded-lg px-2 py-1"
      >
        <div className="flex flex-col w-full text-left items-center col-span-2">
          {quickButton.label}
        </div>

        <div className="flex flex-col w-full text-center">
          {(quickButton.price / 100).toFixed(2)}
        </div>

        {/* Remove Button Button */}
        <motion.button
          className="text-red-500 hover:text-red-400"
          onClick={openConfirmDeleteModal}
        >
          <FaDeleteLeft size={35} />
        </motion.button>

        {expand && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: "0" }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.3 }}
            className="col-span-4 w-full h-full rounded-lg p-4 items-center justify-start gap-4"
          >
            <div className="flex flex-col w-full h-full space-y-2">
              <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Label</label>
              <input
                type="text"
                required
                className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out w-full"
                placeholder="Label"
                value={label}
                onChange={(e) => {
                  setLabel(e.target.value)
                }}
              />
              <div className="text-md font-medium text-zinc-500 text-left px-2 wrap-break-word">
                Text displayed on quick button.
              </div>

              {/* Input Fields */}
              <div className="flex flex-row w-full space-x-2">

                <div className="flex flex-col w-1/4">
                  {/* Units Field */}
                  <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Units Per</label>
                  <input
                    type="number"
                    step="1"
                    min={1}
                    className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    placeholder="Units Per"
                    onChange={(e) => {
                      const value = e.target.value;
                      setUnits(value === "" ? 0 : parseInt(value) ?? 0);
                    }}
                    value={units || ""}
                  />
                  <div className="text-md font-medium text-zinc-500 text-left px-2 wrap-break-word">
                    How many units in custom product.
                  </div>
                </div>

                <div className="flex flex-col w-full">
                  {/* Price Field */}
                  <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Price</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0"
                    className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    placeholder="Price"
                    onChange={(e) => {
                      const value = e.target.value;
                      setPrice(value === "" ? 0 : parseFloat(value));
                    }}
                    value={price || ""}
                  />
                  <div className="text-md font-medium text-zinc-500 text-left px-2 wrap-break-word">
                    Price of a custom product.
                  </div>
                </div>

              </div>
              {/* Type Selector Buttons */}
              <div className="flex flex-row space-x-2 w-full">
                <button
                  type="button"
                  className={`flex h-full w-full ${(type === "Liquor") ? "bg-blue-600" : "bg-zinc-800"} text-white font-semibold text-2xl p-5 justify-center items-center
                         rounded-sm transition-colors ease-linear`}
                  onClick={() => {
                    setType("Liquor");
                  }}
                >
                  Liquor
                </button>

                {/* Wine type selector */}
                <button
                  type="button"
                  className={`flex h-full w-full ${(type === "Wine") ? "bg-blue-600" : "bg-zinc-800"} text-white font-semibold text-2xl p-5 justify-center items-center
                         rounded-sm transition-colors ease-linear`}
                  onClick={() =>
                    setType("Wine")
                  }
                >
                  Wine
                </button>
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
                      if ((price > 0) && (units > 0)) {
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
        title={`Confirm Delete: ${quickButton.label}`}
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

export default QuickButtonTag;