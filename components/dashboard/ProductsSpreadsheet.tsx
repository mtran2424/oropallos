import { useState, useEffect, useMemo } from "react";
import { Product, ProductCategories, productTableColumns } from "@/components/global.utils";
import AddProduct from "@/components/utils/AddProduct";
import { deleteProduct, getProducts } from "@/app/api/productapi";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";
import EditProduct from "../utils/EditProduct";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { FaSearch } from "react-icons/fa";

const PRODUCTS_PER_PAGE = 15;

// This component is responsible for crud operations on products
const ProductsSpreadsheet = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [subcategoryFilters, setSubcategoryFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");

  // Apply filters, seach terms, and sorting
  const sortedAndFilteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const filtered = products.filter((product) =>
      [product.name, product.category, product.subcategory, product.type]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
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
      case "price-asc":
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-desc":
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
    }

    return sorted;
  }, [categoryFilters, products, searchTerm, sortOption, subcategoryFilters]);

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


  // Refresh product list when a new product is added
  const handleAddProduct = (product: Product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
    setRefresh(!refresh);
  }

  // Refresh product list when a product is edited
  const handleEditProduct = () => {
    setRefresh(!refresh);
  }

  // Send a delete request to the server to remove the product and refresh the list
  const handleDeleteProduct = async (id: string) => {
    try {
      // Call the delete function from productapi
      await deleteProduct(id)
        .then((res) => {
          if (res.status === 200) {
            toast.success('Product deleted successfully');
            setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
            setRefresh(!refresh);
          }
          else {
            console.error('Failed to delete product');
          }
        });

    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

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
      case "category":
        return product.category;
      case "subcategory":
        return product.subcategory;
      case "type":
        return product.type;
      case "description":
        return <textarea
          readOnly
          className="w-full border border-zinc-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={product.description}
        ></textarea>
      case "imageUrl":
        return (
          product.imageUrl ?
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={400}
              height={400}
            /> :
            product.imageUrl
        );
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

  // Fetch products from the server when the component mounts or refreshes
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
    <div>
      <div className="flex flex-col justify-between items-start mb-3 space-y-4 px-2">

        {/* Header */}
        <h1 className="text-2xl font-semibold text-zinc-900">Products</h1>
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
                  ? "text-zinc-200 bg-blue-500 border-blue-200"
                  : "text-zinc-900 border-blue-200"
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
                          ? "text-zinc-200 bg-blue-500 border-blue-200"
                          : "text-zinc-900 border-blue-200"
                        }`}
                    >
                      {subcategory.name}
                    </motion.button>
                  ));
              });
            })()}
          </div>

        </div>


        {/* Search Bar */}
        <div className="flex flex-center items-center w-full max-w-7xl ">
          {isOpen ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => setIsOpen(false)}
              className="text-gray-600 p-2 focus:outline-none"
            >
              <IoMdClose size={20} />
            </motion.button>
          ) : (
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
        </div>

        <div className="flex flex-row w-full whitespace-nowrap">
          <AddProduct onAddProduct={handleAddProduct} />
          {/* Sort Dropdown */}
          <div className="flex justify-end w-full">
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low → High)</option>
              <option value="price-desc">Price (High → Low)</option>
            </select>
          </div>
        </div>


        <div className="flex max-w-[95vw] max-h-[60vh] overflow-hidden rounded-md shadow-md border border-zinc-400 text-zinc-800">
          <div className="flex overflow-auto w-[100vw]">

            {/* Product Table Start */}
            <table className="w-full divide-y divide-zinc-400" style={{ minWidth: "1500px" }}>
              {/* Table Headers */}
              <thead className="sticky top-0 bg-white">
                <tr>
                  {productTableColumns.map((column) => (
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
                    <strong>Actions</strong>
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-zinc-400">
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-zinc-200 transition duration-200">
                      {productTableColumns.map((column) => (
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
                        {/* Remove Product Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-center text-red-500 hover:text-red-400"
                          onClick={() => handleDeleteProduct(product.id || "")}
                        >
                          <MdDelete size={25} />
                        </motion.button>

                        {/* Edit Product Button */}
                        <EditProduct product={product} onEditProduct={handleEditProduct} />
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

        <div className="flex flex-col items-center justify-center w-full max-w-7xl">
          {/* Showing Count */}
          <p className="text-md font-semibold mb-2 text-zinc-500">
            Showing {endIdx} of {sortedAndFilteredProducts.length} products
          </p>

          {/* Pagination */}
          <div className="flex items-center space-x-2 mb-8">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`px-4 py-2 rounded ${currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
            >
              Prev
            </button>
            <span className="text-lg font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className={`px-4 py-2 rounded ${currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
            >
              Next
            </button>
          </div>

        </div>


      </div>
    </div>
  );
}

export default ProductsSpreadsheet;