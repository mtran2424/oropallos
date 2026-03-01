import { motion } from "framer-motion";
import NumPad from "./NumPad";

const Transaction = () => {
  return (<motion.div
    initial={{ x: "-100%", opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: "100%", opacity: 0 }}
    transition={{ duration: 1, ease: "easeInOut" }}
  >
    Transaction
    <NumPad />
  </motion.div>);
}

export default Transaction;