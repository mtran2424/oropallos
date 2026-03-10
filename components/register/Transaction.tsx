import { motion } from "framer-motion";
import NumPad from "./NumPad";
import { MdDelete } from "react-icons/md";
import { getSubtotal, getTotal, Item, taxRate, Product } from "../global.utils";
import { useState } from "react";
import SearchMenu from "./SearchMenu";

const Transaction = ({ products }: { products: Product[] }) => {
  const [cart, setCart] = useState<Item[]>([]);
  const [mode, setMode] = useState<string>("Register");

  // Business math functions

  const calculateSubtotal = (cart: Item[]) => {
    var total = 0;
    cart.map(item => {
      total += getSubtotal(item);
    })

    return total;
  }

  const calculateDiscount = (cart: Item[]) => {
    var total = 0;
    cart.map(item => {
      total += item.price * item.qty * (1 - item.discount.multiplier);
    })

    return total;
  }

  const calculateTotal = (cart: Item[]) => {
    var total = 0;
    cart.map(item => {
      total += getTotal(item);
    })

    return total;
  }

  const calculateTax = (cart: Item[]) => {
    var total = 0;
    cart.map(item => {
      total += getSubtotal(item) * taxRate;
    })
    return total;
  }

  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <div className="flex flex-row w-screen items-start justify-center gap-5">
        <div className="flex flex-col w-1/2">
          {/* Shopping cart section */}
          <div className="flex flex-col w-full h-[50vh]">
            <h1
              className="text-xl sm:text-2xl font-serif font-semibold text-center sm:text-start text-zinc-900 mb-4">
              Shopping Cart
            </h1>
            <div className="flex overflow-auto">
            <table className="w-full divide-y divide-zinc-400">
              {/* Headers */}
              <thead className="sticky top-0 bg-white z-20">
                <tr>
                  <th>
                    Type
                  </th>
                  <th>
                    Item
                  </th>
                  <th>
                    Qty
                  </th>
                  <th>
                    Discount
                  </th>
                  <th>
                    Price
                  </th>
                  <th></th>
                </tr>
              </thead>

              {/* Shopping cart items */}
              <tbody className="divide-y divide-zinc-400">
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td className="text-md text-center">{item.type}</td>
                    <td className="text-md text-center">{item.item}</td>
                    <td className="text-md text-center">{item.qty}</td>
                    <td className="text-md text-center">{item.discount.name}</td>
                    <td className="text-md text-center">{item.price}</td>
                    <td className="text-md text-center">
                      <button onClick={() => {
                        const newCart = [...cart];
                        newCart.splice(index, 1);
                        setCart(newCart);
                      }}>
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

          </div>
          <div className="grid grid-cols-4 gap-1">
            <button className="bg-blue-900 text-white text-lg hover:bg-zinc-400 hover:text-zinc-600 transition-colors ease-linear p-4 rounded-sm">50mL Liquor - 0.99</button>
            <button className="bg-blue-900 text-white text-lg hover:bg-zinc-400 hover:text-zinc-600 transition-colors ease-linear p-4 rounded-sm">50mL Liquor - 1.49</button>
            <button className="bg-blue-900 text-white text-lg hover:bg-zinc-400 hover:text-zinc-600 transition-colors ease-linear p-4 rounded-sm">50mL Liquor - 1.99</button>
            <button className="bg-blue-900 text-white text-lg hover:bg-zinc-400 hover:text-zinc-600 transition-colors ease-linear p-4 rounded-sm">50mL Liquor - 2.99</button>
            <button className="bg-blue-900 text-white text-lg hover:bg-zinc-400 hover:text-zinc-600 transition-colors ease-linear p-4 rounded-sm">50mL Liquor - 4.99</button>
            <button className="bg-blue-900 text-white text-lg hover:bg-zinc-400 hover:text-zinc-600 transition-colors ease-linear p-4 rounded-sm">10 X 50mL Liquor - 9.99</button>
            <button className="bg-blue-900 text-white text-lg hover:bg-zinc-400 hover:text-zinc-600 transition-colors ease-linear p-4 rounded-sm">10 X 50mL Liquor - 12.99</button>
            <button className="bg-blue-900 text-white text-lg hover:bg-zinc-400 hover:text-zinc-600 transition-colors ease-linear p-4 rounded-sm">10 X 50mL Liquor - 13.99</button>
          </div>
        </div>

        {/* Register tools */}
        <div>
          {/* Tool selector */}
          <div className="grid grid-cols-2 p-2 text-lg">
            <button
              className="text-blue-500 hover:text-zinc-400"
              onClick={() => setMode("Search")}
            >
              Search
            </button>
            <button
              className="text-blue-500 hover:text-zinc-400"
              onClick={() => setMode("Register")}
            >
              Register
            </button>
          </div>
          {/* Tools */}
          {mode === "Register" && <NumPad onConfirm={(item) => setCart([...cart, item])} />}
          {mode === "Search" && <SearchMenu products={products} onConfirm={(item) => setCart([...cart, item])} />}

          {/* Cart summary */}
          <table className="w-full my-5">
            <tbody>
              <tr>
                <td className="font-semibold">
                  SUBTOTAL:
                </td>
                <td className="text-end">
                  {calculateSubtotal(cart).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="font-semibold">
                  TAX:
                </td>
                <td className="text-end">
                  {calculateTax(cart).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="font-semibold">
                  DISCOUNT:
                </td>
                <td className="text-end">
                  {calculateDiscount(cart).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          <table className="w-full">
            <tbody>
              <tr>
                <td className="font-semibold">
                  TOTAL
                </td>
                <td className="text-end">
                  {calculateTotal(cart).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>);
}

export default Transaction;