import { AnimatePresence, motion } from "framer-motion";
import NumPad from "./NumPad";
import { MdDelete } from "react-icons/md";
import { Product, noDiscount, calculateDiscount, calculateSubtotal, calculateTotal, calculateTax, TransactionItem, getDiscount } from "../global.utils";
import { useRef, useState } from "react";
import SearchMenu from "./SearchMenu";
import QuickAddButton from "./QuickAddButton";
import { createTransaction } from "@/app/api/transactionapi";
import { useUser } from "@clerk/nextjs";

const Transactions = ({ products }: { products: Product[] }) => {
  const [cart, setCart] = useState<TransactionItem[]>([]);
  const [mode, setMode] = useState<string>("Register");
  const [amountTendered, setAmountTendered] = useState<string>("");
  const [cashout, setCashout] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");
  const [amountDue, setAmountDue] = useState<number>(0);
  // Cashout modal
  const modalRef = useRef<HTMLDivElement>(null);
  // Close the modal for cashout
  const closeEventModal = () => {
    setCashout(false);
  };

  //TODO: Create register logins and use username to identify which register is being used for each transaction
  const user = useUser();


  const handleQuickAdd = (name: string, type: string, price: number) => {
    const itemExists = cart.findIndex(item => item.name === name);

    if (itemExists != -1) {
      const temp = cart[itemExists];
      temp.quantity++;
      // const newCart = cart.splice(itemExists);
      setCart([...cart]);
    }
    else {
      const item = {
        type: type,
        name: name,
        quantity: 1,
        discount: noDiscount,
        unitPrice: price
      }
      setCart([...cart, item])
    }
  }

  //TODO: Add amount tendered and change system
  //TODO: Add void transaction option
  const handleSubmitTransaction = async () => {
    try {
      const transaction = {
        status: "Cashed",
        register: user.user?.username || "Unknown Register",
        transactionItems: cart,
        amountTendered: 0
      }
      const res = await createTransaction(transaction).then((res) => {
        setCart([]);
        return res;
      });

      if (!res.ok) throw new Error("Order failed");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
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
                        <td className="text-md text-center">{item.name}</td>
                        <td className="text-md text-center">{item.quantity}</td>
                        <td className="text-md text-center">{item.discount.name}</td>
                        <td className="text-md text-center">{(item.unitPrice / 100).toFixed(2)}</td>
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
              <QuickAddButton label="50mL Liquor - 0.99" type="Liquor" price={99} onClick={handleQuickAdd} />
              <QuickAddButton label="50mL Liquor - 1.49" type="Liquor" price={149} onClick={handleQuickAdd} />
              <QuickAddButton label="50mL Liquor - 1.99" type="Liquor" price={199} onClick={handleQuickAdd} />
              <QuickAddButton label="50mL Liquor - 2.99" type="Liquor" price={299} onClick={handleQuickAdd} />
              <QuickAddButton label="50mL Liquor - 4.99" type="Liquor" price={499} onClick={handleQuickAdd} />
              <QuickAddButton label="10 X 50mL Liquor - 9.99" type="Liquor" price={999} onClick={handleQuickAdd} />
              <QuickAddButton label="10 X 50mL Liquor - 12.99" type="Liquor" price={1299} onClick={handleQuickAdd} />
              <QuickAddButton label="10 X 50mL Liquor - 13.99" type="Liquor" price={1399} onClick={handleQuickAdd} />
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
                    {(calculateSubtotal(cart) / 100).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold text-lg">
                    TAX:
                  </td>
                  <td className="text-end text-lg">
                    {(calculateTax(cart) / 100).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold text-lg">
                    DISCOUNT:
                  </td>
                  <td className="text-end text-lg">
                    {(calculateDiscount(cart) / 100).toFixed(2)}
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
                    {(calculateTotal(cart) / 100).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* TODO: Need confirmation modal before submitting transaction to prevent accidental submits. Modal should show transaction summary and have confirm and cancel buttons.
              Also need to add additional notes in submission. AND amount tended and change calculation.
          */}
            <button
              className="flex h-15 my-10 w-full bg-blue-500 text-white font-semibold m-0.5 text-xl justify-center items-center px-10 col-span-4 hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
              onClick={() => setCashout(true)}
            >
              Cash Out
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {cashout && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: "0" }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3 }}
              ref={modalRef}
              className="relative bg-white p-6 rounded-2xl max-w-2xl w-full shadow-lg max-h-[70vh] overflow-y-auto border border-zinc-500"
            >
              {/* Modal Header */}
              <h3 className="text-xl text-zinc-900 mb-4 mt-2 text-left">Cashout</h3>
              {/* Close Modal Button */}
              <div className="absolute top-4 right-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="text-lg text-blue-500 hover:text-zinc-200"
                  onClick={closeEventModal}
                >
                  Close
                </motion.button>
              </div>

              <div className="mt-6 w-full border-t border-zinc-500 text-lg rounded-lg p-4">
                <div className="flex flex-col items-center justify-center w-full gap-4">

                  {/* Input bar */}
                  <motion.div
                    className="p-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
        overflow-hidden w-full h-25 mb-10"
                  >
                    {/* Current input dash display */}
                    <div className="grid grid-cols-2 text-sm w-full text-zinc-500">
                      <div className="text-start">
                        Amount Due: {(amountDue / 100).toFixed(2)}
                      </div>
                      {/* {type ? <div className="text-end">
            {type} */}
                      {/* </div> : <div />} */}
                    </div>
                    <input
                      type="number"
                      value={amountTendered}
                      onChange={(e) => setAmountTendered(e.target.value)}
                      className="p-2 text-2xl overflow-hidden w-full focus:outline-none"
                      style={{ whiteSpace: "nowrap" }}
                    />
                    {/* {discount && <div className="text-start text-sm text-zinc-500">
          {discount.name}
        </div>} */}
                  </motion.div>

                  <div className="grid grid-cols-2 w-full gap-1">
                    <button className={`p-5 rounded-md text-white text-2xl bg-blue-600 hover:bg-zinc-400`} onClick={() => { }}>Cash</button>
                    <button className={`p-5 rounded-md text-white text-2xl bg-blue-600 hover:bg-zinc-400`} onClick={() => { }}>Credit</button>
                  </div>

                  {/* Need to add num pad for amount input. Enter amount and punch credit or cash to reduce amount. When amount greater than total due, transaction is completed */}

                  {/* Additional Notes Section */}
                  <div className="flex flex-col w-full">
                    <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Notes</label>
                    <textarea
                      className="border border-zinc-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                      placeholder="Additional Notes"
                      onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="text-2xl font-semibold w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out"
                    onClick={handleSubmitTransaction}
                  >
                    Submit
                  </motion.button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Transactions;