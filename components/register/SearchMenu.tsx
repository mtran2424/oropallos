import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import SearchBar from "../ui/SearchBar";
import { Product, sanitize } from "../global.utils";

const SearchMenu = ({ products }: { products: Product[] }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState("newest-oldest");
  // Handlers for search and sort

  // Apply filters, seach terms, and sorting
  const sortedAndFilteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    console.log(term)

    const filtered = products.filter((product) =>
      [product.name, product.category, product.subcategory, product.type, product.size, product.upc]
        .filter(Boolean)
        .some((field) => sanitize(field ? field : "").includes(sanitize(term)))
    )

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
  }, [products, searchTerm, sortOption]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  return (
    <motion.div
      initial={{ y: "-100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="bg-zinc-100 border border-zinc-300 w-[35vw] px-5 py-10"
    >
      {/* Search Bar Component */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearchChange={handleSearchChange}
      />

      <div className="flex flex-row w-full whitespace-nowrap">

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
            <option value="newest-oldest">Date (Newest → Oldest)</option>
            <option value="oldest-newest">Date (Oldest → Newest)</option>
          </select>
        </div>

      </div>
      <div className="flex w-full max-h-[40vh] overflow-hidden rounded-md shadow-md border border-zinc-400 text-zinc-800">

        <div className="flex overflow-auto w-screen">
          <table className="w-full divide-y divide-zinc-400">
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
                  <strong>Qty</strong>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest whitespace-nowrap"
                >
                  <strong>Discount</strong>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest whitespace-nowrap"
                >
                  <strong>Price</strong>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest whitespace-nowrap"
                >
                  <strong>Action</strong>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-400">
              {sortedAndFilteredProducts.length > 0 ? (
                sortedAndFilteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="text-start p-2">{product.name + " " + product.size}</td>
                    <td className="text-center p-2">0</td>
                    <td className="text-center p-2">discount</td>
                    <td className="text-center p-2">{product.price}</td>
                    <td></td>
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
  );
}

export default SearchMenu;