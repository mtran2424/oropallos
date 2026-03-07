import { motion } from "framer-motion";
import NumPad from "./NumPad";
import { MdDelete } from "react-icons/md";
import { Item } from "../global.utils";
import { useState } from "react";

const Transaction = () => {
  const [cart, setCart] = useState<Item[]>([])

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
          <NumPad onConfirm={(item) => setCart([...cart, item])} />
          <table className="w-full my-5">
            <tbody>
              <tr>
                <td>
                  SUBTOTAL:
                </td>
                <td className="text-end">
                  31.98
                </td>
              </tr>
              <tr>
                <td>
                  TAX:
                </td>
                <td className="text-end">
                  0.70
                </td>
              </tr>
              <tr>
                <td>
                  DISCOUNT:
                </td>
                <td className="text-end">
                  2.00
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
                  31.98
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>);
}

export default Transaction;