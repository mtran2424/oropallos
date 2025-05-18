"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  handleSearchChange,
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-center items-center w-full max-w-7xl ">
      {isOpen ? (
        // Close button
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={() => {
            setIsOpen(false)
            setSearchTerm("");
          }}
          className="text-gray-600 p-2 focus:outline-none"
        >
          <IoMdClose size={20} />
        </motion.button>
      ) : (
        // Open button
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-gray-600 p-2 focus:outline-none"
        >
          <FaSearch size={20} />
        </motion.button>
      )}

      {/* Search Input */}
      <motion.input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search by name, category, subcategory, or type..."
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: isOpen ? "100%" : 0,
          opacity: isOpen ? 1 : 0,
          paddingLeft: isOpen ? "0.75rem" : "0rem",
          paddingRight: isOpen ? "0.75rem" : "0rem",
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden"
        style={{ whiteSpace: "nowrap" }}
      />
    </div>);
}

export default SearchBar;