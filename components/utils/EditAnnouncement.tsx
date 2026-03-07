import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { editAnnouncement } from "@/app/api/announcementapi";
import { MdModeEditOutline } from "react-icons/md";
import { Announcement } from "../global.utils";

// This component is a button that opens a modal for adding a product
const EditAnnouncement = ({
  onEditAnnouncement,
  announcement
}: {
  onEditAnnouncement: () => void;
  announcement: Announcement
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  // States for form fields
  const [content, setContent] = useState(announcement.content);
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(announcement.endDate));

  // Upon form submission, validate the input and send it to the backend
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Validate input fields
    if (!content || !endDate) {
      toast.error(`Please fill in all required fields.`);
      setLoading(false);
      return;
    }

    // Construct announcement data object to be sent to the API
    const announcementData = {
      content: content,
      endDate: endDate.toISOString(),
    };

    if (announcement.id) {
      editAnnouncement(announcement.id, announcementData)
        .then(() => {
          onEditAnnouncement();
        }).then(() => {
          // Show success message
          toast.success(`Announcement updated successfully!`);

          // Close the modal after submission
          setEdit(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      toast.error(`Announcement ID is missing.`);
    }
  };

  // Open the modal for editing an announcement
  const openEventModal = () => {
    setEdit(true);
  };

  // Close the modal for editing an announcement
  const closeEventModal = () => {
    setEdit(false);
  };

  // Close the modal when clicking outside of it
  const closeModalOnOutsideClick = useCallback((e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeEventModal();
    }
  }, []);

  // Add event listener for closing the modal when clicking outside of it
  useEffect(() => {
    if (edit) {
      document.addEventListener('mousedown', closeModalOnOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', closeModalOnOutsideClick);
    };
  }, [closeModalOnOutsideClick, edit]);

  useEffect(() => {
    // Set initial values for content and endDate when announcement prop changes
    setContent(announcement.content);
    setEndDate(new Date(announcement.endDate));
  }, [announcement]);

  return (
    <>
      {/* edit announcement button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="text-xl text-blue-500 hover:text-blue-400 p-1"
        onClick={openEventModal}>
        <MdModeEditOutline size={30} />
      </motion.button>

      {/* Modal for editing announcement */}
      <AnimatePresence mode="wait">
        {edit && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: "0" }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3 }}
              ref={modalRef}
              className="relative bg-white p-6 rounded-2xl max-w-2xl w-full shadow-lg max-h-[70vh] overflow-y-auto border border-zinc-500"
            >
              {/* Modal Header */}
              <h3 className="text-xl text-zinc-900 mb-4 mt-2 text-left">Edit Announcement</h3>

              {/* Close Modal Button */}
              <div className="absolute top-4 right-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="text-lg text-blue-500 hover:text-zinc-200"
                  onClick={closeEventModal}
                >
                  Close
                </motion.button>
              </div>

              {/* Form for adding event */}
              <div className="mt-6 w-full border-t border-zinc-500 text-sm sm:text-md rounded-lg p-4">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                  {/* Content Field */}
                  <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Content</label>
                  <textarea
                    className="border border-zinc-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    placeholder="Announcement Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  ></textarea>

                  <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">End Date</label>
                  <input
                    type="date"
                    className="border border-zinc-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const date = new Date(e.target.value);
                      setEndDate(date);
                    }}
                    value={endDate ? endDate.toISOString().split('T')[0] : ''}
                  />

                  {loading ? (
                    // Loading spinner
                    <div className="flex justify-center items-center py-2">
                      <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    // Submit button
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out"
                    >
                      Submit
                    </motion.button>
                  )}
                </form>
              </div>
            </motion.div>
          </div >
        )}

      </AnimatePresence >

    </>
  );
}

export default EditAnnouncement;