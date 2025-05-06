"use client";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="mt-35"
    >
      <div className="flex flex-col w-full h-screen items-center justify-start">
        
        <h1 className="text-2xl sm:text-4xl font-sans text-center sm:text-start mb-4">
          Welcome to {`Oropallo\'s Discount Wine and Liquor`}
        </h1>
        <p className="text-xl text-center sm:text-start font-serif">
          367 Dix Ave,<br />
          Queensbury, NY 12804<br />
          <br />
          <a
            href="tel:+15187983988"
            className="underline-animate"
          >
            (518) 798-3988
          </a>
        </p>
      </div>
    </motion.div>
  );
}

export default Home;