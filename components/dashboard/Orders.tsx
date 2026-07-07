import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Image from "next/image"
import { CiImageOff } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { getProducts, updateInventory } from "@/app/api/adminapi";
import { Product, sanitize } from "@/components/global.utils";
import ProductTag from "@/components/ui/ProductTag";
import Modal from "@/components/ui/Modal";

interface OrderItem {
  product: Product;
  quantity: number;
  unitType: string
}

const Orders = ({ initialProducts }: { initialProducts: Product[] }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [refresh, setRefresh] = useState(false);
  const [addItem, setAddItem] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product>();
  const [currentQuantity, setCurrentQuantity] = useState<number>(1);
  const [currentUnitType, setCurrentUnitType] = useState<string>("Unit");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const deferredSearch = useDeferredValue(searchTerm);
  const [sortOption, setSortOption] = useState("newest-oldest");
  const [cart, setCart] = useState<OrderItem[]>([]);

  // Close the modal for adding a product
  const closeEventModal = () => {
    setAddItem(false);
  };

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

  const handleAddItem = () => {
    // Type of item and product required to be submitted
    if (currentQuantity && currentUnitType && currentProduct) {
      const itemExists = cart.findIndex(item => item.product.id === currentProduct.id && item.unitType === currentUnitType);
      const item = {
        product: currentProduct,
        unitType: currentUnitType,
        quantity: currentQuantity,
      }

      if (itemExists != -1) {
        const temp = cart[itemExists];
        temp.quantity += currentQuantity;
        setCart((prev) => [...prev]);
      }
      else {
        setCart((prev) => [...prev, item]);
      }

      // Reset states upon confirm
      setCurrentProduct(undefined);
      setCurrentQuantity(1);
      setCurrentUnitType("Unit");
      setSearchTerm("");
      setAddItem(false);
    }
  };

  const handleSubmit = () => {
    setLoading(true);

    updateInventory({orderItems: cart})
      .then(() => {
        toast.success(`Inventory successfully updated.`);

        setCart([]);
        setCurrentProduct(undefined);
        setCurrentQuantity(1);
        setCurrentUnitType("Unit");
        setSearchTerm("");
      })
      .finally(() => {
        setLoading(false);
        setRefresh(prev => !prev)
      })
  }

  // Fetch products on component mount and when refresh state changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };

    fetchProducts();
  }, [refresh]);

  return (
    <>
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="flex flex-col w-full items-center justify-start"
      >
        <h1
          className="w-[95vw] text-xl sm:text-2xl font-serif font-semibold text-center sm:text-start text-zinc-900 mb-4">
          Orders
        </h1>
        <div className="flex flex-col lg:flex-row w-full lg:w-[95vw] items-start justify-center space-y-5 lg:space-x-5 pt-5">
          {/* Shopping cart section */}
          <div className="flex flex-col w-full h-[60vh]">
            <div className="flex overflow-auto">
              <table className="w-full divide-y divide-zinc-400">
                {/* Headers */}
                <thead className="sticky top-0 bg-white z-20 text-lg">
                  <tr>
                    <th>
                      Item
                    </th>
                    <th>
                      Qty
                    </th>
                    <th>
                      Unit Type
                    </th>
                    <th>
                      Total Units
                    </th>
                    <th></th>
                  </tr>
                </thead>

                {/* Shopping cart items */}
                <tbody className="divide-y divide-zinc-400">
                  {cart.map((item, index) => (
                    <tr key={index}>
                      <td className="text-2xl text-left p-2"><ProductTag product={item.product} onDelete={() => {
                        const newCart = [...cart];
                        newCart.splice(index, 1);
                        setCart(newCart);
                      }} /></td>
                      <td className="text-2xl text-center p-1">{item.quantity}</td>
                      <td className="text-2xl text-center p-1">{item.unitType}</td>
                      <td className="text-2xl text-center p-1">{item.unitType === "Case" ? (item.product ? (item.product.unitsPerCase ?? 0) * item.quantity : 0) : item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Search Product Component */}
          <div className="flex flex-col w-full lg:w-[30vw] px-5 space-y-5">
            <motion.div
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="bg-zinc-100 border border-zinc-300 w-full px-5 py-5"
            >
              {/* Search Bar Component */}
              <div className="flex flex-center items-center w-full max-w-7xl ">
                {searchTerm !== "" ? (
                  <motion.div
                    key={"close"}
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

              {/* Sort Dropdown */}
              <div className="flex flex-row w-full whitespace-nowrap">
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
              <div className="flex w-full max-h-[45vh] overflow-hidden rounded-md shadow-md border border-zinc-400 text-zinc-800">

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
            {loading ? (
              // Loading spinner
              <div className="flex justify-center items-center py-2">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <button
                className="h-20 text-2xl font-semibold w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-zinc-400 transition duration-200 ease-in-out"
                disabled={cart.length === 0}
                onClick={handleSubmit}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Add Item Modal */}
      <Modal open={addItem} title="Add Item" height="max-h-[60vh]" width="max-w-2xl" onClose={closeEventModal} ref={modalRef}>
        <div className="mt-6 w-full border-t border-zinc-500 text-lg rounded-lg p-4">
          <div className="flex flex-col items-center justify-center w-full gap-4">
            <div className="flex flex-col w-full space-y-2">
              <div className="flex flex-col w-1/4">
                {/* Qty Field */}
                <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Quantity</label>
                <input
                  type="number"
                  step="1"
                  min={1}
                  className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                  placeholder="Quantity"
                  onChange={(e) => {
                    const value = e.target.value;
                    setCurrentQuantity(value === "" ? 0 : parseInt(value) ?? 0);
                  }}
                  value={currentQuantity || ""}
                />
              </div>
              <div className="flex flex-col w-full">
                <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Unit Type</label>
                <select
                  id="unitType"
                  className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                  onChange={(e) => {
                    setCurrentUnitType(e.target.value);
                  }}
                  value={currentUnitType}
                >
                  <option value="Unit">Unit</option>
                  {currentProduct?.unitsPerCase && <option value="Case">Case</option>}
                </select>
              </div>

            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              className="h-20 text-2xl font-semibold w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-zinc-400 transition duration-200 ease-in-out"
              onClick={handleAddItem}
            >
              Submit
            </motion.button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Orders;