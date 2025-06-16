import { motion } from "framer-motion";
import { ProductCategory, ProductSubcategory, ProductType } from "@/components/global.utils";

const TypeDropdownFilter = ({
  currentCategory,
  currentSubcategory,
  handleTypeClick,
  // key
}: {
  currentCategory: ProductCategory | undefined,
  currentSubcategory: ProductSubcategory,
  handleTypeClick: (type: ProductType) => void,
  // key: string
}) => {
  return (
    <div className="items-center justify-center">
      {/* Show all types */}
      <motion.ul
        key={currentSubcategory.name}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`hidden md:grid 
                ${currentSubcategory && currentSubcategory.types.length === 2 ? "grid-cols-8"
            : currentSubcategory && currentSubcategory.types.length === 3 ? "grid-cols-12"
              : "grid-cols-12 lg:grid-cols-16"
          }
              w-full items-start justify-center px-5 mt-2`}
      >
        {/* If liquor subcategory is selected, show liquor subtypes */}
        {currentCategory && currentSubcategory && currentSubcategory.types
          .map((type, index) => (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              key={index}
              onClick={() => {
                handleTypeClick(type);
              }}
              className="col-span-4 text-md lg:text-lg whitespace-nowrap font-serif cursor-pointer flex flex-row items-center justify-center"
            >
              <li className="text-md lg:text-lg whitespace-nowrap font-serif cursor-pointer underline-animate">
                {type.name}
              </li>
            </motion.div>
          ))}
      </motion.ul>
    </div>
  );
}

export default TypeDropdownFilter;