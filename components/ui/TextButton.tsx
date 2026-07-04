import { motion } from "framer-motion";

/**
 * Simple animated and formatted text button
 * @param children Children component to be displayed and formatted 
 * @param onClick Functionality of button
 * @param disabled Boolean determining if button is disabled or not
 * @returns 
 */
const TextButton = ({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) => {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      className={`text-xl text-nowrap text-blue-500 hover:text-zinc-500 ${disabled ? "text-zinc-400 hover:text-zinc-400" : ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default TextButton;
