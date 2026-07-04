import { useState, useMemo, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";
import { deleteAnnouncement, getAnnouncements } from "@/app/api/announcementapi";
import { Announcement, announcementTableColumns, getDateObject, sanitize } from "@/components/global.utils";
import CopyButton from "@/components/ui/CopyButton";
import SearchBar from "@/components/ui/SearchBar";
import Pagination from "@/components/ui/Pagination";
import AddAnnouncement from "@/components/utils/AddAnnouncement";
import EditAnnouncement from "@/components/utils/EditAnnouncement";

const ANNOUNCEMENTS_PER_PAGE = 25;

// This component is responsible for crud operations on announcements
const AnnouncementsSpreadsheet = ({ initialAnnouncements }: { initialAnnouncements: Announcement[] }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest-oldest");
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [refresh, setRefresh] = useState(false);
  const announcementsRef = useRef<HTMLTableElement | null>(null);

  // Apply filters, seach terms, and sorting
  const sortedAndFilteredAnnouncements = useMemo(() => {
    const term = searchTerm.toLowerCase();

    const filtered = announcements.filter((announcement) =>
      [announcement.content]
        .filter(Boolean)
        .some((field) => sanitize(field).includes(sanitize(term)))
    );

    // Choose sorting method
    const sorted = [...filtered];

    switch (sortOption) {
      case "content-asc":
        sorted.sort((a, b) => a.content.localeCompare(b.content));
        break;
      case "content-desc":
        sorted.sort((a, b) => b.content.localeCompare(a.content));
        break;
      case "oldest-newest":
        sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateA.getTime() - dateB.getTime();
        });
        break;
      case "newest-oldest":
        sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
        break;
    }

    return sorted;
  }, [announcements, searchTerm, sortOption]);

  // Handlers for search and sort
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  // For pagination
  const totalPages = Math.ceil(sortedAndFilteredAnnouncements.length / ANNOUNCEMENTS_PER_PAGE);
  const startIdx = (currentPage - 1) * ANNOUNCEMENTS_PER_PAGE;
  const endIdx = Math.min(startIdx + ANNOUNCEMENTS_PER_PAGE, sortedAndFilteredAnnouncements.length);
  const currentAnnouncements = sortedAndFilteredAnnouncements.slice(startIdx, endIdx);

  // Refresh announcement list when a new announcement is added
  const handleAddAnnouncement = () => {
    setRefresh(!refresh);
  }

  // Refresh announcement list when an announcement is edited
  const handleEditAnnouncement = () => {
    setRefresh(!refresh);
  }

  // Send a delete request to the server to remove the announcement and refresh the list
  const handleDeleteAnnouncement = async (id: string) => {
    try {
      // Call the delete function from announcementApi
      await deleteAnnouncement(id)
        .then((res) => {
          if (res.status === 200) {
            toast.success('Announcement deleted successfully');
            setRefresh(!refresh);
          }
          else {
            console.error('Failed to delete announcement');
          }
        });

    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Failed to delete announcement');
    }
  };

  // Function to render each cell based on the column type
  const renderCell = (announcement: Announcement, column: keyof Announcement) => {
    switch (column) {
      case "id":
        return announcement.id;
      case "content":
        // Render content as a textarea with copy button
        return (
          <div
            className="flex flex-col items-center justify-center space-y-2"
          >
            <textarea
              readOnly
              className="w-full h-22.5 border border-zinc-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={announcement.content}
            ></textarea>
            {announcement.content && <CopyButton text={announcement.content} />}
          </div>)
      case "endDate":
        // Render end date as a formatted date string
        return (
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-sm text-zinc-600">
              {new Date(getDateObject(announcement.endDate).year, getDateObject(announcement.endDate).month, getDateObject(announcement.endDate).day).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  // Fetch announcements on component mount and when refresh state changes
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements();
        setAnnouncements(data.announcements || []);
      } catch (error) {
        console.error('Failed to fetch announcements', error);
      }
    };

    fetchAnnouncements();
  }, [refresh]);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Scroll to products grid on pagination/search/sort change
  useEffect(() => {
    announcementsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentPage, searchTerm, sortOption]);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="flex flex-col w-screen items-center justify-start">
      <div className="flex flex-col mb-3 space-y-4">

        {/* Header */}
        <h1 className="text-2xl font-semibold text-zinc-900">Announcements</h1>

        {/* Search Bar Component */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearchChange={handleSearchChange}
        />

        <div className="flex flex-row w-full whitespace-nowrap">
          <AddAnnouncement onAddAnnouncement={handleAddAnnouncement} />

          {/* Sort Dropdown */}
          <div className="flex justify-end w-full">
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="newest-oldest">Date (Newest → Oldest)</option>
              <option value="oldest-newest">Date (Oldest → Newest)</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex max-w-[95vw] max-h-[65vh] overflow-hidden rounded-md shadow-md border border-zinc-400 text-zinc-800">

          {/* Spreadsheet */}
          <div className="flex overflow-auto w-screen">

            {/* Announcement Table Start */}
            <table className="w-full divide-y divide-zinc-400" style={{ minWidth: "2000px" }} ref={announcementsRef}>
              {/* Table Headers */}
              <thead className="sticky top-0 bg-white z-20">
                <tr>
                  {announcementTableColumns.map((column) => (
                    <th
                      key={column.field}
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest whitespace-nowrap"
                      style={{ width: column.width }}
                    >
                      <strong>{column.label}</strong>
                    </th>
                  ))}

                  <th
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest whitespace-nowrap"
                    style={{ width: "300px" }}
                  >
                    <strong>Actions</strong>
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-zinc-400">
                {currentAnnouncements.length > 0 ? (
                  currentAnnouncements.map((announcement) => (
                    <tr key={announcement.id} className="hover:bg-zinc-200 transition duration-200">
                      {announcementTableColumns.map((column) => (
                        // Render each cell based on the column field
                        <td
                          key={column.field}
                          className="px-4 py-3 text-sm align-center"
                          style={{
                            width: column.width,
                            maxWidth: column.width,
                            whiteSpace: "pre-line",
                          }}
                        >
                          {renderCell(announcement, column.field as keyof Announcement)}
                        </td>
                      ))}

                      {/* Actions Column */}
                      <td
                        className="px-4 py-3 text-sm align-center"
                        style={{
                          width: "300px",
                          maxWidth: "300px",
                          whiteSpace: "pre-line",
                        }}
                      >
                        <div className="flex flex-row">
                          {/* Remove Announcement Button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-center text-red-500 hover:text-red-400"
                            onClick={() => handleDeleteAnnouncement(announcement.id || "")}
                          >
                            <MdDelete size={30} />
                          </motion.button>

                          {/* Edit Announcement Button */}
                          <EditAnnouncement onEditAnnouncement={handleEditAnnouncement} announcement={announcement} />

                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  // No announcements available message
                  <tr>
                    <td colSpan={announcementTableColumns.length} className="text-center py-4 text-zinc-900">
                      No announcements match selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions for scrolling and edit mode */}
        <div className="mt-2 text-xs text-zinc-900 italic">
          <span>Scroll horizontally to view all columns →</span>
        </div>

      </div>

      {/* Pagination Section */}
      <div className="flex flex-col items-center justify-center w-full font-serif">
        {/* Showing Count */}
        <p className="text-md font-semibold mb-2 text-zinc-500">
          Showing {endIdx} of {sortedAndFilteredAnnouncements.length} Announcements
        </p>

        {/* Pagination */}
        <Pagination
          prevClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          nextClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          currentPage={currentPage}
          totalPages={totalPages}
        />

      </div>
    </div>
  );
}

export default AnnouncementsSpreadsheet;