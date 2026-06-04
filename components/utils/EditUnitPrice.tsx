import { useCallback, useEffect, useRef, useState } from "react";
import { Product } from "@/components/global.utils";
import { createProduct, editProduct } from "@/app/api/productapi";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { BsCurrencyDollar } from "react-icons/bs";
import TextButton from "../ui/TextButton";
import Modal from "../ui/Modal";

// This component is a button that opens a modal for adding a product
const EditUnitPrice = ({ onEditPrice, product }: {
  onEditPrice: () => void;
  product: Product;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [editPrice, setEditPrice] = useState(false);
  const [loading, setLoading] = useState(false);

  // States for form fields
  const [unitPrice, setUnitPrice] = useState<number | undefined>(product.unitPrice !== undefined ? product.unitPrice / 100 : undefined);
  const [price, setPrice] = useState<number | undefined>(product.price || undefined);
  // Upon form submission, validate the input and send it to the backend
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!price) {
      toast.error(`Please fill in all required fields.`);
      setLoading(false);
      return;
    }

    // Construct product data object to be sent to the API
    const productData = {
      name: product.name,
      description: product.description,
      price: price,
      category: product.category,
      subcategory: product.subcategory,
      type: product.type,
      imageUrl: product.imageUrl,
      favorite: product.favorite,
      abv: product.abv,
      size: product.size,
      upc: product.upc,
      hidden: product.hidden,
      unitPrice: unitPrice !== undefined ? unitPrice * 100 : undefined,
      unitCount: product.unitCount,
    };

    if (product.id) {
      // Send the product data to the backend API to create a new product
      editProduct(product.id, productData)
        .then(() => {
          onEditPrice();
          // Show success message
          toast.success(`Product ${product.name} - ${product.size} unit price added successfully!`);

          // Close the modal after submission
          setEditPrice(false);
          setUnitPrice(product.unitPrice !== undefined ? product.unitPrice / 100 : undefined);
        }).finally(() => {
          setLoading(false);
        });
    } else {
      toast.error("Product ID is undefined.");
    }
  };

  // Open the modal for adding a product
  const openEventModal = () => {
    setEditPrice(true);
  };

  // Close the modal for adding a product
  const closeEventModal = () => {
    setEditPrice(false);
  };

  // Close the modal when clicking outside of it
  const closeModalOnOutsideClick = useCallback((e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeEventModal();
    }
  }, []);

  // Add event listener for closing the modal when clicking outside of it
  useEffect(() => {
    if (editPrice) {
      document.addEventListener('mousedown', closeModalOnOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', closeModalOnOutsideClick);
    };
  }, [closeModalOnOutsideClick, editPrice]);

  useEffect(() => {
    // Reset form fields when product changes
    setUnitPrice(product.unitPrice !== undefined ? product.unitPrice / 100 : undefined);
  }, [product]);

  return (
    <>
      {/* Add event button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        className="flex flex-row text-md items-center text-blue-500 hover:text-blue-300 p-1"
        onClick={openEventModal}>
        <BsCurrencyDollar size={35} />
      </motion.button>

      {/* Modal for editing prices */}
      <Modal open={editPrice} title="Edit Price" onClose={closeEventModal} ref={modalRef} height="max-h-[75vh]" width="max-w-2xl">
        {/* Form for editing prices */}
        <div className="mt-6 w-full border-t border-zinc-500 text-sm sm:text-md p-4">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {product.name} - {product.size}

            <div className="text-lg font-semibold text-zinc-500 w-full text-left px-4">Details</div>

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
                setPrice(value === "" ? undefined : parseFloat(value));
              }}
              value={price || ""}
            />
            <div className="text-sm font-semibold text-zinc-500 w-full text-left px-4">
              i.e. {'\"'}19.99{'\"'} - No $ sign needed
            </div>

            {/* Unit Price Field */}
            <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Unit Price</label>
            <input
              type="number"
              inputMode="decimal"
              step=".01"
              min="0"
              className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
              placeholder="Unit Price"
              onChange={(e) => {
                const value = e.target.value;
                setUnitPrice(value === "" ? undefined : parseFloat(value));
              }}
              value={unitPrice ?? ""}
            />
            <div className="text-sm font-semibold text-zinc-500 w-full text-left px-4">
              i.e. {'\"'}19.99{'\"'} - No $ sign needed
            </div>


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

export default EditUnitPrice;