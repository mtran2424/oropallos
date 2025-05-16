import { useState, useEffect, useMemo } from "react";
import { Product, ProductCategories, productTableColumns } from "@/components/global.utils";
import AddProduct from "@/components/utils/AddProduct";
import { deleteProduct, favoriteProduct, getProducts } from "@/app/api/productapi";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { MdDelete, MdFavorite } from "react-icons/md";
import EditProduct from "../utils/EditProduct";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import CopyButton from "../ui/CopyButton";
import { FaImage } from "react-icons/fa6";

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
  const [sortOption, setSortOption] = useState("newest-oldest");
  const [expandedImages, setExpandedImages] = useState<Record<string, boolean>>({});

  const toggleExpanded = (productId: string) => {
    setExpandedImages((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

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
      case "newest-oldest":
        sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateA.getTime() - dateB.getTime();
        });
        break;
      case "oldest-newest":
        sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
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

  const handleFavoriteToggle = async (id: string, product: Product) => {
    try {
      await favoriteProduct(id, !product.favorite)
        .then((res) => {
          if (res.status === 200) {
            toast.success('Favorite changed successfully');
            setRefresh(!refresh);
          }
        });
    } catch (error) {
      console.error('Error favoriting product:', error);
      toast.error('Failed to favorite product');
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
      case "category":
        return product.category;
      case "subcategory":
        return product.subcategory;
      case "type":
        return product.type;
      case "description":
        return (
          <div
            className="flex flex-col items-center justify-center space-y-2"
          >
            <textarea
              readOnly
              className="w-full h-[90px] border border-zinc-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={product.description}
            ></textarea>
            {product.description && <CopyButton text={product.description} />}
          </div>)
      case "imageUrl":
        if (product.id) {
          // Check if the image is expanded
          const isExpanded = expandedImages[product.id] ?? false;
          return product.imageUrl ? (
            <div className="flex flex-col items-center justify-center space-y-2">
              {/* Button to toggle image expansion */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => product.id && toggleExpanded(product.id)}
                className="text-2xl text-zinc-500 hover:text-blue-400 transition duration-200 ease-in-out"
              >
                {isExpanded ? "..." : <FaImage />}
              </motion.button>

              {/* Image */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="about"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={300}
                      height={300}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Image URL */}
              <a
                href={product.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 font-serif underline-animate break-all truncate max-w-full block"
              >
                {product.imageUrl}
              </a>
              <CopyButton text={product.imageUrl} />
            </div>
          ) : (
            product.imageUrl
          );
        }
      case "abv":
        return product.abv ? `${product.abv}%` : "N/A";
      case "size":
        return product.size;
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
          <AddProduct onAddProduct={handleAddProduct} products={products} />
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
              <option value="newest-oldest">Date (Oldest → Newest)</option>
              <option value="oldest-newest">Date (Newest → Oldest)</option>
            </select>
          </div>
        </div>


        <div className="flex max-w-[90vw] max-h-[60vh] overflow-hidden rounded-md shadow-md border border-zinc-400 text-zinc-800">
          <div className="flex overflow-auto w-[100vw]">

            {/* Product Table Start */}
            <table className="w-full divide-y divide-zinc-400" style={{ minWidth: "2000px" }}>
              {/* Table Headers */}
              <thead className="sticky top-0 bg-white z-20">
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
                    <strong>Favorite</strong>
                  </th>

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
                        {/* Favorite Product Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-center"
                          onClick={() => handleFavoriteToggle(product.id || "", product)}
                        >
                          {product.favorite ?
                            <MdFavorite size={40} className="text-red-500 hover:text-red-400 transition duration-200 ease-in-out" /> :
                            <MdFavorite size={40} className="text-zinc-400 hover:text-zinc-300 transition duration-200 ease-in-out" />}
                        </motion.button>
                      </td>

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
                          <MdDelete size={30} />
                        </motion.button>

                        {/* Edit Product Button */}
                        <EditProduct product={product} onEditProduct={handleEditProduct} products={products} />
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

        <div className="flex flex-col items-center justify-center w-full max-w-7xl font-serif">
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