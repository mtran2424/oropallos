import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Discount, fifteenPercentDiscount, noDiscount, Product, sanitize, taxFreeDiscount } from "../global.utils";
import Modal from "../ui/Modal";
import { motion } from "framer-motion";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { CiImageOff } from "react-icons/ci";
import { IoBackspaceOutline } from "react-icons/io5";
import { MdKeyboardReturn } from "react-icons/md";

const AddCustom = ({ products, ref, onClick }: {
  products: Product[];
  ref: React.Ref<HTMLDivElement>;
  onClick: (
    product: Product,
    quantity: number,
    name: string,
    type: string,
    discount: Discount,
    price: number) => void
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [add, setAdd] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product>();
  const [quantity, setQuantity] = useState<number>(1);
  const [type, setType] = useState<"Liquor" | "Wine">("Liquor");
  const [price, setPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<Discount>(noDiscount);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const deferredSearch = useDeferredValue(searchTerm);
  const [sortOption, setSortOption] = useState("name-desc");

  const [input, setInput] = useState<string>("");

  const openModal = () => {
    setAdd(true);
  }
  const closeModal = () => {
    setAdd(false);
    setCurrentProduct(undefined);
    setQuantity(1);
    setPrice(0);
    setDiscount(noDiscount);
    setType("Liquor");
    setInput("");
    setSearchTerm("");
  }

  // Apply filters, seach terms, and sorting
  const sortedAndFilteredProducts = useMemo(() => {
    const term = deferredSearch.toLowerCase();

    const filtered = term !== "" ? products.filter((product) =>
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

  const handleConfirm = () => {
    if (currentProduct) {
      onClick(currentProduct, quantity, currentProduct.name, type, discount, (quantity > 1) ? (price / quantity) : price);
      closeModal();
    }
  }

  return (
    <>
      <button
        className="font-semibold bg-blue-900 text-white text-2xl hover:bg-zinc-400 hover:text-zinc-600 transition-colors ease-linear py-10 px-2 rounded-sm"
        onClick={openModal}
      >
        Custom
      </button>

      <Modal
        open={add}
        title="Custom Product"
        onClose={closeModal}
        ref={ref}
        width="max-w-[85vw]"
      >
        <div className="grid grid-cols-2 w-full space-y-5">

          {/* Product Search */}
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="bg-zinc-100 border border-zinc-300 w-[40vw] px-5 py-10 space-y-5"
          >
            {/* Search Bar Component */}
            <div className="flex flex-center items-center w-full max-w-7xl ">
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
                  // onClick={() => toggleFullscreen()}
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
                ref={inputRef}
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
                      sortedAndFilteredProducts.map((product) => (
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

            {/* Input Fields */}
            <div className="flex flex-row w-full space-x-2">
              <div className="flex flex-col w-1/4">
                {/* Quantity Field */}
                <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Qty</label>
                <input
                  type="number"
                  className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                  placeholder="Quantity"
                  readOnly
                  value={quantity.toFixed(0)}
                />
              </div>

              <div className="flex flex-col w-full">
                {/* Price Field */}
                <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Price</label>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                  placeholder="Price"
                  readOnly
                  value={(price / 100).toFixed(2)}
                />
              </div>
            </div>

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

            <div className="flex flex-col w-full">
              {/* Discount Field */}
              <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Price</label>
              <input
                type="text"
                className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out w-full"
                placeholder="Discount"
                value={discount.name}
                readOnly
              />
            </div>

          </motion.div>

          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="bg-zinc-100 border border-zinc-300 w-[40vw] px-5 py-10"
          >
            {/* Input bar */}
            <motion.div
              className="p-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                        overflow-hidden w-full h-30 mb-5"
            >
              {/* Current input dash display */}
              {/* <div className="grid grid-cols-2 text-lg w-full text-zinc-500">
                {quantity ? <div className="text-start">
                  Qty: {quantity}
                </div> : <div />}
                {type ? <div className="text-end">
                  {type}
                </div> : <div />}
              </div> */}
              <input
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="p-2 text-3xl overflow-hidden w-full focus:outline-none"
                style={{ whiteSpace: "nowrap" }}
              />
              {/* {discount && <div className="text-start text-lg text-zinc-500">
                {discount.name}
              </div>} */}
            </motion.div>
            <div className="grid grid-cols-4 gap-x-1 gap-y-1">
              {/* First Row */}

              {/* Multi item button */}
              <button className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
                              hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                onClick={() => {
                  if (input !== "") {
                    setQuantity(parseInt(input));
                    setInput("");
                  }
                }}
              >
                @/for
              </button>

              <button></button>

              {/* Clear inputs */}
              <button
                className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
                        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                onClick={() => {
                  setInput("");
                  setDiscount(noDiscount);
                  setType("Liquor");
                  // setItem("");
                  setQuantity(1);
                }}
              >

                Clear
              </button>

              {/* TODO: Implement no sale order */}
              {/* <button
                className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
                        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                onClick={() => {
                  handlePrint();
                }}
              >
                No Sale
              </button> */}
              <button />

              {/* Second Row */}
              <button
                className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
                        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                onClick={() => setInput(`${input}7`)}
              >
                7
              </button>

              <button
                className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
                        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                onClick={() => setInput(`${input}8`)}
              >
                8
              </button>

              <button
                className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
                        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                onClick={() => setInput(`${input}9`)}
              >
                9
              </button>

              {/* Back space button */}
              <button
                className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
                        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                onClick={() => {
                  setInput(prev => prev.slice(0, -1));
                }}
              >
                <IoBackspaceOutline size={40} />
              </button>


              {/* Third Row */}
              <button
                className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
                        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                onClick={() => setInput(`${input}4`)}
              >
                4
              </button>

              <button
                className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
                        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                onClick={() => setInput(`${input}5`)}
              >
                5
              </button>

              <button
                className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
                        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                onClick={() => setInput(`${input}6`)}
              >
                6
              </button>

              {/* 15% Discount Shortcut button */}
              <button
                className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
                        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                onClick={() => {
                  if (discount !== fifteenPercentDiscount) {
                    setDiscount(fifteenPercentDiscount);
                  }
                  else {
                    setDiscount(noDiscount);
                  }
                }}
              >
                15%
              </button>

              {/* Fourth Row */}
              <button
                className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
                        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                onClick={() => setInput(`${input}1`)}
              >
                1
              </button>

              <button
                className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
                        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                onClick={() => setInput(`${input}2`)}
              >
                2
              </button>

              <button
                className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
                        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                onClick={() => setInput(`${input}3`)}
              >
                3
              </button>

              {/* Tax Free Discount Shortcut button */}
              <button
                className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
                        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                onClick={() => {
                  if (discount !== taxFreeDiscount) {
                    setDiscount(taxFreeDiscount);
                    if (input)
                      setInput((parseFloat(input) / 1.07).toFixed(0))
                  }
                  else {
                    setDiscount(noDiscount);
                  }
                }}
              >
                Tax Free
              </button>

              {/* Fifth Row */}
              <button
                className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
                        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear col-span-2"
                onClick={() => setInput(`${input}0`)}
              >
                0
              </button>

              <button
                className="flex h-full w-full bg-zinc-600 text-white font-semibold text-2xl p-5 justify-center items-center
                        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                onClick={() => setInput(`${input}00`)}
              >
                00
              </button>

              <button></button>

              {/* Seventh Row */}
              {/* Confirm item button */}
              <button
                className="flex h-full w-full bg-blue-600 text-white font-semibold text-2xl p-5 justify-center items-center px-10 col-span-4
                        hover:bg-zinc-400 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                onClick={() => {
                  if (input) {
                    setPrice(parseInt(input));
                    setInput("");
                  }
                }}
              >
                <MdKeyboardReturn size={40} />
              </button>

              {/* <div className="hidden" >
                <div className="print-area" ref={componentRef} >
                  {noSaleReceipt}
                </div>
              </div> */}
            </div>
          </motion.div>
          <div />
          <button
            className="flex h-full w-full bg-blue-600 text-white font-semibold text-2xl p-5 justify-center items-center px-10
                        hover:bg-zinc-400 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
            onClick={() => {
              if (currentProduct && quantity && (price > 0) && discount) {
                handleConfirm();
              }
            }}
          >
            Confirm
          </button>
        </div>
      </Modal>

    </>
  );
}

export default AddCustom;