import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronRight } from "react-icons/fa";
import { ProductSubcategory } from "@/components/global.utils";

const ITEMS_PER_PAGE = 4;

export default function SubcategoryDropdownFilter({
  options,
  currentOption,
  handleClick,
}: {
  options: ProductSubcategory[];
  currentOption?: { name: string };
  handleClick: (event: "select" | "see more", option: ProductSubcategory) => void;
}) {
  // “start” is the first index shown in the current window
  const [start, setStart] = useState(0);

  // Slice only once per render
  const visibleOptions = useMemo(
    () => options.slice(start, start + ITEMS_PER_PAGE),
    [options, start]
  );

  const showSeeMore = options.length > ITEMS_PER_PAGE;

  const handleSeeMore = () => {
    const nextStart = start + ITEMS_PER_PAGE;
    setStart(nextStart >= options.length ? 0 : nextStart);
    handleClick("see more", {} as ProductSubcategory);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.ul
        key={start} // triggers exit/enter animation on window change
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="hidden md:flex flex-row w-full items-center justify-center space-x-16 p-2 overflow-hidden"
      >
        {visibleOptions.map((option, index) => (
          <motion.div
            key={option.name + index}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            onClick={() => handleClick("select", option)}
            className="text-md lg:text-lg whitespace-nowrap font-serif cursor-pointer flex flex-row items-center"
          >
            <motion.div
              animate={currentOption?.name === option.name ? { rotate: 90 } : {}}
            >
              <FaChevronRight className="mr-2" />
            </motion.div>
            <li className="underline-animate">{option.name}</li>
          </motion.div>
        ))}

        {showSeeMore && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            onClick={handleSeeMore}
            className="text-md lg:text-lg whitespace-nowrap font-serif cursor-pointer flex flex-row items-center justify-center"
          >
            <li className="underline-animate">…</li>
          </motion.div>
        )}
      </motion.ul>
    </AnimatePresence>
  );
}
