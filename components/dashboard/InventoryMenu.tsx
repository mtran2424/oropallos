import { useState, useMemo, useRef, useEffect, useDeferredValue } from "react";
import { deleteProduct, hideProduct } from "@/app/api/productapi";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { inventoryTableColumns, Product, ProductCategories, productTableColumns, sanitize } from "@/components/global.utils";
import { getProducts } from "@/app/api/adminapi";
import EditUnitPrice from "@/components/utils/crud-products/EditUnitPrice";
import AddUPC from "@/components/utils/crud-products/AddUPC";
import AddUnit from "@/components/utils/crud-products/AddUnit";
import SearchBar from "@/components/ui/SearchBar";
import Pagination from "@/components/ui/Pagination";
import Modal from "@/components/ui/Modal";

const PRODUCTS_PER_PAGE = 25;

// This component is responsible for crud operations on products
const InventoryMenu = ({ 
  products,
  onChange
 }: { 
  products: Product[];
  onChange: () => void;
 }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [subcategoryFilters, setSubcategoryFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearch = useDeferredValue(searchTerm);
  const [sortOption, setSortOption] = useState("newest-oldest");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [targetProductId, setTargetProductId] = useState<string | null>(null);
  const productsRef = useRef<HTMLTableElement | null>(null);
  const sortedAndFilteredProducts = useMemo(() => {
    const term = deferredSearch.toLowerCase();

    const filtered = products.filter((product) =>
      [product.name, product.category, product.subcategory, product.type, product.size, product.upc]
        .filter((field): field is string => Boolean(field))
        .some((field) => sanitize(field).includes(sanitize(term)))
    )
      .filter((product) =>
        categoryFilters.length > 0 ? categoryFilters.includes(product.category) : true
      )
      .filter((product) =>
        subcategoryFilters.length > 0 ? subcategoryFilters.includes(product.subcategory) : true
      );

    // Choose sorting method
    const sorted = [...filtered];

    switch (sortOption) {
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "size-asc":
        sorted.sort((a, b) => (a.size || "").localeCompare(b.size || ""));
        break;
      case "size-desc":
        sorted.sort((a, b) => (b.size || "").localeCompare(a.size || ""));
        break;
      case "price-asc":
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-desc":
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "unit-price-asc":
        sorted.sort((a, b) => (a.unitPrice || 0) - (b.unitPrice || 0));
        break;
      case "unit-price-desc":
        sorted.sort((a, b) => (b.unitPrice || 0) - (a.unitPrice || 0));
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
  }, [categoryFilters, products, deferredSearch, sortOption, subcategoryFilters]);

  //Delete confirmation modal
  const modalRef = useRef<HTMLDivElement>(null);

  // Close the modal
  const closeEventModal = () => {
    setDeleteConfirm(false);
  };

  const openEventModal = (product: Product) => {
    setTargetProductId(product.id || null);
    setDeleteConfirm(true);
  }

  // Apply filters, seach terms, and sorting

  // Handlers for search and sort
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  // For pagination
  const totalPages = Math.ceil(sortedAndFilteredProducts.length / PRODUCTS_PER_PAGE);
  const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIdx = Math.min(startIdx + PRODUCTS_PER_PAGE, sortedAndFilteredProducts.length);
  const currentProducts = sortedAndFilteredProducts.slice(startIdx, endIdx);

  // Refresh product list when a product is edited
  const handleEditProduct = () => {
    onChange();
  }

  // Send a delete request to the server to remove the product and refresh the list
  const handleDeleteProduct = async (id: string) => {
    try {

      setLoading(true);
      // Call the delete function from productapi
      await deleteProduct(id)
        .then((res) => {
          if (res.status === 200) {
            toast.success('Product deleted successfully');
            onChange();
            setTargetProductId(null);
            setDeleteConfirm(false);
          }
          else {
            console.error('Failed to delete product');
            setTargetProductId(null);
            setDeleteConfirm(false);
          }
          setLoading(false);
        });

    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
      setLoading(false);
      setTargetProductId(null);
      setDeleteConfirm(false);
    }
  };

  // Function to toggle hidden status of a product
  const handleHiddenToggle = async (id: string, product: Product) => {
    try {
      await hideProduct(id, !product.hidden)
        .then((res) => {
          if (res.status === 200) {
            toast.success('Hidden status changed successfully');
            onChange();
          }
        });
    } catch (error) {
      console.error('Error toggling hidden status:', error);
      toast.error('Failed to toggle hidden status');
    }
  }

  // Function to render each cell based on the column type
  const renderCell = (product: Product, column: keyof Product) => {
    switch (column) {
      case "id":
        return product.id;
      case "name":
        return product.name;
      case "price":
        return product.price.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      case "size":
        return product.size;
      case "upc":
        return product.upc;
      case "itemType":
        return product.itemType;
      case "unitPrice":
        return product.unitPrice ? (product.unitPrice / 100).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }) : "N/A";
      case "unitCount":
        return product.unitCount || "N/A";
      case "unitsPerCase":
        return product.unitsPerCase || "N/A";
      default:
        return null;
    }
  };

  // Function to toggle the status filter
  const toggleCategoryFilter = (status: string) => {
    setCategoryFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Function to toggle the status filter
  const toggleSubcategoryFilter = (status: string) => {
    setSubcategoryFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

    // Scroll to products grid on pagination/search/sort change
  useEffect(() => {
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentPage, searchTerm, sortOption]);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <div className="flex flex-col w-full items-center justify-start">
        <div className="flex flex-col mb-3 space-y-4">

          {/* Header */}
          <h1 className="text-2xl font-semibold text-zinc-900">Inventory</h1>

          {/* Filters for categories */}
          <div>
            <h2 className="text-lg font-bold text-zinc-900 mb-1">Filters</h2>
            <div className="flex gap-2 flex-wrap">
              {ProductCategories.map((category) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  key={category.name}
                  onClick={() => toggleCategoryFilter(category.value)}
                  className={`text-xs px-2 py-1 rounded border font-semibold ${categoryFilters.includes(category.value)
                    ? "text-zinc-200 bg-red-900"
                    : "text-red-900 border-red-900"
                    }`}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>

            {/* Subcategory Filters */}
            <div className="flex gap-2 flex-wrap mt-2">
              {(() => {
                const rendered = new Set();

                return categoryFilters.flatMap((category) => {
                  const selectedCategory = ProductCategories.find((cat) => cat.value === category);
                  if (!selectedCategory) return [];

                  return selectedCategory.subcategories
                    .filter((subcategory) => {
                      if (rendered.has(subcategory.value)) return false;
                      rendered.add(subcategory.value);
                      return true;
                    })
                    .map((subcategory) => (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        key={subcategory.value}
                        onClick={() => toggleSubcategoryFilter(subcategory.value)}
                        className={`text-xs px-2 py-1 rounded border font-semibold ${subcategoryFilters.includes(subcategory.value)
                          ? "text-zinc-200 bg-red-900"
                          : "text-red-900 border-red-900"
                          }`}
                      >
                        {subcategory.name}
                      </motion.button>
                    ));
                });
              })()}
            </div>
          </div>

          <div className="flex flex-row w-full whitespace-nowrap">
            {/* Search Bar Component */}
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleSearchChange={handleSearchChange}
            />

            {/* Sort Dropdown */}
            <div className="flex justify-end w-full">
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="size-asc">Size (Small → Large)</option>
                <option value="size-desc">Size (Large → Small)</option>
                <option value="price-asc">Price (Low → High)</option>
                <option value="price-desc">Price (High → Low)</option>
                <option value="unit-price-asc">Unit Price (Low → High)</option>
                <option value="unit-price-desc">Unit Price (High → Low)</option>
                <option value="newest-oldest">Date (Newest → Oldest)</option>
                <option value="oldest-newest">Date (Oldest → Newest)</option>
              </select>
            </div>
          </div>

          {/* Data Table */}
          <div className="flex max-w-[95vw] max-h-[65vh] overflow-hidden rounded-md shadow-md border border-zinc-400 text-zinc-800">

            {/* Spreadsheet */}
            <div className="flex overflow-auto w-screen">

              {/* Product Table Start */}
              <table className="w-full divide-y divide-zinc-400" style={{ minWidth: "1000px" }} ref={productsRef}>
                {/* Table Headers */}
                <thead className="sticky top-0 bg-white z-20">
                  <tr>
                    {inventoryTableColumns.map((column) => (
                      <th
                        key={column.field}
                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest whitespace-nowrap"
                        style={{ width: column.width }}
                      >
                        <strong>{column.label}</strong>
                      </th>
                    ))}

                    <th
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest whitespace-nowrap"
                      style={{ width: "200px" }}
                    >
                      <strong>Hidden</strong>
                    </th>

                    <th
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest whitespace-nowrap"
                      style={{ width: "300px" }}
                    >
                      <strong>Actions</strong>
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-zinc-400">
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-zinc-200 transition duration-200">
                        {inventoryTableColumns.map((column) => (
                          // Render each cell based on the column field
                          <td
                            key={column.field}
                            className="px-4 py-3 text-sm align-center"
                            style={{
                              width: column.width,
                              maxWidth: column.width,
                              whiteSpace: "pre-line",
                            }}
                          >
                            {renderCell(product, column.field as keyof Product)}
                          </td>
                        ))}

                        <td
                          className="px-4 py-3 text-sm align-center"
                          style={{
                            width: "200px",
                            maxWidth: "200px",
                            whiteSpace: "pre-line",
                          }}
                        >
                          {/* Favorite Product Button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-center"
                            onClick={() => handleHiddenToggle(product.id || "", product)}
                          >
                            {product.hidden ?
                              <FaEye size={40} className="text-blue-500 hover:text-red-400 transition duration-200 ease-in-out" /> :
                              <FaEyeSlash size={40} className="text-zinc-400 hover:text-zinc-300 transition duration-200 ease-in-out" />}
                          </motion.button>
                        </td>

                        {/* Actions Column */}
                        <td
                          className="px-4 py-3 text-sm align-center"
                          style={{
                            width: "300px",
                            maxWidth: "300px",
                            whiteSpace: "pre-line",
                          }}
                        >
                          <div className="flex flex-row gap-4">
                            {/* Remove Product Button */}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-center text-red-500 hover:text-red-400"
                              onClick={() => { openEventModal(product) }}
                            >
                              <MdDelete size={35} />
                            </motion.button>

                            <AddUnit onAddUnit={handleEditProduct} product={product} />

                            <EditUnitPrice onEditPrice={handleEditProduct} product={product} />

                            <AddUPC onAddUpc={handleEditProduct} product={product} />
                          </div>
                        </td>

                      </tr>
                    ))
                  ) : (
                    // No products available message
                    <tr>
                      <td colSpan={productTableColumns.length} className="text-center py-4 text-zinc-900">
                        No products match selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Instructions for scrolling and edit mode */}
          <div className="mt-2 text-xs text-zinc-900 italic">
            <span>Scroll horizontally to view all columns →</span>
          </div>

        </div>

        {/* Pagination Section */}
        <div className="flex flex-col items-center justify-center w-full font-serif">
          {/* Showing Count */}
          <p className="text-md font-semibold mb-2 text-zinc-500">
            Showing {endIdx} of {sortedAndFilteredProducts.length} products
          </p>

          {/* Pagination */}
          <Pagination
            prevClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            nextClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            currentPage={currentPage}
            totalPages={totalPages}
          />

        </div>
      </div>

      {/* Confirmation modal */}
      <Modal open={deleteConfirm} title="Confirm Deletion" onClose={closeEventModal} ref={modalRef} height="max-h-[40vh]" width="max-w-2xl">
        <div className="flex flex-col gap-4 pb-4">
          <label className="text-xl text-zinc-700 w-full text-left p-5">
            This action cannot be undone. This will permanently delete the product from the database.
          </label>
        </div>

        <div className="flex flex-col items-center gap-2">
          {/* Loading Spinner */}
          {loading ? (
            <div className="flex justify-center items-center py-2">
              <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="text-2xl font-semibold w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out"
              onClick={() => {
                handleDeleteProduct(targetProductId || "");
              }}
            >
              Confirm
            </motion.button>
          )}
        </div>
      </Modal>
    </>
  );
}

export default InventoryMenu;