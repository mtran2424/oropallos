import { useState, useEffect } from "react";
import { categoryOptions, Product, productTableColumns } from "@/components/global.utils";
import AddProduct from "@/components/utils/AddProduct";
import { deleteProduct, getProducts } from "@/app/api/productapi";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";
import EditProduct from "../utils/EditProduct";
import Image from "next/image";

// This component is responsible for crud operations on products
const ProductsSpreadsheet = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [refresh, setRefresh] = useState(false);

  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);

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

  // Sort and filter orders based on selected status filters and created date
  const sortedProducts = [...products]
    .filter((product) =>
      categoryFilters.length > 0 ? categoryFilters.includes(product.category) : true
    )

  // Function to toggle the status filter
  const toggleCategoryFilter = (status: string) => {
    setCategoryFilters((prev) =>
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

        <h1 className="text-2xl font-semibold text-zinc-900">Products</h1>


        {/* Filters for order statuses */}
        <div>
          <h2 className="text-lg font-bold text-zinc-900 mb-1">Filters</h2>
          <div className="flex gap-2 flex-wrap">
            {categoryOptions.map((category) => (
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
        </div>

        <AddProduct onAddProduct={handleAddProduct} />

        <div className="flex max-w-[95vw] max-h-[70vh] overflow-hidden rounded-md shadow-md border border-zinc-400 text-zinc-800">
          <div className="flex overflow-auto w-[100vw]">

            {/* Product Table Start */}
            <table className="w-full divide-y divide-zinc-400" style={{ minWidth: "1500px" }}>
              {/* TODO: Make up down filters for header fields */}
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
                {sortedProducts.length > 0 ? (
                  sortedProducts.map((product) => (
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
                          className="text-center text-red-500 hover:text-red-700"
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

      </div>
    </div>
  );
}

export default ProductsSpreadsheet;