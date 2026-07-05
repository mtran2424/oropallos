import { useState } from "react";
import { compareDates, weekDays, formatDate, Batch } from "@/components/global.utils";
// import EventCard from "./EventCard";
import { motion } from "framer-motion";
// import { deleteEvent, updateEvent } from "../../api/calenderapi";
// import AddEvent from "../resourceComponents/AddEvent";
import { MdDelete } from "react-icons/md";
import BatchCard from "./BatchCard";

// import { getEventById } from "../../api/calenderapi";

const DailyView = ({ 
  date, 
  batches,
  onDateDrop
 }: {
  date: Date;
  batches: Batch[]
  onDateDrop: (date: Date) => void;
}) => {
  const [edit, setEdit] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const data = e.dataTransfer.getData("text/plain").split("_");
    if (data[0] === "date") {
      const newDate = new Date(data[1]);
      onDateDrop(newDate);
    }
    // else if (data[0] === "event" && events.filter(event => event._id === data[1]).length === 0) {
    //   getEventById(data[1]).then((eventData: event) => {
    //     const event = {
    //       name: eventData.name,
    //       location: eventData.location,
    //       timeStart: eventData.timeStart,
    //       timeEnd: eventData.timeEnd,
    //       meetingLink: eventData.meetingLink,
    //       description: eventData.description,
    //       date: formatDate(date),
    //     }
    //     updateEvent(data[1], event).then(() => {
    //       onEditEvent();
    //     });
    //   });
    // }
  };
  // const handleAddEvent = (event: event) => {
  //   onAddEvent(event);
  // }

  // const handleEditEvent = (event: event) => {
  //   onEditEvent(event);
  // }

  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={allowDrop}
      className="flex flex-col border-gray-400 border p-5 rounded h-full w-80"
    >

      {/* Current date display */}
      <div className="flex justify-center items-center text-xl font-semibold text-zinc-700 lg:text-2xl p-6">
        {weekDays[date.getDay()].day + ", " + date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
          day: "numeric",
        })}
      </div>
      {/* Batches list display */}
      <div className="flex flex-col z-10 p-2">

        <div className="flex flex-row items-center justify-between w-full mb-2">
          {/* Label for today's events */}
          <div className="flex px-3 text-md text-zinc-500 p-1">Today's Batches</div>
        </div>

        {/* List of events for the selected date */}
        {batches.length === 0 ?
          <div>
            <div className="flex flex-col items-center justify-center h-full w-full bg-zinc-200 rounded-lg border-t-2 border-zinc-300 p-4 text-center">
              <p className="text-md text-zinc-500">No batches for this date.</p>
            </div>
          </div>
          :
          <div className="relative mb-8 w-full border-t-2 rounded-lg h-[35vh] border-zinc-300 overflow-y-auto">
            {batches.map((batch, index) => (
              <div
                key={index}
                className="flex flex-col px-5 pt-2">
                <div className="relative">
                  <BatchCard
                    batch={batch}
                  />
                </div>
              </div>
            ))}

          </div>
        }
      </div>
    </div>
  );
}


export default DailyView;