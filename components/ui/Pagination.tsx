import { motion } from "framer-motion";

const Pagination = ({
  prevClick,
  nextClick,
  currentPage,
  totalPages,
}: {
  prevClick: () => void;
  nextClick: () => void;
  currentPage: number;
  totalPages: number;
}) => {
  return (
    <div className="flex items-center justify-center space-x-2 gap-2 mb-8">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        disabled={currentPage === 1}
        onClick={prevClick}
        className={`px-4 py-2 rounded-full
          border-1 border-red-900 
          bg-red-900 disabled:border-0 disabled:bg-zinc-900 hover:bg-white
          text-white disabled:text-white hover:text-red-900
          transition-colors ease-in-out
          disabled:cursor-not-allowed disabled:opacity-50`}
      >
        Prev
      </motion.button>
      <span className="text-lg font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        disabled={currentPage === totalPages}
        onClick={nextClick}
        className={`px-4 py-2 rounded-full
          border-1 border-red-900 
          bg-red-900 disabled:border-0 disabled:bg-zinc-900 hover:bg-white
          text-white disabled:text-white hover:text-red-900
          transition-colors ease-in-out
          disabled:cursor-not-allowed disabled:opacity-50`}
      >
        Next
      </motion.button>
    </div>
  );
}

export default Pagination;