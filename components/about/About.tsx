"use client";
import { motion } from "framer-motion";

const About = () => {
  return ( 
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="my-35"
    >
      <div className="flex flex-col items-center justify-start h-full h-min-screen gap-10 px-10 font-serif">
        About
      </div>
    </motion.div>
   );
}
 
export default About;