import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { MdDelete, MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { IoBackspaceOutline } from "react-icons/io5";
import { createTransaction } from "@/app/api/transactionapi";
import {
  Product,
  noDiscount,
  calculateSubtotal,
  calculateTotal,
  calculateTax,
  formatTime,
  formatDate,
  Discount,
  QuickAddButton,
  TransactionItemRequest,
  calculateDiscount,
  fifteenPercentDiscount,
  taxFreeDiscount,
  checkItemExists
} from "@/components/global.utils";
import Receipt from "@/components/utils/Receipt";
import TextButton from "@/components/ui/TextButton";
import Modal from "@/components/ui/Modal";
import AddCustom from "./transactions/AddCustom";
import SearchMenu from "./transactions/SearchMenu";
import AddGiftcard from "./transactions/AddGiftcard";
import QuickButton from "./transactions/QuickButton";
import ManualRegister from "./ManualRegister";
import PartialNumPad from "./num-pad/PartialNumPad";
import { createPayment } from "@/app/api/paymentapi";

const Transactions = ({
  products,
  discounts,
  quickAddButtons,
  onTransaction
}: {
  products: Product[];
  discounts: Discount[];
  quickAddButtons: QuickAddButton[];
  onTransaction: () => void;
}) => {
  const date = new Date();
  const user = useUser();
  const [cart, setCart] = useState<TransactionItemRequest[]>([]);
  const [mode, setMode] = useState<string>("Search");
  const [input, setInput] = useState<string>("");
  const [cashout, setCashout] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<boolean>(false);

  // Transaction states
  const [note, setNote] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [cash, setCash] = useState<number>(0);
  const [credit, setCredit] = useState<number>(0);
  const [type, setType] = useState<"Cash" | "Credit">("Cash")
  const [amountTendered, setAmountTendered] = useState<number>(0);
  const [change, setChange] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Edit cart item states
  const [editItem, setEditItem] = useState(false);
  const [otherDiscount, setOtherDiscount] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [currentItem, setCurrentItem] = useState<TransactionItemRequest>();
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [currentProduct, setCurrentProduct] = useState<Product>();
  const [discount, setDiscount] = useState<Discount>(noDiscount);

  const channel = new BroadcastChannel(`${user.user?.username}-pos`);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close the modal for cashout
  const closeCashoutModal = () => {
    // Clear current cashout states before closing modal
    setCashout(false);
    setInput("");
    setCash(0);
    setCredit(0);
    setNote("");
    setType("Cash");
  };

  // Close the modal for confirm
  const closeConfirmModal = () => {
    // Clear cashout states and cart on other screen after confirmation
    setCart([]);
    setCash(0);
    setCredit(0);
    setNote("");
    setInput("");
    setAmountTendered(0);
    setChange(0);
    setType("Cash");
    setConfirm(false);
    channel.postMessage({
      type: "cart-clear",
    });
  };

  // Close the modal for adding a product
  const closeEditModal = () => {
    // Reset edit states when no item is selected
    setQuantity(-1);
    setCurrentItem(undefined);
    setCurrentProduct(undefined);
    setCurrentIndex(-1);
    setDiscount(noDiscount);
    setEditItem(false);
  };

  const closeDiscountModal = () => {
    setOtherDiscount(false);
  }

  // Return discounted price, considering tax exempt exception
  const getPrice = (discount: string, price: number) => {
    switch (discount) {
      case "Tax_Free": return (price / 1.07);
      default: return price;
    }
  }

  // Event Handlers

  // Populate states when editing item
  const handleOpenEdit = (item: TransactionItemRequest, index: number) => {
    setCurrentItem(item);
    setCurrentIndex(index);
    setQuantity(item.quantity);
    setDiscount(item.discount);
    setCurrentProduct(item.product);
    setEditItem(true);
  }

  // Submit changes from editing item
  const handleSubmitEdit = () => {
    // Type of item and product required to be submitted
    if (quantity && currentProduct) {
      const newItem = {
        type: currentProduct.itemType,
        name: currentProduct.name,
        quantity: quantity,
        discount: discount,
        productId: currentProduct.id,
        product: currentProduct,
        itemPrice: parseInt(getPrice(discount.value, currentProduct.price * 100).toFixed(0)),
        unitPrice: currentProduct.unitPrice ? parseInt(currentProduct.unitPrice.toFixed(0)) : undefined
      }

      // Remove old item from cart
      const newCart = [...cart];
      newCart.splice(currentIndex, 1);
      setCart(newCart);

      // Add back as new item to cart
      channel.postMessage({
        type: "cart-edit",
        item: currentItem,
        newItem: newItem,
      });
      setCart((prev) => [...prev, newItem]);

      // Reset states upon confirm
      setQuantity(-1);
      setCurrentItem(undefined);
      setCurrentProduct(undefined);
      setCurrentIndex(-1);
      setDiscount(noDiscount);
      setEditItem(false);
    }
  }

  // Adding custom item
  const handleCustomAdd = (
    product: Product,
    quantity: number,
    name: string,
    type: string,
    discount: Discount,
    price: number
  ) => {
    // Find new item in cart

    const item = {
      type: type,
      name: name,
      quantity: quantity,
      discount: discount,
      itemPrice: price,
      unitPrice: product.unitPrice ? parseInt(product.unitPrice.toFixed(0)) : undefined,
      productId: product.id,
      product: product
    }

    const itemExists = checkItemExists(cart, item);

    // Create new item entry if DNE, update quantity if exists
    if (itemExists != -1) {
      const temp = cart[itemExists];
      temp.quantity += quantity;
      setCart((prev) => [...prev]);
      channel.postMessage({
        type: "cart-update",
        item: item
      });
    }
    else {
      setCart((prev) => [...prev, item]);
      channel.postMessage({
        type: "cart-add",
        item: item
      });
    }
  }

  // Create gift card item
  const handleGiftcardAdd = (
    price: number
  ) => {
    const item = {
      type: "Giftcard",
      name: "Gift Card",
      quantity: 1,
      discount: noDiscount,
      itemPrice: price,
    }
    setCart((prev) => [...prev, item]);
    channel.postMessage({
      type: "cart-add",
      item: item
    });
  }

  // Add basic item
  const handleAddItem = (item: TransactionItemRequest) => {
    // Check if item exists
    const itemExists = checkItemExists(cart, item);

    // Create new item entry if DNE, update quantity if exists
    if (itemExists != -1) {
      const temp = cart[itemExists];
      temp.quantity += item.quantity;
      setCart((prev) => [...prev]);
      channel.postMessage({
        type: "cart-update",
        item: item
      });
    }
    else {
      setCart((prev) => [...prev, item]);
      channel.postMessage({
        type: "cart-add",
        item: item
      });
    }
  }

  const handleCardTransaction = async (amount: number, type: string) => {
    try {
      const sale = {
        amount: amount,
        paymentType: type,
        referenceId: `${user.user?.username}-${date.getTime()}`,
        register: user.user?.username || "Unknown Register"
      };

      const res = await createPayment(sale);
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  // Create transaction on submission
  const handleSubmitTransaction = async () => {
    try {
      setLoading(true);

      // Amount tendered is combination of cash/credit if over total, total if under
      setAmountTendered((cash + credit) > total ? cash + credit : total);

      // No change if cash + credit is less that total
      setChange((cash + credit) > total ? (cash + credit) - total : 0);

      const creditTotal =
        // Fill Credit
        (type === "Credit") ? (
          (cash < total) ? (
            total - cash
          ) : 0
        ) : (credit < total) ?
          credit : total;

      const cashTotal =
        // Fill Cash
        (type === "Cash") ? (
          (credit < total) ? (
            total - credit
          ) : 0
        ) : (cash < total) ?
          cash : total;

      // Cash Overflow

      const transaction = {
        status: "Cashed",
        register: user.user?.username || "Unknown Register",
        transactionItems: cart,
        cash: cashTotal,
        credit: creditTotal,
        amountTendered: (cash + credit) > total ? cash + credit : total,
        notes: note,
        doorDash: false,
      }
      const res = await createTransaction(transaction).then((res) => {
        setConfirm(true);
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
        onTransaction();
        toast.success("Transaction successful")
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  }

  // Printing
  const receiptRef = useRef<HTMLDivElement>(null);
  const noReceiptRef = useRef<HTMLDivElement>(null);

  const handlePrintReceipt = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: "Transaction Receipt",
    pageStyle: `
    @page {
      size: 80mm auto;
      margin: 0;
    }

    @media print {
      html, body {
        width: 80mm;
        margin: 0;
        padding: 0;
      }

      .receipt {
        width: 78mm;
        font-family: monospace;
        font-size: 11px;
      }
    }
  `,
  });

  const handlePrintNoReceipt = useReactToPrint({
    contentRef: noReceiptRef,
    documentTitle: "Transaction Receipt",
    pageStyle: `
    @page {
      size: 80mm auto;
      margin: 0;
    }

    @media print {
      html, body {
        width: 80mm;
        margin: 0;
        padding: 0;
      }

      .receipt {
        width: 78mm;
        font-family: monospace;
        font-size: 11px;
      }
    }
  `,
  })

  const printReceipt = () => {
    handlePrintReceipt();
  }

  const printNoReceipt = () => {
    handlePrintNoReceipt();
  }

  // Constants for receipts
  const receipt = (
    <Receipt ref={receiptRef}>
      <table className="w-full max-w-3/4 border-separate border-spacing-y-2">
        <tbody>
          <tr>
            <td className="text-start">{formatDate(date, "mm/dd/yyyy")}<br />{formatTime(date)}</td>
            <td className="text-end">Reg:<br /> {user.user?.username || 'Unknown Register'}</td>
          </tr>
        </tbody>
      </table>

      <table className="w-full max-w-3/4 border-separate">
        <tbody>
          {cart.map((item, index) => (
            <tr key={index} className="w-full">
              <td className="text-start items-start h-full align-top">
                <div
                  className="flex flex-col text-start">
                  <div className="font-semibold">
                    {item.type.toUpperCase()}
                  </div>
                  <div>
                    {item.name.toUpperCase()}
                  </div>
                  <div></div>
                </div>
              </td>
              <td className="text-start items-start h-full align-top">
                <div className="flex flex-col text-end">
                  <div>
                    {item.quantity > 1 ? `${item.quantity} @ ` : ''}${(item.itemPrice / 100).toFixed(2)}
                  </div>
                  {item.discount.value !== "No_Discount" && item.discount.value !== "Tax_Free" && (
                    <div>
                      -{((item.discount.multiplier)).toFixed(0)}%
                    </div>
                  )}
                  {item.discount.value !== "No_Discount" && item.discount.value !== "Tax_Free" && (
                    <div>
                      -{((((item.discount.multiplier / 100) * item.itemPrice * item.quantity)) / 100).toFixed(2)}
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="w-full max-w-3/4 border-separate pt-2">
        <tbody>
          <tr className="">
            <td className="text-start font-semibold">
              SUBTOTAL
            </td>
            <td className="text-end">
              ${(calculateSubtotal(cart) / 100).toFixed(2)}
            </td>
          </tr>
          <tr className="">
            <td className="text-start font-semibold">
              TAX
            </td>
            <td className="text-end">
              ${(calculateTax(cart) / 100).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      <table className="w-full max-w-3/4 border-separate pt-2">
        <tbody>
          <tr className="">
            <td className="text-start font-semibold">
              TOTAL
            </td>
            <td className="text-end">
              ${(parseInt(calculateTotal(cart).toFixed(0)) / 100).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="text-start font-semibold">
              CASH
            </td>
            <td className="text-end">
              ${(amountTendered / 100).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="text-start font-semibold">
              CHANGE
            </td>
            <td className="text-end">
              ${(change / 100).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </Receipt>
  );

  const noReceipt = (
    <Receipt ref={noReceiptRef}>
      <h1 className=" w-full text-left">
        No Receipt
      </h1>
    </Receipt>
  );

  useEffect(() => {
    channel.postMessage({
      type: "cart-clear",
    });
  }, []);

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
                        <td className="text-2xl text-center p-1">{item.type}</td>
                        <td
                          className="text-2xl text-left p-1"
                          onClick={() => {
                            handleOpenEdit(item, index);
                          }}
                        >{item.name} {item.product ? " - " + item.product.size : ""}</td>
                        <td className="text-2xl text-center p-1">{item.quantity}</td>
                        <td className="text-2xl text-center p-1">{item.discount.name}</td>
                        <td className="text-2xl text-center p-1">{(item.itemPrice / 100).toFixed(2)}</td>
                        <td className="text-2xl text-center p-1">
                          <button onClick={() => {
                            const newCart = [...cart];
                            newCart.splice(index, 1);
                            setCart(newCart);
                            channel.postMessage({
                              type: "cart-remove",
                              item: item
                            });
                          }}>
                            <MdDelete size={40} className="text-red-500 hover:text-red-700" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
            <div className="grid grid-cols-4 gap-1">
              <AddCustom products={products} modalRef={modalRef} discounts={discounts} onClick={handleCustomAdd} />
              <AddGiftcard ref={modalRef} onClick={handleGiftcardAdd} />
              {quickAddButtons && quickAddButtons.map((button) => (
                <QuickButton key={button.id} quickButton={button} discounts={discounts} onClick={handleCustomAdd} />
              ))}
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
            {mode === "Register" && <ManualRegister discounts={discounts} onConfirm={(item) => {
              handleAddItem(item);
            }} />}
            {mode === "Search" && <SearchMenu products={products} discounts={discounts} onConfirm={(item) => {
              handleAddItem(item);
            }} />}

            {/* Cart summary */}
            <table className="w-full my-5">
              <tbody>
                <tr>
                  <td className="font-semibold text-3xl">
                    SUBTOTAL:
                  </td>
                  <td className="text-end text-3xl">
                    {(calculateSubtotal(cart) / 100).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold text-3xl">
                    TAX:
                  </td>
                  <td className="text-end text-3xl">
                    {(calculateTax(cart) / 100).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold text-3xl">
                    DISCOUNT:
                  </td>
                  <td className="text-end text-3xl">
                    {(calculateDiscount(cart) / 100).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="w-full">
              <tbody>
                <tr>
                  <td className="font-semibold text-3xl">
                    TOTAL
                  </td>
                  <td className="text-end text-3xl">
                    {(calculateTotal(cart) / 100).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              className="flex h-20 my-5 w-full bg-blue-600 text-white font-semibold m-0.5 text-2xl justify-center items-center px-10 col-span-4 
                        hover:bg-zinc-400 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
              onClick={() => {
                if (cart.length !== 0) {
                  setTotal(parseInt(calculateTotal(cart).toFixed(0)));
                  setCashout(true);
                }
              }}
            >
              Cash Out
            </button>
          </div>

          {/* Receipts */}
          <div className="hidden">
            <div className="print-area" ref={receiptRef} >
              {receipt}
            </div>
            <div className="print-area" ref={noReceiptRef} >
              {noReceipt}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cashout Modal */}
      <Modal open={cashout} title="Cashout" onClose={closeCashoutModal} ref={modalRef}>
        <div className="mt-6 w-full border-t border-zinc-500 text-lg rounded-lg p-4">
          <div className="flex flex-col items-center justify-center w-full gap-1">

            {/* Current input dash display */}
            <div className="grid grid-cols-2 text-xl w-full">
              <div className="text-start">
                TOTAL: ${(total / 100).toFixed(2)}
              </div>
              <div className="text-end">
                AMOUNT DUE: ${((total - (cash + credit)) / 100).toFixed(2)}
              </div>
            </div>

            {/* Input bar */}
            <motion.div
              className="px-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                                overflow-hidden w-full h-30 mb-2"
            >
              {/* Current input dash display */}

              {/* Input box for amount entry. When cash or credit buttons are pressed, amount is added to respective payment type and input 
                    is cleared. If amount entered is greater than amount due, change is calculated and displayed in success modal after transaction submission. */}
              <input
                type="number"
                value={input}
                min={0}
                onChange={(e) => setInput(e.target.value)}
                className="text-4xl overflow-hidden w-full h-full focus:outline-none"
                style={{ whiteSpace: "nowrap" }}
              />

            </motion.div>

            <table className="w-full">
              <tbody>
                <tr>
                  <td className="font-semibold text-xl">
                    CASH
                  </td>
                  <td className="text-end text-xl">
                    ${(cash / 100).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold text-xl">
                    CREDIT
                  </td>
                  <td className="text-end text-xl">
                    ${(credit / 100).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>

            <PartialNumPad
              onClearClick={() => {
                setInput("");
                setCash(0);
                setCredit(0);
              }}
              onBackspaceClick={() => {
                setInput(prev => prev.slice(0, -1));
              }}
              onNumberClick={(value) => setInput(`${input}${value}`)}
            />

            {/* Cash and credit buttons */}
            <div className="grid grid-cols-2 w-full gap-1 pt-1">
              <button className={`p-5 rounded-md text-white text-2xl bg-blue-600 ${type === "Cash" ? "bg-blue-600" : "bg-zinc-500"}`}
                onClick={() => {
                  setType("Cash")
                  if (input !== "") {
                    setCash(cash + parseInt(Number(input).toFixed(0)));
                    setInput("");
                  }
                }}
              >
                Cash
              </button>
              <button className={`p-5 rounded-md text-white text-2xl bg-blue-600 ${type === "Credit" ? "bg-blue-600" : "bg-zinc-500"}`}
                onClick={() => {
                  setType("Credit")
                  if (input !== "") {
                    setCredit(credit + parseInt(Number(input).toFixed(0)));
                    setInput("");
                  }

                  handleCardTransaction(parseFloat(((total - (cash + credit)) / 100).toFixed(2)), "Credit");
                }}
              >
                Credit
              </button>
              {/* <button className={`p-5 rounded-md text-white text-2xl bg-blue-600 hover:bg-zinc-400`} onClick={() => { }}>Credit</button> */}
            </div>

            {/* Additional Notes Section */}
            <div className="flex flex-col w-full py-4">
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
      </Modal>

      {/* Cashout Confirmation Modal */}
      <Modal open={confirm} height="max-h-[60vh]" title="Confirm" onClose={closeConfirmModal} ref={modalRef}>
        <div className="flex flex-col items-center gap-3">

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
              <tr>
                <td className="font-semibold text-2xl">
                  AMOUNT TENDERED
                </td>
                <td className="text-end text-2xl">
                  {(amountTendered / 100).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Change</label>
          <div className="text-2xl font-bold text-zinc-900">
            ${(change / 100).toFixed(2)}
          </div>

          <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Receipt Option</label>
          <div className="grid grid-cols-2 w-full gap-2">
            <button type="button" className={`p-5 rounded-md text-white text-2xl bg-blue-600 hover:bg-zinc-400`} onClick={() => printNoReceipt()}>No Receipt</button>
            <button type="button" className={`p-5 rounded-md text-white text-2xl bg-blue-600 hover:bg-zinc-400`} onClick={() => printReceipt()}>Print Receipt</button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            className="h-20 text-2xl font-semibold w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-zinc-400 transition duration-200 ease-in-out"
            onClick={closeConfirmModal}
          >
            Close
          </motion.button>
        </div>
      </Modal>

      <Modal open={editItem} title="Add Item" height="max-h-[80vh]" width="max-w-3xl" onClose={closeEditModal} ref={modalRef}>
        <div className="mt-6 w-full border-t border-zinc-500 text-lg rounded-lg p-4">
          <div className="flex flex-col items-center justify-center w-full gap-4">
            <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Quantity</label>
            <div className="flex flex-row">
              <button
                className="text-blue-600 hover:text-zinc-400"
                onClick={() => {
                  if (quantity > 1)
                    setQuantity(quantity - 1)
                }}
                disabled={quantity <= 1}
              >
                <MdNavigateBefore size={60} />
              </button>
              <div className="flex w-full items-center justify-center">
                <input
                  type="number"
                  step="1"
                  min={0}
                  className="text-5xl font-semibold text-center rounded-lg w-40 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                  onChange={(e) => {
                    const value = e.target.value;
                    setQuantity(parseInt(value));
                  }}
                  value={quantity || "0"}
                />
              </div>
              <button
                className="text-blue-600 hover:text-zinc-400"
                onClick={() => setQuantity(quantity + 1)}
              >
                <MdNavigateNext size={60} />
              </button>
            </div>

            <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Discount</label>
            <div className="grid grid-cols-4 w-full gap-1">
              <button
                className={`p-5 rounded-md text-white text-2xl 
                  ${discount === noDiscount ? "bg-zinc-500" : "bg-blue-600"}
                  hover:bg-zinc-400`}
                onClick={() => setDiscount(noDiscount)}
              >
                No Discount
              </button>
              <button
                className={`p-5 rounded-md text-white text-2xl 
                  ${discount === fifteenPercentDiscount ? "bg-zinc-500" : "bg-blue-600"} 
                  hover:bg-zinc-400`}
                onClick={() => setDiscount(fifteenPercentDiscount)}
              >
                15% Discount
              </button>
              <button
                className={`p-5 rounded-md text-white text-2xl 
                ${discount === taxFreeDiscount ? "bg-zinc-500" : "bg-blue-600"} 
                hover:bg-zinc-400`}
                onClick={() => setDiscount(taxFreeDiscount)}
              >
                Tax Free
              </button>
              <button
                className={`p-5 rounded-md text-white text-2xl 
                  ${discount !== taxFreeDiscount && discount !== fifteenPercentDiscount && discount !== noDiscount ? "bg-zinc-500" : "bg-blue-600"} 
                  hover:bg-zinc-400`}
                onClick={() => setOtherDiscount(true)}
              >
                Other
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              className="h-20 text-2xl font-semibold w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-zinc-400 transition duration-200 ease-in-out"
              onClick={handleSubmitEdit}
            >
              Submit
            </motion.button>
          </div>
        </div>
      </Modal>

      <Modal open={otherDiscount} title="Other Discount" height="max-h-[80vh]" width="max-w-3xl" onClose={closeDiscountModal} ref={modalRef}>
        <div className="grid grid-cols-4 w-full gap-1">
          {discounts.map((disc) => (
            <button
              key={disc.id}
              className={`p-5 rounded-md text-white text-2xl 
                  ${discount === disc ? "bg-zinc-500" : "bg-blue-600"}
                  hover:bg-zinc-400`}
              onClick={() => {
                setDiscount(disc);
                closeDiscountModal();
              }}
            >
              {disc.label}
            </button>))}
        </div>
      </Modal>
    </>
  );
}

export default Transactions;