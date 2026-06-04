import { useCallback, useEffect, useRef, useState } from "react";
import { Product } from "@/components/global.utils";
import { editProduct } from "@/app/api/productapi";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { IoScan } from "react-icons/io5";
import TextButton from "../ui/TextButton";
import Modal from "../ui/Modal";

// This component is a button that opens a modal for adding a product
const AddUPC = ({ onAddUpc, product }: {
  onAddUpc: () => void;
  product: Product;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [addUpc, setAddUpc] = useState(false);
  const [loading, setLoading] = useState(false);

  // States for form fields
  const [upc, setUpc] = useState("");
  // Upon form submission, validate the input and send it to the backend
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!upc) {
      toast.error(`Please fill in all required fields.`);
      setLoading(false);
      return;
    }

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
      upc: upc,
      hidden: product.hidden,
      unitPrice: product.unitPrice,
      unitCount: product.unitCount,
    };

    if (product.id) {
      // Send the product data to the backend API to create a new product
      editProduct(product.id, productData)
        .then(() => {
          onAddUpc();
          // Show success message
          toast.success(`Product ${product.name} - ${product.size} UPC added successfully!`);

          // Close the modal after submission
          setAddUpc(false);
          setUpc("");
        }).finally(() => {
          setLoading(false);
        });
    } else {
      toast.error("Product ID is undefined.");
    }
  };

  // Open the modal for adding a product
  const openEventModal = () => {
    setAddUpc(true);
  };

  // Close the modal for adding a product
  const closeEventModal = () => {
    setAddUpc(false);
  };

  // Close the modal when clicking outside of it
  const closeModalOnOutsideClick = useCallback((e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeEventModal();
    }
  }, []);

  // Add event listener for closing the modal when clicking outside of it
  useEffect(() => {
    if (addUpc) {
      document.addEventListener('mousedown', closeModalOnOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', closeModalOnOutsideClick);
    };
  }, [closeModalOnOutsideClick, addUpc]);

  useEffect(() => {
    // Reset form fields when product changes
    setUpc(product.upc || "");
  }, [product]);

  return (
    <>
      {/* Add event button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        className="flex flex-row text-md items-center text-blue-500 hover:text-blue-300 p-1"
        onClick={openEventModal}>
        <IoScan size={35} />
      </motion.button>

      {/* Modal for adding upc */}
      <Modal open={addUpc} title="Add UPC" onClose={closeEventModal} ref={modalRef} height="max-h-[50vh]" width="max-w-2xl">
        {/* Form for adding upc */}
        <div className="mt-6 w-full border-t border-zinc-500 text-sm sm:text-md p-4">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {product.name} - {product.size}

            <div className="text-lg font-semibold text-zinc-500 w-full text-left px-4">Details</div>

            {/* UPC Field */}
            <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">UPC</label>
            <input
              type="text"
              className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
              placeholder="UPC"
              onChange={(e) => {
                setUpc(e.target.value)
              }}
              value={upc || ""}
            />

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
      </Modal>
    </>
  );
}

export default AddUPC;