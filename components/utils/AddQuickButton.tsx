import { motion } from "framer-motion";
import { useDeferredValue, useMemo, useState } from "react";
import { IoIosAdd, IoMdClose } from "react-icons/io";
import Image from "next/image";
import Modal from "../ui/Modal";
import { Discount, Product, sanitize } from "../global.utils";
import { FaSearch } from "react-icons/fa";
import { CiImageOff } from "react-icons/ci";
import toast from "react-hot-toast";
import { createQuickAddButton } from "@/app/api/adminapi";

const AddQuickButton = ({ products, ref, onAdd }: {
  products: Product[],
  ref: React.Ref<HTMLDivElement>,
  onAdd: () => void,
}) => {
  const [add, setAdd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Product>();
  const [units, setUnits] = useState<number>(1);
  const [type, setType] = useState<"Liquor" | "Wine">("Liquor");
  const [price, setPrice] = useState<number>(0);
  const [label, setLabel] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const deferredSearch = useDeferredValue(searchTerm);
  const [sortOption, setSortOption] = useState("name-desc");

  // Apply filters, seach terms, and sorting
  const sortedAndFilteredProducts = useMemo(() => {
    const term = deferredSearch.toLowerCase();

    const filtered = term !== "" && products ? products.filter((product) =>
      [product.name, product.upc]
        .filter(Boolean)
        .some((field) => sanitize(field ? field : "").includes(sanitize(term)))
    ) : [];

    // Choose sorting method
    const sorted = [...filtered];

    switch (sortOption) {
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-desc":
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "oldest-newest":
        sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateA.getTime() - dateB.getTime();
        });
        break;
      case "newest-oldest":
        sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
        break;
    }

    return sorted;
  }, [products, deferredSearch, sortOption]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const openModal = () => {
    setAdd(true);
  }

  const closeModal = () => {
    setAdd(false);
  }

  const handleConfirm = () => {
    setLoading(true);

    if (!label || !price || !currentProduct || !type) {
      toast.error(`Please fill in all required fields.`);
      setLoading(false);
      return;
    }

    const buttonData = {
      productId: currentProduct.id,
      label: label,
      name: currentProduct.name,
      price: parseInt((price * 100).toFixed(0)),
      units: units,
      type: type,
    }

    createQuickAddButton(buttonData)
      .then(() => {
        toast.success(`Button ${label} added successfully!`);

        onAdd();
        setLabel("");
        setPrice(0);
        setUnits(1);
        setType("Liquor");
        setCurrentProduct(undefined);
        setSearchTerm("");
        setAdd(false);
      }).finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      {/* Add event button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        className="flex flex-row text-md items-center text-blue-500 hover:text-blue-300 p-1"
        onClick={openModal}>
        <IoIosAdd size={25} />
        New Button
      </motion.button>

      <Modal
        open={add}
        title="New Button"
        onClose={closeModal}
        ref={ref}
        width="max-w-[60vw]"
      >
        <div className="grid grid-cols-2 w-full space-y-5">

          {/* Product Search */}
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="h-full bg-zinc-100 border border-zinc-300 w-full px-5 py-10 space-y-5"
          >
            {/* Search Bar Component */}
            <div className="flex flex-center items-center w-full">
              {searchTerm !== "" ? (
                <motion.div
                  key={"clear"}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={() => setSearchTerm("")}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-gray-600 p-2 focus:outline-none"
                >
                  <IoMdClose size={30} />
                </motion.div>
              ) : (
                <motion.div
                  key={"search"}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  exit={{ scaleX: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-gray-600 p-2 focus:outline-none"
                >
                  <FaSearch size={25} />
                </motion.div>
              )}

              {/* Search Input */}
              <motion.input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by name, or barcode..."
                initial={{ width: 0, opacity: 0 }}
                animate={{
                  width: "100%",
                  opacity: 1,
                  paddingLeft: "0.75rem",
                  paddingRight: "0.75rem",
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden"
                style={{ whiteSpace: "nowrap" }}
              />
            </div>

            {/* Sort Selector */}
            <div className="flex flex-row w-full whitespace-nowrap">
              {/* Sort Dropdown */}
              <div className="flex justify-end w-full p-2">
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="border border-gray-300 rounded px-3 py-2 text-md"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low → High)</option>
                  <option value="price-desc">Price (High → Low)</option>
                  <option value="newest-oldest">Date (Newest → Oldest)</option>
                  <option value="oldest-newest">Date (Oldest → Newest)</option>
                </select>
              </div>
            </div>

            {/* Product table */}
            <div className="flex w-full max-h-[40vh] overflow-hidden rounded-md shadow-md border border-zinc-400 text-zinc-800">

              <div className="flex overflow-auto w-screen">
                <table className="w-full divide-y divide-zinc-400">

                  {/* Table headers */}
                  <thead className="sticky top-0 bg-white z-20">
                    <tr>
                      <th
                        className="px-4 py-3 text-left text-md font-medium uppercase tracking-widest whitespace-nowrap"
                      >
                        <strong>Item</strong>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-md font-medium uppercase tracking-widest whitespace-nowrap"
                      >
                        <strong>Current Item Price</strong>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-zinc-400">
                    {sortedAndFilteredProducts.length > 0 ? (
                      sortedAndFilteredProducts.map((product: Product) => (
                        <tr className={`${currentProduct && product.id === currentProduct.id ? "bg-zinc-500" : ""} hover:bg-zinc-400 transition-colors ease-linear`} key={product.id}
                          onClick={() => {
                            setCurrentProduct(product);
                            setSearchTerm(product.upc ? product.upc : product.name)
                          }}>
                          <td className="text-start p-2">
                            <div className="grid grid-cols-2 text-xl">

                              <div className="relative w-20 h-20 mx-auto mb-2 overflow-hidden rounded-lg">
                                {product.imageUrl ? (
                                  <motion.div
                                    className="w-full h-full"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <Image
                                      priority
                                      src={product.imageUrl}
                                      alt={product.name}
                                      className="object-cover w-full h-full"
                                      width={300}
                                      height={300}
                                    />
                                  </motion.div>
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-zinc-100">
                                    <CiImageOff size={40} className="text-zinc-400" />
                                  </div>
                                )}
                              </div>
                              {product.name + " - " + product.size}

                            </div>
                          </td>
                          <td className="text-center p-2 text-xl">{product.price}</td>
                        </tr>
                      ))
                    ) : (<tr>
                      <td colSpan={4} className="text-center text-lg py-4 text-zinc-900">
                        No products match selected filters.
                      </td>
                    </tr>)}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="h-full bg-zinc-100 border border-zinc-300 w-full px-5 py-10 space-y-5"
          >
            {/* Name Field */}
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
                className={`flex h-full w-full ${(type === "Wine") ? "bg-blue-600" : "bg-zinc-800"} text-white font-semibold text-2xl p-5 justify-center items-center
                         rounded-sm transition-colors ease-linear`}
                onClick={() =>
                  setType("Wine")
                }
              >
                Wine
              </button>
            </div>

            {loading ? (
              // Loading spinner
              <div className="flex justify-center items-center py-2">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="flex flex-row space-x-2 w-full">
                <button
                  className="flex h-full w-full bg-blue-600 text-white font-semibold text-2xl p-5 justify-center items-center px-10
                        hover:bg-zinc-400 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                  onClick={() => {
                    if (currentProduct && (price > 0) && (units > 0)) {
                      handleConfirm();
                    }
                  }}
                >
                  Confirm
                </button>
              </div>
            )}
          </motion.div>
          <div />
        </div>
      </Modal>
    </>
  );
}

export default AddQuickButton;