import { AnimatePresence, motion } from "framer-motion";
import NumPad from "./NumPad";
import { MdDelete } from "react-icons/md";
import { Product, noDiscount, calculateDiscount, calculateSubtotal, calculateTotal, calculateTax, TransactionItem, getDiscount, formatTime, formatDate } from "../global.utils";
import { useRef, useState } from "react";
import SearchMenu from "./SearchMenu";
import QuickAddButton from "./QuickAddButton";
import { createTransaction } from "@/app/api/transactionapi";
import { useUser } from "@clerk/nextjs";
import { IoBackspaceOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import TextButton from "../ui/TextButton";
import { useReactToPrint } from "react-to-print";

const Transactions = ({ products }: { products: Product[] }) => {
  const date = new Date();
  const [cart, setCart] = useState<TransactionItem[]>([]);
  const [mode, setMode] = useState<string>("Register");
  const [input, setInput] = useState<string>("");
  const [cashout, setCashout] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");
  const [amountDue, setAmountDue] = useState<number>(0);
  const [cash, setCash] = useState<number>(0);
  const [credit, setCredit] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);

  // Cashout modal
  const modalRef = useRef<HTMLDivElement>(null);
  // Close the modal for cashout
  const closeEventModal = () => {
    setCashout(false);
    setInput("");
    setCash(0);
    setCredit(0);
    setNote("");
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
        discount: noDiscount.value,
        unitPrice: price
      }
      setCart([...cart, item])
    }
  }

  const handleSubmitTransaction = async () => {
    try {
      setLoading(true);

      const transaction = {
        status: "Cashed",
        register: user.user?.username || "Unknown Register",
        transactionItems: cart,
        cash: ((cash + credit) > amountDue) ? cash : (cash + (amountDue - (cash + credit))),
        credit: credit,
        notes: note
      }
      const res = await createTransaction(transaction).then((res) => {
        setCart([]);
        setCash(0);
        setCredit(0);
        setNote("");
        setInput("");
        setCashout(false);
        return res;
      });

      if (!res.ok) {
        setLoading(false);
        toast.error("Transaction failed");
        throw new Error("Transaction failed");
      }
      else {
        setLoading(false);
        toast.success("Transaction successful")
      }
    } catch (err) {
      console.error(err);
    }
  }


  // Printing
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Transaction Receipt",
    pageStyle: `
    @page {
      size: 80mm auto;
      margin: 4mm;
    }

    @media print {
      html, body {
        width: 80mm;
        margin: 0;
        padding: 0;
      }

      .receipt {
        width: 72mm;
        font-family: monospace;
        font-size: 12px;
      }
    }
  `,
  })

  const receipt = (
    <div ref={componentRef} className="flex flex-col w-full items-center p-5">
      <h1 className="text-2xl font-bold mb-4">OROPALLO'S</h1>
      <h1 className="text-2xl font-bold mb-4 text-center">WINE & LIQUOR</h1>
      <h1 className="text-xl mb-4">376 DIX AVENUE</h1>
      <h1 className="text-xl mb-4">QUEENSBURY, NY 12804</h1>
      <h1 className="text-2xl font-bold mb-4">518-798-3988</h1>
      <table className="w-full max-w-3/4 border-separate border-spacing-y-4 text-2xl">
        <tbody>
          <tr>
            <td className="text-2xl text-start">
              {formatDate(date, "mm/dd/yyyy")}
            </td>
            <td className="text-2xl text-end">
              {formatTime(date)}
            </td>
          </tr>
        </tbody>
      </table>

      <table className="w-full max-w-3/4 border-separate border-spacing-y-4">
        <tbody>
          {cart.map((item, index) => (
            <tr key={index} className="w-full">
              <td className="text-2xl text-start">
                <div
                  className="flex flex-col items-start justify-center">
                  <div className="font-semibold">
                    {item.type.toUpperCase()}
                  </div>
                  <div>
                    {item.name.toUpperCase()}
                  </div>
                </div>
              </td>
              <td className="text-2xl text-start">
                <div className="flex flex-col items-end justify-center">
                  <div>
                    {item.quantity > 1 ? `${item.quantity} @ ` : ''}${(item.unitPrice / 100).toFixed(2)}
                  </div>
                  {item.discount !== "No_Discount" && (
                    <div>
                      {getDiscount(item.discount).name.toUpperCase()}
                    </div>
                  )}
                  {item.discount !== "No_Discount" && (
                    <div>
                      -{(((item.unitPrice * item.quantity) - (getDiscount(item.discount).multiplier * item.unitPrice * item.quantity)) / 100).toFixed(2)}
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
          <tr>
            <td className="text-2xl text-start font-semibold">
              TOTAL
            </td>
            <td className="text-2xl text-end">
              ${(calculateSubtotal(cart) / 100).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )

  return (
    <>
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <div className="flex flex-row w-full items-start justify-center gap-5 pt-5">
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
                  <thead className="sticky top-0 bg-white z-20 text-lg">
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
                        <td className="text-2xl text-center">{item.type}</td>
                        <td className="text-2xl text-center">{item.name}</td>
                        <td className="text-2xl text-center">{item.quantity}</td>
                        <td className="text-2xl text-center">{getDiscount(item.discount).name}</td>
                        <td className="text-2xl text-center">{(item.unitPrice / 100).toFixed(2)}</td>
                        <td className="text-2xl text-center">
                          <button onClick={() => {
                            const newCart = [...cart];
                            newCart.splice(index, 1);
                            setCart(newCart);
                          }}>
                            <MdDelete size={30} className="text-red-500 hover:text-red-700" />
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
            <div className="grid grid-cols-2 p-2">
              <TextButton onClick={() => setMode("Search")}>
                Search
              </TextButton>
              <TextButton onClick={() => setMode("Register")}>
                Register
              </TextButton>
            </div>
            {/* Tools */}
            {mode === "Register" && <NumPad onConfirm={(item) => setCart([...cart, item])} />}
            {mode === "Search" && <SearchMenu products={products} onConfirm={(item) => setCart([...cart, item])} />}

            {/* Cart summary */}
            <table className="w-full my-5">
              <tbody>
                <tr>
                  <td className="font-semibold text-2xl">
                    SUBTOTAL:
                  </td>
                  <td className="text-end text-2xl">
                    {(calculateSubtotal(cart) / 100).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold text-2xl">
                    TAX:
                  </td>
                  <td className="text-end text-2xl">
                    {(calculateTax(cart) / 100).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold text-2xl">
                    DISCOUNT:
                  </td>
                  <td className="text-end text-2xl">
                    {(calculateDiscount(cart) / 100).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="w-full">
              <tbody>
                <tr>
                  <td className="font-semibold text-2xl">
                    TOTAL
                  </td>
                  <td className="text-end text-2xl">
                    {(calculateTotal(cart) / 100).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* TODO: Create success modal and option to print receipt
          */}
            <button
              className="flex h-20 my-5 w-full bg-blue-600 text-white font-semibold m-0.5 text-2xl justify-center items-center px-10 col-span-4 
                        hover:bg-zinc-400 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
              onClick={() => {
                if (cart.length !== 0) {
                  setAmountDue(calculateTotal(cart));
                  setCashout(true);
                }
              }}
            >
              Cash Out
            </button>
          </div>

          {/* <TextButton onClick={handlePrint}>Print Receipt</TextButton> 
              TODO: Finish Creating Receipt
          */}

          <div
            className="hidden"
          >
            <div
              className="print-area"
              ref={componentRef}
            >
              {receipt}
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {cashout && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-200">
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: "0" }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3 }}
              ref={modalRef}
              className="relative bg-white p-6 rounded-2xl max-w-3xl w-full shadow-lg max-h-[95vh] overflow-y-auto border border-zinc-500"
            >
              {/* Modal Header */}
              <h3 className="text-xl text-zinc-900 mb-4 mt-2 text-left">Cashout</h3>
              {/* Close Modal Button */}
              <div className="absolute top-4 right-4">
                <TextButton onClick={closeEventModal}>
                  Close
                </TextButton>
              </div>

              <div className="mt-6 w-full border-t border-zinc-500 text-lg rounded-lg p-4">
                <div className="flex flex-col items-center justify-center w-full gap-2">

                  {/* Input bar */}
                  <motion.div
                    className="p-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                                overflow-hidden w-full h-30 mb-2"
                  >
                    {/* Current input dash display */}
                    <div className="grid grid-cols-2 text-lg w-full text-zinc-500">
                      <div className="text-start">
                        Total: ${(amountDue / 100).toFixed(2)}
                      </div>
                      <div className="text-end">
                        Amount Due: ${((amountDue + cash + credit) / 100).toFixed(2)}
                      </div>
                    </div>

                    {/* Input box for amount entry. When cash or credit buttons are pressed, amount is added to respective payment type and input 
                    is cleared. If amount entered is greater than amount due, change is calculated and displayed in success modal after transaction submission. */}
                    <input
                      type="number"
                      value={input}
                      min={0}
                      onChange={(e) => setInput(e.target.value)}
                      className="p-2 text-3xl overflow-hidden w-full focus:outline-none"
                      style={{ whiteSpace: "nowrap" }}
                    />

                    {/* Cash and Credit display under input box for reference when entering amounts. */}
                    <div className="grid grid-cols-2 text-lg w-full text-zinc-500">
                      <div className="text-start">
                        Cash: ${(cash / 100).toFixed(2)}
                      </div>
                      <div className="text-end">
                        Credit: ${(credit / 100).toFixed(2)}
                      </div>
                    </div>
                  </motion.div>


                  {/* Need to add num pad for amount input. Enter amount and punch credit or cash to reduce amount. When amount greater than total due, transaction is completed */}
                  <div className="grid grid-cols-3 gap-x-1 gap-y-1 h-full w-full">

                    {/* First Row */}

                    {/* Clear inputs */}
                    <button
                      className="flex p-3 h-full w-full bg-zinc-600 text-white font-semibold m-0.5 text-xl justify-center items-center
                                hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                      onClick={() => {
                        setInput("");
                        setCash(0);
                        setCredit(0);
                      }}
                    >

                      Clear
                    </button>

                    <button></button>

                    {/* Back space button */}
                    <button
                      className="flex p-3 h-full w-full bg-zinc-600 text-white font-semibold m-0.5 text-2xl justify-center items-center
                                hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                      onClick={() => {
                        setInput(prev => prev.slice(0, -1));
                      }}
                    >
                      <IoBackspaceOutline size={40} />
                    </button>

                    {/* Second Row */}
                    <button
                      className="flex p-3 h-full w-full bg-zinc-600 text-white font-semibold m-0.5 text-2xl justify-center items-center
                                hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                      onClick={() => setInput(`${input}7`)}
                    >
                      7
                    </button>

                    <button
                      className="flex p-3 h-full w-full bg-zinc-600 text-white font-semibold m-0.5 text-2xl justify-center items-center
                                hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                      onClick={() => setInput(`${input}8`)}
                    >
                      8
                    </button>

                    <button
                      className="flex p-3 h-full w-full bg-zinc-600 text-white font-semibold m-0.5 text-2xl justify-center items-center
                                hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                      onClick={() => setInput(`${input}9`)}
                    >
                      9
                    </button>

                    {/* Third Row */}
                    <button
                      className="flex p-3 h-full w-full bg-zinc-600 text-white font-semibold m-0.5 text-2xl justify-center items-center
                                hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                      onClick={() => setInput(`${input}4`)}
                    >
                      4
                    </button>

                    <button
                      className="flex p-3 h-full w-full bg-zinc-600 text-white font-semibold m-0.5 text-2xl justify-center items-center
                                hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                      onClick={() => setInput(`${input}5`)}
                    >
                      5
                    </button>

                    <button
                      className="flex p-3 h-full w-full bg-zinc-600 text-white font-semibold m-0.5 text-2xl justify-center items-center
                                hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                      onClick={() => setInput(`${input}6`)}
                    >
                      6
                    </button>

                    {/* Fourth Row */}
                    <button
                      className="flex p-3 h-full w-full bg-zinc-600 text-white font-semibold m-0.5 text-2xl justify-center items-center
                                hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                      onClick={() => setInput(`${input}1`)}
                    >
                      1
                    </button>

                    <button
                      className="flex p-3 h-full w-full bg-zinc-600 text-white font-semibold m-0.5 text-2xl justify-center items-center
                                hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                      onClick={() => setInput(`${input}2`)}
                    >
                      2
                    </button>

                    <button
                      className="flex p-3 h-full w-full bg-zinc-600 text-white font-semibold m-0.5 text-2xl justify-center items-center
                                hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                      onClick={() => setInput(`${input}3`)}
                    >
                      3
                    </button>

                    {/* Fifth Row */}
                    <button
                      className="flex p-3 h-full w-full bg-zinc-600 text-white font-semibold m-0.5 text-2xl justify-center items-center
                                hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear col-span-2"
                      onClick={() => setInput(`${input}0`)}
                    >
                      0
                    </button>

                    <button
                      className="flex p-3 h-full w-full bg-zinc-600 text-white font-semibold m-0.5 text-2xl justify-center items-center
                                hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
                      onClick={() => setInput(`${input}00`)}
                    >
                      00
                    </button>

                    <button></button>

                  </div>

                  {/* Cash and credit buttons */}
                  <div className="grid grid-cols-2 w-full gap-1">
                    <button className={`p-5 rounded-md text-white text-2xl bg-blue-600 hover:bg-zinc-400`}
                      onClick={() => {
                        setCash(cash + Number(input));
                        setInput("");
                      }}
                    >
                      Cash
                    </button>
                    <button className={`p-5 rounded-md text-white text-2xl bg-blue-600 hover:bg-zinc-400`}
                      onClick={() => {
                        setCredit(credit + Number(input));
                        setInput("");
                      }}
                    >
                      Credit
                    </button>
                    {/* <button className={`p-5 rounded-md text-white text-2xl bg-blue-600 hover:bg-zinc-400`} onClick={() => { }}>Credit</button> */}
                  </div>

                  {/* Additional Notes Section */}
                  <div className="flex flex-col w-full">
                    <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Notes</label>
                    <textarea
                      className="border border-zinc-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                      placeholder="Additional Notes"
                      onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                  </div>

                  {/* Loading Spinner */}
                  {loading ? (
                    <div className="flex justify-center items-center py-2">
                      <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    // Transaction submit button
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="h-20 text-2xl font-semibold w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-zinc-400 transition duration-200 ease-in-out"
                      onClick={handleSubmitTransaction}
                    >
                      Submit
                    </motion.button>
                  )}
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