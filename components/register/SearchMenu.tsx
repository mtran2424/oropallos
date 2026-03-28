import { AnimatePresence, motion } from "framer-motion";
import { useState, useMemo, useRef, useCallback, useEffect, useDeferredValue } from "react";
import SearchBar from "../ui/SearchBar";
import { Discount, fifteenPercentDiscount, getDiscount, noDiscount, Product, sanitize, taxFreeDiscount, TransactionItem } from "../global.utils";
import Image from "next/image";
import { CiImageOff } from "react-icons/ci";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

const SearchMenu = ({ products, onConfirm }: { products: Product[]; onConfirm: (item: TransactionItem) => void }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const deferredSearch = useDeferredValue(searchTerm);
  const [sortOption, setSortOption] = useState("newest-oldest");
  const modalRef = useRef<HTMLDivElement>(null);
  const [addItem, setAddItem] = useState(false);

  const [quantity, setQuantity] = useState<number>(1);
  const [currentProduct, setCurrentProduct] = useState<Product>();
  const [discount, setDiscount] = useState<Discount>(noDiscount);
  const [type, setType] = useState<string>("")

  // Handlers for search and sort

  // Apply filters, seach terms, and sorting
  const sortedAndFilteredProducts = useMemo(() => {
    const term = deferredSearch.toLowerCase();

    const filtered = term !== "" ? products.filter((product) =>
      [product.name, product.category, product.subcategory, product.type, product.size, product.upc]
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

  // Close the modal for adding a product
  const closeEventModal = () => {
    setAddItem(false);
  };

  // Close the modal when clicking outside of it
  const closeModalOnOutsideClick = useCallback((e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeEventModal();
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };


  // Calculate price
  const getPrice = (discount: string, price: number) => {
    switch(discount) {
      case "Tax_Free": return (price/1.07);
      default: return price;
    }
  }

  const handleSubmit = () => {
    // Type of item and product required to be submitted
    if(quantity && type && currentProduct) {
      onConfirm({
        type: type,
        name: currentProduct.name,
        quantity: quantity,
        discount: discount,
        unitPrice: parseFloat(getPrice(discount.value, currentProduct.price * 100).toFixed(2))
      })

      // Reset states upon confirm
      setCurrentProduct(undefined);
      setQuantity(1);
      setDiscount(noDiscount);
      setType("");
      setAddItem(false);
    }
  };

  // Add event listener for closing the modal when clicking outside of it
    useEffect(() => {
      if (addItem) {
        document.addEventListener('mousedown', closeModalOnOutsideClick);
      }
      return () => {
        document.removeEventListener('mousedown', closeModalOnOutsideClick);
      };
    }, [closeModalOnOutsideClick, addItem]);

  return (
    <>
      <motion.div
        initial={{ y: "-100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="bg-zinc-100 border border-zinc-300 w-[40vw] px-5 py-10"
      >
        {/* Search Bar Component */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearchChange={handleSearchChange}
        />

        <div className="flex flex-row w-full whitespace-nowrap">

          {/* Sort Dropdown */}
          <div className="flex justify-end w-full p-2">
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
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
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest whitespace-nowrap"
                  >
                    <strong>Item</strong>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest whitespace-nowrap"
                  >
                    <strong>Price</strong>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-400">
                {sortedAndFilteredProducts.length > 0 ? (
                  sortedAndFilteredProducts.map((product) => (
                    <tr className="hover:bg-zinc-400 transition-colors ease-linear" key={product.id}
                      onClick={() => {
                        setCurrentProduct(product);
                        setAddItem(true);
                      }}>
                      <td className="text-start p-2">
                        <div className="grid grid-cols-2">

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
                      <td className="text-center p-2">{product.price}</td>
                    </tr>
                  ))
                ) : (<tr>
                  <td colSpan={4} className="text-center py-4 text-zinc-900">
                    No products match selected filters.
                  </td>
                </tr>)}
              </tbody>

            </table>
          </div>
        </div>
      </motion.div>
      <AnimatePresence mode="wait">
        {addItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: "0" }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3 }}
              ref={modalRef}
              className="relative bg-white p-6 rounded-2xl max-w-2xl w-full shadow-lg max-h-[70vh] overflow-y-auto border border-zinc-500"
            >
              {/* Modal Header */}
              <h3 className="text-xl text-zinc-900 mb-4 mt-2 text-left">Add Item</h3>
              {/* Close Modal Button */}
              <div className="absolute top-4 right-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="text-lg text-blue-500 hover:text-zinc-200"
                  onClick={closeEventModal}
                >
                  Close
                </motion.button>
              </div>

              <div className="mt-6 w-full border-t border-zinc-500 text-lg rounded-lg p-4">
                <div className="flex flex-col items-center justify-center w-full gap-4">
                  <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Quantity</label>
                  <div className="flex flex-row">
                    <button
                      className="text-blue-600 hover:text-zinc-400"
                      onClick={() => setQuantity(quantity - 1)}
                    >
                      <MdNavigateBefore size={60} />
                    </button>
                    <div className="flex w-full items-center justify-center">
                      <input
                        type="number"
                        // inputMode="decimal"
                        step="1"
                        min="-1"
                        className="text-5xl font-semibold text-center rounded-lg w-40 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                        // placeholder="Qty"
                        onChange={(e) => {
                          const value = e.target.value;
                          setQuantity(parseInt(value));
                        }}
                        value={quantity || ""}
                      />
                    </div>
                    <button
                      className="text-blue-600 hover:text-zinc-400"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <MdNavigateNext size={60} />
                    </button>
                  </div>

                  <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Discount</label>
                  <div className="grid grid-cols-3 w-full gap-1">
                    <button className={`p-5 rounded-md text-white text-2xl ${discount === noDiscount ? "bg-zinc-500" : "bg-blue-600"} hover:bg-zinc-400`} onClick={() => setDiscount(noDiscount)}>No Discount</button>
                    <button className={`p-5 rounded-md text-white text-2xl ${discount === fifteenPercentDiscount ? "bg-zinc-500" : "bg-blue-600"} hover:bg-zinc-400`} onClick={() => setDiscount(fifteenPercentDiscount)}>15% Discount</button>
                    <button className={`p-5 rounded-md text-white text-2xl ${discount === taxFreeDiscount ? "bg-zinc-500" : "bg-blue-600"} hover:bg-zinc-400`} onClick={() => setDiscount(taxFreeDiscount)}>Tax Free</button>
                  </div>

                  <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Type</label>
                  <div className="grid grid-cols-2 w-full gap-1">
                    <button className={`p-5 rounded-md text-white text-2xl ${type === "Wine" ? "bg-zinc-500" : "bg-blue-600"} hover:bg-zinc-400`} onClick={() => setType("Wine")}>Wine</button>
                    <button className={`p-5 rounded-md text-white text-2xl ${type === "Liquor" ? "bg-zinc-500" : "bg-blue-600"} hover:bg-zinc-400`} onClick={() => setType("Liquor")}>Liquor</button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="text-2xl font-semibold w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out"
                    onClick={handleSubmit}
                  >
                    Submit
                  </motion.button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SearchMenu;