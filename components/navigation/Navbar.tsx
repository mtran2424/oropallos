"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import logo from "@/components/assets/logos/oropallos-logo-darkfont.png";
import { navBarElements } from "@/components/global.utils";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

const Navbar = () => {
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
        ease: [0.6, 0.05, 0.01, 0.9],
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
        ease: [0.6, 0.05, 0.01, 0.9]
      }
    }),
    exit: (i: number) => ({
      opacity: 0,
      y: 20,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: [0.6, 0.05, 0.01, 0.9]
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
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full h-20 text-red-900 bg-white z-50"
    >
      <div className="flex items-center justify-between p-5 max-w-screen-xl mx-auto font-serif">
        {/* Logo button */}
        <Link href="/" className="absolute left-1/2 transfrom -translate-x-1/2 mt-10 md:mt-0 md:static md:translate-x-0 cursor-pointer">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Image
              src={logo}
              alt="Oropallo's Discount Wine and Liquor Logo"
              height={100}
              className="h-12 w-auto"
            />
          </motion.div>
        </Link>

        {/* Navigation links */}
        <div className="hidden md:flex space-x-5 lg:space-x-10">
          {/* Admin Dashboard Link */}
          <SignedIn>
            <Link
              href="/admin/dashboard"
              className="text-lg text-[#FFBA04] font-semibold"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                Dashboard
              </motion.div>
            </Link>
          </SignedIn>

          {/* Links to other pages */}
          {navBarElements.map((element, index) => (
            <Link
              key={index}
              href={element.path}
              className="text-lg font-semibold"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                {element.label}
              </motion.div>
            </Link>
          ))}

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        {/* MENU TOGGLE BUTTON */}
        <motion.button
          onClick={() => setOpen(!open)}
          className='md:hidden z-50 px-5'
          whileHover={{ scale: 1.1 }}
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key={"close"}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hover:text-[#FFBA04] transition duration-300 ease-in-out"
              >
                <IoMdClose size={30} />
              </motion.div>
            ) : (
              <motion.div
                key={"menu"}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                exit={{ scaleX: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hover:text-[#FFBA04] transition duration-300 ease-in-out"
              >
                <FiMenu size={30} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

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
              {navBarElements.map((element, index) => (
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
    </motion.nav>
  );
}

export default Navbar;