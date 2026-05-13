import { motion } from "framer-motion";

const TextButton = ({ children, onClick } : { children: React.ReactNode; onClick: () => void }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      className="text-lg text-blue-500 hover:text-zinc-200"
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default TextButton;
