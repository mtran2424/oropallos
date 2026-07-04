import { motion, useAnimation } from "framer-motion";
import { compareDates, formatDate } from "@/components/global.utils";
import { useState } from "react";

const Day = ({ date, selectedDate, onClick }: {
  date: Date;
  selectedDate: Date;
  onClick: () => void;
}) => {
  const currentDate = new Date();

  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);

  // Handle dragging a day cell
  const handleDragDayStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", `date_${date.toString()}`);
    setIsDragging(true);
    controls.start({ scale: 1.1, boxShadow: '0px 8px 20px rgba(0,0,0,0.2)' });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    controls.start({ x: 0, y: 0, scale: 1, boxShadow: '0px 0px 0px rgba(0,0,0,0)' });
  };


  // Handle dropping an event on a date
  // const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  //   const data = e.dataTransfer.getData("text/plain").split("_");
  //   if (data[0] === "event" && events.filter(event => event._id === data[1]).length === 0) {
  //     getEventById(data[1]).then((eventData: event) => {
  //       const event = {
  //         name: eventData.name,
  //         location: eventData.location,
  //         timeStart: eventData.timeStart,
  //         timeEnd: eventData.timeEnd,
  //         meetingLink: eventData.meetingLink,
  //         description: eventData.description,
  //         date: formatDate(date),
  //       }
  //       updateEvent(data[1], event).then(() => {
  //         onEditEvent(undefined, date);
  //       });
  //     });
  //   }
  // }

  // const handleDragEventStart = (e: React.DragEvent<HTMLDivElement>, event: event) => {
  //   e.dataTransfer.setData("text/plain", `event_${event._id}`);
  //   setIsDragging(true);
  //   controls.start({ scale: 1.1, boxShadow: '0px 8px 20px rgba(0,0,0,0.2)' });
  // };

  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <motion.div
      draggable
      // onDrop={handleDrop}
      onDragOver={allowDrop}
      onDragStartCapture={handleDragDayStart}
      onDragEndCapture={handleDragEnd}
      animate={controls}
      onClick={onClick}
      // Background color is determined by whether the date is in the selected month or not
      className={
        `flex flex-col items-start justify-start h-full w-full border border-zinc-300 rounded-sm shadow-xs 
        ${selectedDate.getMonth() === date.getMonth() ?
          `bg-white hover:bg-zinc-100` :
          `bg-zinc-400 gap-2 hover:bg-zinc-300`
        } 
        gap-2 p-1
        ${isDragging ? 'cursor-grabbing' : 'cursor-default'}`
      }
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {<div
        // Background color is determined by whether the date is today or selected date
        className={
          `relative text-left px-2 font-semibold rounded-2xl text-xs lg:text-lg
            ${compareDates(date, currentDate) ?
            `bg-blue-500 text-white hover:bg-blue-300` :
            compareDates(date, selectedDate) ?
              `bg-zinc-500 text-white hover:bg-zinc-300` :
              `text-zinc-700`
          }
          transition duration-200 ease-in-out`
        }
      >
        {date.getDate()}
      </div>}

      {/* Display the number of events on the day cell. If greater than 3, generalize */}
      {/* {events.length < 3 ?
        <div className="flex flex-col w-full">
          {events.map((event, index) => (
            <motion.div
              draggable
              onDragStartCapture={(e) => handleDragEventStart(e, event)}
              onDragEndCapture={handleDragEnd}
              animate={controls}
              key={index}
              className="bg-blue-300 hover:bg-blue-500 text-blue-500 hover:text-white hover:font-semibold rounded-md shadow-md mb-1 w-full text-center text-xs lg:text-lg border border-blue-300 transition duration-200 ease-in-out overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {event.name}
            </motion.div>
          ))}
        </div>
        :
        <div
          className="bg-red-300 hover:bg-red-500 text-red-500 hover:text-white hover:font-semibold rounded-md shadow-md mb-1 w-full text-center text-xs lg:text-lg border border-red-300 transition duration-200 ease-in-out overflow-hidden">
          {events.length}+ events
        </div>
      } */}

    </motion.div>
  )
}

export default Day;