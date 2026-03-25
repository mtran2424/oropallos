import { motion } from "framer-motion";
import NumPad from "./NumPad";
import { MdDelete } from "react-icons/md";
import { Item, Product, noDiscount, calculateDiscount, calculateSubtotal, calculateTotal, calculateTax } from "../global.utils";
import { useState } from "react";
import SearchMenu from "./SearchMenu";
import QuickAddButton from "./QuickAddButton";

const Transaction = ({ products }: { products: Product[] }) => {
  const [cart, setCart] = useState<Item[]>([]);
  const [mode, setMode] = useState<string>("Register");

  const handleQuickAdd = (name: string, type: string, price: number) => {
    const itemExists = cart.findIndex(item => item.item === name);

    if (itemExists != -1) {
      const temp = cart[itemExists];
      temp.qty++;
      // const newCart = cart.splice(itemExists);
      setCart([...cart]);
    }
    else {
      const item = {
        type: type,
        item: name,
        qty: 1,
        discount: noDiscount,
        price: price
      }
      setCart([...cart, item])
    }
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
            <QuickAddButton label="50mL Liquor - 0.99" type="Liquor" price={0.99} onClick={handleQuickAdd} />
            <QuickAddButton label="50mL Liquor - 1.49" type="Liquor" price={1.49} onClick={handleQuickAdd} />
            <QuickAddButton label="50mL Liquor - 1.99" type="Liquor" price={1.99} onClick={handleQuickAdd} />
            <QuickAddButton label="50mL Liquor - 2.99" type="Liquor" price={2.99} onClick={handleQuickAdd} />
            <QuickAddButton label="50mL Liquor - 4.99" type="Liquor" price={4.99} onClick={handleQuickAdd} />
            <QuickAddButton label="10 X 50mL Liquor - 9.99" type="Liquor" price={9.99} onClick={handleQuickAdd} />
            <QuickAddButton label="10 X 50mL Liquor - 12.99" type="Liquor" price={12.99} onClick={handleQuickAdd} />
            <QuickAddButton label="10 X 50mL Liquor - 13.99" type="Liquor" price={13.99} onClick={handleQuickAdd} />
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
                <td className="font-semibold text-lg">
                  SUBTOTAL:
                </td>
                <td className="text-end text-lg">
                  {calculateSubtotal(cart).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="font-semibold text-lg">
                  TAX:
                </td>
                <td className="text-end text-lg">
                  {calculateTax(cart).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="font-semibold text-lg">
                  DISCOUNT:
                </td>
                <td className="text-end text-lg">
                  {calculateDiscount(cart).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          <table className="w-full">
            <tbody>
              <tr>
                <td className="font-semibold text-lg">
                  TOTAL
                </td>
                <td className="text-end text-lg">
                  {calculateTotal(cart).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          <button
            className="flex h-15 my-10 w-full bg-blue-500 text-white font-semibold m-0.5 text-xl justify-center items-center px-10 col-span-4 hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
            onClick={() => {

            }}
          >
            Cash Out
          </button>
        </div>
      </div>
    </motion.div>);
}

export default Transaction;