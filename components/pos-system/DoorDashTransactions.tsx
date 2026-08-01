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
  checkItemExists,
  calculateFee
} from "@/components/global.utils";
import Receipt from "@/components/utils/Receipt";
import TextButton from "@/components/ui/TextButton";
import Modal from "@/components/ui/Modal";
import AddCustom from "./transactions/AddCustom";
import SearchMenu from "./transactions/SearchMenu";
import QuickButton from "./transactions/QuickButton";
import ManualRegister from "./ManualRegister";

const DoorDashTransactions = ({
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
  const [cashout, setCashout] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<boolean>(false);

  // Transaction states
  const [total, setTotal] = useState<number>(0);
  const [cash, setCash] = useState<number>(0);
  const [credit, setCredit] = useState<number>(0);
  const [type, setType] = useState<"Cash">("Cash")
  const [amountTendered, setAmountTendered] = useState<number>(0);
  const [change, setChange] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Edit cart item states
  const [editItem, setEditItem] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [currentProduct, setCurrentProduct] = useState<Product>();

  const modalRef = useRef<HTMLDivElement>(null);

  // Close the modal for cashout
  const closeCashoutModal = () => {
    // Clear current cashout states before closing modal
    setCashout(false);
    setCash(0);
    setCredit(0);
  };

  // Close the modal for confirm
  const closeConfirmModal = () => {
    // Clear cashout states and cart on other screen after confirmation
    setCart([]);
    setCash(0);
    setCredit(0);
    setAmountTendered(0);
    setChange(0);
    setConfirm(false);
  };

  // Close the modal for adding a product
  const closeEditModal = () => {
    // Reset edit states when no item is selected
    setQuantity(-1);
    setCurrentProduct(undefined);
    setCurrentIndex(-1);
    setEditItem(false);
  };

  // Event Handlers

  // Populate states when editing item
  const handleOpenEdit = (item: TransactionItemRequest, index: number) => {
    setCurrentIndex(index);
    setQuantity(item.quantity);
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
        productId: currentProduct.id,
        product: currentProduct,
        discount: noDiscount,
        itemPrice: parseInt(((currentProduct.type === 'Canned_Cocktails' ?
          parseFloat((currentProduct.price * 1.13).toFixed(2)) :
          currentProduct.category !== 'Liquor' ?
            parseFloat((currentProduct.price * 1.13).toFixed(2)) :
            parseFloat((currentProduct.price * 1.15).toFixed(2))) * 100).toFixed(0)),
        unitPrice: currentProduct.unitPrice ? parseInt(currentProduct.unitPrice.toFixed(0)) : undefined
      }

      // Remove old item from cart
      const newCart = [...cart];
      newCart.splice(currentIndex, 1);
      setCart(newCart);

      setCart((prev) => [...prev, newItem]);

      // Reset states upon confirm
      setQuantity(-1);
      setCurrentProduct(undefined);
      setCurrentIndex(-1);
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
      itemPrice: parseInt(((product.type === 'Canned_Cocktails' ?
        parseFloat((product.price * 1.13).toFixed(2)) :
        product.category !== 'Liquor' ?
          parseFloat((product.price * 1.13).toFixed(2)) :
          parseFloat((product.price * 1.15).toFixed(2))) * 100).toFixed(0)),
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
    }
    else {
      setCart((prev) => [...prev, item]);
    }
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
    }
    else {
      setCart((prev) => [...prev, item]);
    }
  }

  // Create transaction on submission
  const handleSubmitTransaction = async () => {
    try {
      setLoading(true);

      // Amount tendered is combination of cash/credit if over total, total if under
      setAmountTendered((cash + credit) > total ? cash + credit : total);

      // No change if cash + credit is less that total
      setChange((cash + credit) > total ? (cash + credit) - total : 0);

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
        credit: 0,
        amountTendered: (cash + credit) > total ? cash + credit : total,
        notes: "",
        doorDash: true,
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
              <AddCustom products={products} color="red" modalRef={modalRef} discounts={discounts} onClick={handleCustomAdd} />
              {quickAddButtons && quickAddButtons.map((button) => (
                <QuickButton key={button.id} color="red" discountsDisabled quickButton={button} discounts={discounts} onClick={handleCustomAdd} />
              ))}
            </div>
          </div>

          {/* Register tools */}
          <div>
            {/* Tool selector */}
            <div className="grid grid-cols-2 p-2">
              <TextButton color="red" onClick={() => setMode("Search")}>
                Search
              </TextButton>
              <TextButton color="red" onClick={() => setMode("Register")}>
                Register
              </TextButton>
            </div>
            {/* Tools */}
            {mode === "Register" && <ManualRegister discounts={discounts} onConfirm={(item) => {
              handleAddItem({
                ...item, itemPrice: (item.type !== 'Liquor' ?
                  parseInt((item.itemPrice * 1.13).toFixed(0)) :
                  parseInt((item.itemPrice * 1.15).toFixed(0)))
              });
            }} />}
            {mode === "Search" && <SearchMenu discountsDisabled color="red"products={products} discounts={discounts} onConfirm={(item) => {
              if (item.product) {
                handleAddItem({
                  ...item, itemPrice: parseInt(((item.product.type === 'Canned_Cocktails' ?
                    parseFloat((item.product.price * 1.13).toFixed(2)) :
                    item.product.category !== 'Liquor' ?
                      parseFloat((item.product.price * 1.13).toFixed(2)) :
                      parseFloat((item.product.price * 1.15).toFixed(2))) * 100).toFixed(0))
                });
              }
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
                    FEE:
                  </td>
                  <td className="text-end text-3xl">
                    {(calculateFee(calculateTotal(cart)) / 100).toFixed(2)}
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
                    {((calculateTotal(cart) + calculateFee(calculateTotal(cart))) / 100).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              className="flex h-20 my-5 w-full bg-red-600 text-white font-semibold m-0.5 text-2xl justify-center items-center px-10 col-span-4 
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
      <Modal open={cashout} title="Cashout" onClose={closeCashoutModal} height="max-h-[40vh]" ref={modalRef}>
        <div className="mt-6 w-full border-t border-zinc-500 text-lg rounded-lg p-4">
          <div className="flex flex-col items-center justify-center w-full gap-1">

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
                  FEE
                </td>
                <td className="text-end text-2xl">
                  {(calculateFee(calculateTotal(cart)) / 100).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

            {/* Loading Spinner */}
            {loading ? (
              <div className="flex justify-center items-center py-2">
                <div className="w-6 h-6 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              // Transaction submit button
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="h-20 text-2xl font-semibold w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-zinc-400 transition duration-200 ease-in-out"
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

          <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Receipt Option</label>
          <div className="grid grid-cols-2 w-full gap-2">
            <button type="button" className={`p-5 rounded-md text-white text-2xl bg-red-600 hover:bg-zinc-400`} onClick={() => printNoReceipt()}>No Receipt</button>
            <button type="button" className={`p-5 rounded-md text-white text-2xl bg-red-600 hover:bg-zinc-400`} onClick={() => printReceipt()}>Print Receipt</button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            className="h-20 text-2xl font-semibold w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-zinc-400 transition duration-200 ease-in-out"
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
                className="text-red-600 hover:text-zinc-400"
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
                  className="text-5xl font-semibold text-center rounded-lg w-40 p-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 ease-in-out"
                  onChange={(e) => {
                    const value = e.target.value;
                    setQuantity(parseInt(value));
                  }}
                  value={quantity || "0"}
                />
              </div>
              <button
                className="text-red-600 hover:text-zinc-400"
                onClick={() => setQuantity(quantity + 1)}
              >
                <MdNavigateNext size={60} />
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              className="h-20 text-2xl font-semibold w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-zinc-400 transition duration-200 ease-in-out"
              onClick={handleSubmitEdit}
            >
              Submit
            </motion.button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default DoorDashTransactions;