import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import { IoIosAdd } from "react-icons/io";
import { createConfig } from "@/app/api/configapi";
import { useUser } from "@clerk/nextjs";

// This component is a button that opens a modal for adding a product
const AddConfig = ({ onAddConfig }: {
  onAddConfig: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [addConfig, setAddConfig] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  // States for form fields
  const [key, setKey] = useState<string>("");
  const [value, setValue] = useState<string>("");
  // const [username, setUsername] = useState("");

  // Upon form submission, validate the input and send it to the backend
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!key || !value) {
      toast.error(`Please fill in all required fields.`);
      setLoading(false);
      return;
    }

    // Construct product data object to be sent to the API
    const configData = {
      key: key,
      value: value,
      user: user ? user.username : ""
    };

    // Send the product data to the backend API to create a new product
    createConfig(configData)
      .then(() => {
        onAddConfig();
        // Show success message
        toast.success(`Config added successfully!`);

        // Close the modal after submission
        setAddConfig(false);
      }).finally(() => {
        setLoading(false);
      });
  };

  // Open the modal for adding a product
  const openEventModal = () => {
    setAddConfig(true);
  };

  // Close the modal for adding a product
  const closeEventModal = () => {
    setAddConfig(false);
  };

  // Close the modal when clicking outside of it
  const closeModalOnOutsideClick = useCallback((e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeEventModal();
    }
  }, []);

  // Add event listener for closing the modal when clicking outside of it
  useEffect(() => {
    if (addConfig) {
      document.addEventListener('mousedown', closeModalOnOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', closeModalOnOutsideClick);
    };
  }, [closeModalOnOutsideClick, addConfig]);

  return (
    <>
      {/* Add event button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        className="flex flex-row text-md items-center text-blue-500 hover:text-blue-300 p-1"
        onClick={openEventModal}
        disabled={user?.username !== "admin"}
      >
        <IoIosAdd size={35} /> Add Config
      </motion.button>

      {/* Modal for adding upc */}
      <Modal open={addConfig} title="Add UPC" onClose={closeEventModal} ref={modalRef} height="max-h-[50vh]" width="max-w-2xl">
        {/* Form for adding upc */}
        <div className="mt-6 w-full border-t border-zinc-500 text-sm sm:text-md p-4">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

            <div className="text-lg font-semibold text-zinc-500 w-full text-left px-4">Details</div>

            {/* UPC Field */}
            <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Key</label>
            <input
              type="text"
              className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
              placeholder="Key"
              onChange={(e) => {
                setKey(e.target.value)
              }}
              value={key || ""}
            />
            <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Value</label>
            <input
              type="text"
              className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
              placeholder="Value"
              onChange={(e) => {
                setValue(e.target.value)
              }}
              value={value || ""}
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

export default AddConfig;