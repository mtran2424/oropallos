import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { adminNavBarElements } from "@/components/global.utils";

const AdminMobileMenu = () => {
  const [open, setOpen] = useState(false);

  const handleNavigation = () => {
    setOpen(false);
  };

  // Menu container animation variants
  const menuContainerVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };

  // Menu item animation variants
  const menuItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        // ease: [0.6, 0.05, 0.01, 0.9]
      }
    }),
    exit: (i: number) => ({
      opacity: 0,
      y: 20,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        // ease: [0.6, 0.05, 0.01, 0.9]
      }
    })
  };

  //Ensure that the menu is closed when the window is resized
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div>
      <motion.button
        className='md:hidden z-50 px-5'
        whileHover={{ scale: 1.1 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key={"close"}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={() => setOpen(false)}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="hover:text-[#FFBA04]"
            >
              <IoMdClose size={30} />
            </motion.div>
          ) : (
            <motion.div
              key={"menu"}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              onClick={() => setOpen(true)}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="hover:text-[#FFBA04]"
            >
              <FiMenu size={30} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            variants={menuContainerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="md:hidden bg-white w-full absolute left-0 top-full overflow-hidden font-serif font-semibold"
          >
            <ul className="flex flex-col items-center p-4">
              {/* Admin Dashboard Link - available to only signed in users*/}
              <SignedIn>
                <motion.li
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="overflow-hidden"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    exit={{ width: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-opacity-20 mb-4"
                  />
                  <div
                    className="cursor-pointer text-lg inline-block text-[#FFBA04]"
                    onClick={handleNavigation}
                  >
                    <Link href={"/admin/dashboard"} >Dashboard</Link>

                  </div>
                </motion.li>
              </SignedIn>

              {/* Links to other pages */}
              {adminNavBarElements.map((element, index) => (
                <motion.li
                  key={index}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="overflow-hidden"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    exit={{ width: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-opacity-20 mb-4"
                  />
                  <div
                    className="cursor-pointer text-lg inline-block text-red-900"
                    onClick={handleNavigation}
                  >
                    <Link href={element.path} >{element.label}</Link>

                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminMobileMenu;