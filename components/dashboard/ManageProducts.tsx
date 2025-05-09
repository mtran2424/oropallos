import ProductsSpreadsheet from "./ProductsSpreadsheet";

const ManageProducts = () => {
  return (
    <div className="flex flex-col items-center h-full min-h-screen mt-10 px-2 gap-10 w-full font-serif">
      <h1 className="text-3xl text-center">
        Products
      </h1>

      <ProductsSpreadsheet />
      
    </div>);
}

export default ManageProducts;