import { motion } from "framer-motion";
import NumPad from "./NumPad";
import { MdDelete } from "react-icons/md";
import { getSubtotal, getTotal, Item, taxRate, Product } from "../global.utils";
import { useState } from "react";
import SearchMenu from "./SearchMenu";

const Transaction = ({ products }: { products: Product[] }) => {
  const [cart, setCart] = useState<Item[]>([]);
  const [mode, setMode] = useState<string>("Register");

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
          <h1
            className="text-xl sm:text-2xl font-serif font-semibold text-center sm:text-start text-zinc-900 mb-4">
            Shopping Cart
          </h1>
          <table>
            {/* Headers */}
            <thead>
              <tr>
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


            <tbody className="divide-y divide-zinc-400">
              {cart.map((item, index) => (
                <tr key={index}>
                  <td className="text-sm text-center">{item.item}</td>
                  <td className="text-sm text-center">{item.qty}</td>
                  <td className="text-sm text-center">{item.discount.name}</td>
                  <td className="text-sm text-center">{item.price}</td>
                  <td className="text-sm text-center">
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

        <div>
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
          {mode === "Register" && <NumPad onConfirm={(item) => setCart([...cart, item])} />}
          {mode === "Search" && <SearchMenu products={products} />}
          <table className="w-full my-5">
            <tbody>
              <tr>
                <td>
                  SUBTOTAL:
                </td>
                <td className="text-end">
                  {calculateSubtotal(cart).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td>
                  TAX:
                </td>
                <td className="text-end">
                  {calculateTax(cart).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td>
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
                <td>
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