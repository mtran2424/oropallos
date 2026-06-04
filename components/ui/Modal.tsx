import { AnimatePresence, motion } from "framer-motion";
import TextButton from "./TextButton";

/**
 * Modal component that can be used to display any content in a modal window. It uses framer-motion for animations and is styled with Tailwind CSS. The modal can be closed by clicking the close button or by clicking outside the modal content.
 * 
 * Props:
 * - open: boolean - Open state
 * - title: string - Modal title
 * - onClose: () => void - Function to close the modal
 * - ref?: React.Ref<HTMLDivElement> - Optional ref for the modal content
 * - children: React.ReactNode - Modal content
 */
const Modal = ({
  open,
  title,
  height,
  width,
  onClose,
  ref,
  children
}: {
  open: boolean;
  title: string;
  height?:string;
  width?:string;
  onClose: () => void;
  ref?: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
}) => {
  return (
    <AnimatePresence mode="wait">
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-200">
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: "0" }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            ref={ref}
            className={`relative bg-white p-6 rounded-2xl shadow-lg
              border border-zinc-500
              ${height ? height : "max-h-[95vh]"} h-full
              ${width ? width : "max-w-3xl"} w-full
              overflow-y-auto 
              `}
          >
            {/* Modal Header */}
            <h3 className="text-xl text-zinc-900 mb-4 mt-2 text-left">{title}</h3>
            {/* Close Modal Button */}
            <div className="absolute top-4 right-4">
              <TextButton onClick={onClose}>
                Close
              </TextButton>
            </div>
            {/* Modal Content */}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default Modal;