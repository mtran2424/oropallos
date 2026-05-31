import { useCallback, useEffect, useRef, useState } from "react";
import { Product } from "@/components/global.utils";
import { editProduct } from "@/app/api/productapi";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaBoxOpen } from "react-icons/fa6";
import TextButton from "../ui/TextButton";

// This component is a button that opens a modal for adding a product
const AddUnit = ({ onAddUnit, product }: {
  onAddUnit: () => void;
  product: Product;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [addUnit, setAddUnit] = useState(false);
  const [loading, setLoading] = useState(false);

  // States for form fields
  const [unitCount, setUnitCount] = useState<number>(product.unitCount !== undefined ? product.unitCount : 0);
  const [quantity, setQuantity] = useState<number>(0);
  const [caseCount, setCaseCount] = useState<number>(6);
  const [mode, setMode] = useState<"Add" | "Edit">("Edit");

  // Multiplier determines whether to multiply the unit count by case (for cases) or leave it as is (for units)
  const [type, setType] = useState<"Case" | "Unit">("Unit");

  // Upon form submission, validate the input and send it to the backend
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (unitCount === undefined) {
      toast.error(`Please fill in all required fields.`);
      setLoading(false);
      return;
    }

    // TODO: Add case count field to db

    // Construct product data object to be sent to the API
    const productData = {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      subcategory: product.subcategory,
      type: product.type,
      imageUrl: product.imageUrl,
      favorite: product.favorite,
      abv: product.abv,
      size: product.size,
      upc: product.upc,
      hidden: product.hidden,
      unitPrice: product.unitPrice,
      unitCount: unitCount + (type === "Case" ? quantity * caseCount : quantity),
    };

    if (product.id) {
      // Send the product data to the backend API to create a new product
      editProduct(product.id, productData)
        .then(() => {
          onAddUnit();
          // Show success message
          toast.success(`Product ${product.name} - ${product.size} UPC added successfully!`);

          // Close the modal after submission
          setAddUnit(false);
          setUnitCount(product.unitCount !== undefined ? product.unitCount : 0);
        }).finally(() => {
          setLoading(false);
        });
    } else {
      toast.error("Product ID is undefined.");
    }
  };

  // Open the modal for adding a product
  const openEventModal = () => {
    setAddUnit(true);
  };

  // Close the modal for adding a product
  const closeEventModal = () => {
    setAddUnit(false);
  };

  // Close the modal when clicking outside of it
  const closeModalOnOutsideClick = useCallback((e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeEventModal();
    }
  }, []);

  // Add event listener for closing the modal when clicking outside of it
  useEffect(() => {
    if (addUnit) {
      document.addEventListener('mousedown', closeModalOnOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', closeModalOnOutsideClick);
    };
  }, [closeModalOnOutsideClick, addUnit]);

  useEffect(() => {
    // Reset form fields when product changes
    setUnitCount(product.unitCount !== undefined ? product.unitCount : 0);
  }, [product]);

  useEffect(() => {
    // Reset form fields when product changes
    setUnitCount(product.unitCount !== undefined ? product.unitCount : 0);
    setQuantity(0);
    setType("Unit");
  }, [mode]);

  return (
    <>
      {/* Add event button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        className="flex flex-row text-md items-center text-blue-500 hover:text-blue-300 p-1"
        onClick={openEventModal}>
        <FaBoxOpen size={25} />
      </motion.button>

      {/* Modal for adding event */}
      <AnimatePresence mode="wait">
        {addUnit && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: "0" }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3 }}
              ref={modalRef}
              className="relative bg-white p-6 rounded-2xl max-w-2xl w-full shadow-lg max-h-[70vh] overflow-auto border border-zinc-500"
            >
              {/* Modal Header */}
              <h3 className="text-2xl text-zinc-900 mb-4 mt-2 text-left">Add Inventory</h3>

              {/* Close Modal Button */}
              <div className="absolute top-4 right-4">
                <TextButton onClick={closeEventModal}>
                  Close
                </TextButton>
              </div>

              {/* Form for adding event */}
              <div className="mt-6 w-full border-t border-zinc-500 text-sm sm:text-md p-4">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  {product.name} - {product.size}

                  <div className="grid grid-cols-4 w-full gap-1">
                    <TextButton onClick={() => setMode("Edit")} disabled={mode === "Edit"}>
                      Edit Count
                    </TextButton>
                    <TextButton onClick={() => setMode("Add")} disabled={mode === "Add"}>
                      Add Units
                    </TextButton>
                  </div>

                  <div className="text-lg font-semibold text-zinc-500 w-full text-left px-4">Details</div>

                  {mode === "Edit" && (
                    <>
                      {/* Unit Count Field */}
                      <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Unit Count</label>
                      <input
                        type="number"
                        step="1"
                        className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                        placeholder="Unit Count"
                        onChange={(e) => {
                          const value = e.target.value;
                          setUnitCount(value === "" ? 0 : parseInt(value));
                        }}
                        value={unitCount || ""}
                      />
                    </>
                  )}
                  {mode === "Add" && (<>
                    {/* Unit Count Field */}
                    <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Type</label>
                    <div className="grid grid-cols-2 w-full gap-1">
                      <button type="button" className={`p-5 rounded-md text-white text-2xl ${type === "Case" ? "bg-zinc-500" : "bg-blue-600"} hover:bg-zinc-400`} onClick={() => setType("Case")}>Case</button>
                      <button type="button" className={`p-5 rounded-md text-white text-2xl ${type === "Unit" ? "bg-zinc-500" : "bg-blue-600"} hover:bg-zinc-400`} onClick={() => setType("Unit")}>Unit</button>
                    </div>

                    <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Quantity</label>
                    <input
                      type="number"
                      step="1"
                      className="text-5xl font-semibold text-center rounded-lg w-40 p-2 outline-1 outline-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                      onChange={(e) => {
                        const value = e.target.value;
                        setQuantity(parseInt(value));
                      }}
                      value={quantity || ""}
                    />
                  </>)}

                  {loading ? (
                    // Loading spinner
                    <div className="flex justify-center items-center py-2">
                      <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    // Submit button
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out"
                    >
                      Submit
                    </motion.button>
                  )}
                </form>
              </div>
            </motion.div>
          </div >
        )}

      </AnimatePresence >

    </>
  );
}

export default AddUnit;