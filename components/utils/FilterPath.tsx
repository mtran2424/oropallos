import { ProductCategory, ProductSubcategory } from "@/components/global.utils";
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronRight } from "react-icons/fa";

const FilterPath = ({
  category,
  subcategory,
  type,
  onClearClick,
  onCategoryClick,
  onSubcategoryClick,
  onTypeClick,
}: {
  category: ProductCategory | undefined;
  subcategory: ProductSubcategory | undefined;
  type: string | undefined;
  onClearClick: () => void;
  onCategoryClick: () => void;
  onSubcategoryClick: () => void;
  onTypeClick: () => void;
}) => {
  return (
    <div className="flex flex-col items-center whitespace-nowrap">

      <div className="grid grid-cols-1 max-w-7xl w-full justify-center">
        {/* Filter Header */}
        <h2 className="text-lg font-bold text-zinc-900 px-5">Filters</h2>

        {/* Filter Path */}
        <div className="flex flex-row items-center px-5 font-montserrat text-md">

          {/* Clear Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            onClick={() => {
              onClearClick();
            }}
          >
            Products
          </motion.button>

          {/* Category Click Button */}
          <AnimatePresence mode="wait">
            {category &&
              <motion.div
                key={category.value}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex flex-row items-center"
              >
                <FaChevronRight className="mx-2" />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  onClick={() => {
                    onCategoryClick();
                  }}
                >
                  {category?.name}
                </motion.button>

              </motion.div>

            }
          </AnimatePresence>

          {/* Model Click Button */}
          <AnimatePresence mode="wait">
            {category && subcategory &&
              <motion.div
                key={subcategory.name}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex flex-row items-center"
              >
                <FaChevronRight className="mx-2" />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  onClick={() => {
                    onSubcategoryClick();
                  }}
                >
                  {subcategory.name}
                </motion.button>
              </motion.div>
            }
          </AnimatePresence>

          {/* Name Click Button */}
          <AnimatePresence mode="wait">
            {category && subcategory && type &&
              <motion.div
                key={type}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex flex-row items-center"
              >
                <FaChevronRight className="mx-2" />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  onClick={() => {
                    onTypeClick();
                  }}
                >
                  {type.split("_").join(" ")}
                </motion.button>
              </motion.div>
            }
          </AnimatePresence>

        </div>
      </div>
    </div>
  );

}

export default FilterPath;