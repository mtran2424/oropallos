import { motion } from "framer-motion";

const TextButton = ({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) => {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      className={`text-xl text-blue-500 hover:text-zinc-500 ${disabled ? "text-zinc-400 hover:text-zinc-400" : ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default TextButton;
