"use client";
import { getAnnouncements } from "@/app/api/announcementapi";
import { Announcement } from "@/lib/generated/prisma";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CiPhone } from "react-icons/ci";
import { FaFacebookF } from "react-icons/fa";

const Header = () => {
  const [announcements, setAnnouncements] = useState<string[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showing, setShowing] = useState(true);

  useEffect(() => {
    if (announcements.length === 0) return;

    const timeout = setTimeout(() => {
      setShowing(false);
      // start sliding out
      setTimeout(() => {
        // Increment index to get next announcement on slide out
        setCurrentIndex((prev) => (prev + 1) % announcements.length);

        // slide in next
        setShowing(true);
      }, 10000); // slide out duration
    }, 10000); // how long it stays visible

    return () => clearTimeout(timeout);
  }, [announcements, currentIndex, showing]);

  // Fetch announcements on mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements();
        const now = new Date();

        const validAnnouncements = (data.announcements || [])
          .filter((a: Announcement) => !a.endDate || new Date(a.endDate) >= now)

        setAnnouncements(validAnnouncements.map((a: Announcement) => a.content));
      } catch (error) {
        console.error("Failed to fetch announcements", error);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="fixed top-0 w-full h-10 bg-zinc-600 z-50 whitespace-nowrap"
    >
      {/* Header Body */}
      <div className="flex flex-row items-start justify-start gap-5 px-10">

        {/* Telephone Button */}
        <a
          href="tel:+15187983988"
          className="text-white font-semibold hover:text-red-900 underline-animate transition-colors items-center justify-center p-2"
        >
          <CiPhone className="inline-block mr-1" />
          Call
        </a>

        {/* Facebook button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-400 text-white shadow-lg hover:shadow-xl transition-colors duration-300 mt-2"
        >
          <a
            href="https://www.facebook.com/Oropallos-Discount-Wine-Liquor-100063748050582/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-md hover:text-zinc-300 transition-colors"
          >
            <FaFacebookF />
          </a>
        </motion.div>

        {/* Announcement Section */}
        <div className="relative overflow-hidden w-[70vw] h-10 flex items-center justify-center">
          {announcements.length > 0 ? (
            <motion.div
              key={currentIndex + showing.toString()} // re-trigger animation
              initial={{ x: "100%" }}
              animate={{ x: ["-200%", "200%"] }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 15,
                ease: "linear",
              }}
              className="absolute text-white font-semibold whitespace-nowrap"
            >
              {announcements[currentIndex]}
            </motion.div>
          ) : (
            // Fallback message if no announcements are available
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: ["-200%", "200%"] }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 15,
                ease: "linear",
              }}
              className="absolute text-white font-semibold whitespace-nowrap"
            >
              Stop by our store for the best deals on wine and liquor!
            </motion.div>
          )}
        </div>

      </div>
    </motion.header>
  );
};

export default Header;
