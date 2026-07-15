import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import DailyView from "./DailyView";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ReactSwitch from "react-switch";
import { Batch, compareDates, formatDate, getDateObject, Transaction, weekDays } from "@/components/global.utils";
import Day from "./Day";
import AccountingTable from "../accounting/AccountingTable";

/**
 * 
 * @param date Populate a list dates that occur in a month a given date,
 * starting from the first Sunday before the 1st day of the month.
 * The list will contain 45 days, which is enough to cover a month and a few extra days.
 * @returns 
 */
const renderMonth = (date: Date) => {
  const currentDate = new Date(date);

  // Start with the first day of the month
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

  // Get the first day of the month
  const firstDayOfMonth = startOfMonth.getDay();

  // Calculate the number of days to subtract to get to the previous Sunday
  const daysToSubtract = firstDayOfMonth === 0 ? 0 : firstDayOfMonth;  // If it's already Sunday, don't subtract any days

  // Calculate the starting date as the first Sunday before the 1st day of the month
  const startDate = new Date(startOfMonth);
  startDate.setDate(startOfMonth.getDate() - daysToSubtract);

  const days = [];

  // Get the total number of days in the current month
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  // Generate days until the end of the month
  for (let i = 0; i < 42; i++) {  // Maximum of 42 days, just in case it's needed
    const currentDay = new Date(startDate);
    currentDay.setDate(startDate.getDate() + i);

    // Stop if the current day exceeds the last day of the month
    if (currentDay.getDate() > daysInMonth && currentDay.getMonth() === currentDate.getMonth()) {
      break;
    }

    days.push(currentDay);
  }

  // Calculate the next Saturday after the last day in the month
  const lastDay = days[days.length - 1];
  const lastDayOfWeek = lastDay.getDay();  // Get the day of the week for the last day in the month
  const daysToSaturday = (6 - lastDayOfWeek + 7) % 7; // Days to the next Saturday

  // Add days to the next Saturday if needed
  for (let i = 1; i <= daysToSaturday; i++) {
    const nextDay = new Date(lastDay);
    nextDay.setDate(lastDay.getDate() + i);
    days.push(nextDay);
  }

  return days;
};

/**
 * Populate a list of dates that occur in a week a given date,
 * starting from the previous Sunday.
 * @param date 
 * @returns 
 */
const renderWeek = (date: Date) => {
  const currentDate = new Date(date); // Clone input date to avoid mutating it

  // Calculate the Sunday of the current week
  const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const startDate = new Date(currentDate);
  startDate.setDate(currentDate.getDate() - dayOfWeek); // Set to the previous Sunday (or same day if it's Sunday)

  const days = [];

  // Load in 7 dates including given date
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startDate); // Clone startDate
    currentDay.setDate(startDate.getDate() + i);
    days.push(currentDay);
  }

  return days;
};

const Calendar = ({
  batches,
  onClick
}: {
  batches: Batch[]
  onClick: (date: Date) => void
}) => {
  const currentDate = new Date();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [refresh, setRefresh] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [direction, setDirection] = useState<number>(0);
  const [visibleDays, setVisibleDays] = useState<Date[]>(renderMonth(currentDate));
  const [view, setView] = useState<boolean>(true);
  const [selectedBatches, setSelectedBatches] = useState(() => Object.values(
    batches.filter(batch => batch.date).reduce<Record<string, {
      date: Date | undefined;
      wineGross: number;
      liquorGross: number;
      gross: number;
      tax: number;
      void: number;
      cashTotal: number;
      creditTotal: number;
      discount: number;
      transactions: Transaction[],
      register: string,
      cardReceiptTotal: number;
    }>>((acc, batch) => {
      const date = (batch.date instanceof Date ? formatDate(batch.date, "mm/dd/yyyy") :
        batch.date ? formatDate(new Date(batch.date), "mm/dd/yyyy") : "") ?? "";
      if (!acc[date]) {
        acc[date] = {
          date: batch.date,
          wineGross: 0,
          liquorGross: 0,
          gross: 0,
          tax: 0,
          void: 0,
          cashTotal: 0,
          creditTotal: 0,
          transactions: [],
          register: "",
          discount: 0,
          cardReceiptTotal: 0,
        };
      }

      acc[date].wineGross += batch.wineGross ?? 0;
      acc[date].liquorGross += batch.liquorGross ?? 0;
      acc[date].gross += batch.gross ?? 0;
      acc[date].tax += batch.tax ?? 0;
      acc[date].void += batch.void ?? 0;
      acc[date].cashTotal += batch.cashTotal ?? 0;
      acc[date].creditTotal += batch.creditTotal ?? 0;
      acc[date].discount += batch.discount ?? 0;
      acc[date].cardReceiptTotal += batch.cardReceiptTotal ?? 0;

      return acc;
    }, {})
  ));
  const filteredBatches = useMemo(() =>
    Object.values(
      batches.filter((batch) => {
        if (!batch.date) return false;

        const batchDate = new Date(batch.date);

        if (startDate) {
          const startObject = getDateObject(startDate);
          const start = new Date(
            startObject.year,
            startObject.month,
            startObject.day
          );

          if (batchDate < start) return false;
        }

        if (endDate) {
          const endObject = getDateObject(endDate);
          const end = new Date(
            endObject.year,
            endObject.month,
            endObject.day
          );

          // Include the entire end day
          end.setHours(23, 59, 59, 999);

          if (batchDate > end) return false;
        }

        return true;
      }).reduce<Record<string, {
        date: Date | undefined;
        wineGross: number;
        liquorGross: number;
        gross: number;
        tax: number;
        void: number;
        cashTotal: number;
        creditTotal: number;
        discount: number;
        transactions: Transaction[],
        register: string,
        cardReceiptTotal: number;
      }>>((acc, batch) => {
        const date = (batch.date instanceof Date ? formatDate(batch.date, "mm/dd/yyyy") :
          batch.date ? formatDate(new Date(batch.date), "mm/dd/yyyy") : "") ?? "";
        if (!acc[date]) {
          acc[date] = {
            date: batch.date,
            wineGross: 0,
            liquorGross: 0,
            gross: 0,
            tax: 0,
            void: 0,
            cashTotal: 0,
            creditTotal: 0,
            transactions: [],
            register: "",
            discount: 0,
            cardReceiptTotal: 0,
          };
        }

        acc[date].wineGross += batch.wineGross ?? 0;
        acc[date].liquorGross += batch.liquorGross ?? 0;
        acc[date].gross += batch.gross ?? 0;
        acc[date].tax += batch.tax ?? 0;
        acc[date].void += batch.void ?? 0;
        acc[date].cashTotal += batch.cashTotal ?? 0;
        acc[date].creditTotal += batch.creditTotal ?? 0;
        acc[date].discount += batch.discount ?? 0;
        acc[date].cardReceiptTotal += batch.cardReceiptTotal ?? 0;

        return acc;
      }, {})
    ), [batches, startDate, endDate]);

  // Sets new selected event when date is dropped into daily view
  const handleDateDrop = (date: Date) => {
    setSelectedDate(date);
    setRefresh(!refresh);
  };

  // Handle click on a day
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    onClick(date); // Call the onClick function passed as a prop
  }

  // Handle view change between month/week/day
  const handleViewChange = (checked: boolean) => {
    setView(checked);
  };

  // Handle behavior next week/month bottoms
  const handleNextPrevChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Set month one back or forward upon click in the month view
    if (view) {
      if (event.currentTarget.value === "<") {
        setDirection(-1);
        setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)));
      }
      if (event.currentTarget.value === ">") {
        setDirection(1);
        setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)));
      }
    }

    // Set week one back or forward upon click in the week view
    if (!view) {
      if (event.currentTarget.value === "<") {
        setDirection(-1);
        setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 7)));
      }
      if (event.currentTarget.value === ">") {
        setDirection(1);
        setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 7)));
      }
    }
  }

  // Animation variants for the calendar grid
  const calendarVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    })
  };

  // Animation variants for the header
  const headerVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } }
  };

  // Animation variants for the days
  const dayVariants = {
    initial: { scale: 0.5, opacity: 0 },
    animate: (index: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: index * 0.01,
        duration: 0.3
      }
    }),
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.2 }
    }
  };

  // Render days based on the selected view
  useEffect(() => {
    if (view) {
      setVisibleDays(renderMonth(selectedDate));
    } else {
      setVisibleDays(renderWeek(selectedDate));
    }
  }, [view, selectedDate]);

  // Get the month and year string for the header
  const monthYearString = selectedDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="flex flex-col w-full h-full lg:flex-row items-start justify-center px-5 gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >

        {/* Calendar View */}
        <motion.div
          className="flex flex-col w-full h-full"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="flex flex-row w-full items-center justify-center text-center text-xl lg:text-2xl font-semibold text-zinc-700 gap-10 transition duration-200 ease-in-out"
            variants={headerVariants}
            initial="initial"
            animate="animate"
          >
            {/* previous and next month/week button */}
            <motion.button
              className="text-zinc-700 font-semibold hover:text-zinc-100 hover:bg-zinc-400 rounded-3xl"
              value={"<"}
              onClick={handleNextPrevChange}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiChevronLeft />
            </motion.button>

              <motion.div
                key={monthYearString}
                initial={{ opacity: 0, y: direction > 0 ? 20 : -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: direction > 0 ? -20 : 20 }}
                transition={{ duration: 0.3 }}
              >
                {monthYearString}
              </motion.div>

            {/* next month/week button */}
            <motion.button
              className="text-zinc-700 font-semibold hover:text-zinc-100 hover:bg-zinc-400 rounded-3xl"
              value={">"}
              onClick={handleNextPrevChange}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiChevronRight />
            </motion.button>
          </motion.div>

          <div className="flex flex-row items-end justify-end">
            {/* Toggle for selecting the view (month/week/day) */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ReactSwitch
                checked={view}
                onChange={handleViewChange}
                offColor="#71717a"
                onColor="#3b82f6"
                uncheckedIcon={<div className="flex px-1 text-white/60 text-md font-semibold">W</div>}
                checkedIcon={<div className="flex px-2 text-white/60 text-md font-semibold">M</div>}
                className="m-2"
              />
            </motion.div>
          </div>

          {/* Weekly/Monthly view */}
          <motion.div
            className="flex flex-col h-full w-full px-2 rounded-md border items-center bg-zinc-200 border-zinc-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="grid grid-cols-7 w-full gap-1 mb-2">
              {/* Generate the days of the week header */}
              {weekDays.map((day, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-center p-2 w-full text-xs lg:text-lg text-zinc-700 font-semibold"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                >
                  {day.abbr}
                </motion.div>
              ))}

                <motion.div
                  key={monthYearString + (view ? "month" : "week")}
                  custom={direction}
                  variants={calendarVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="col-span-7 grid grid-cols-7 gap-1 h-full"
                >
                  {/* Generate the days of the month/week */}
                  {visibleDays.map((date, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-center h-full w-full transition duration-200 ease-in-out"
                      custom={index}
                      variants={dayVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                    >
                      <Day
                        date={date}
                        selectedDate={selectedDate}
                        batches={batches.filter(batch => compareDates(date, new Date(batch.date ?? 0)))}
                        onClick={() => handleDateChange(date)}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  custom={direction}
                  variants={calendarVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="col-span-7 gap-1 h-full"
                >
                  <AccountingTable batches={filteredBatches} />
                </motion.div>

            </div>
          </motion.div>


        </motion.div>

        {/* Sidebar Filter Menu */}
        <div className="hidden lg:flex lg:flex-col gap-2 p-5 justify-start self-start sticky top-5 h-fit z-100">
          <div className="flex flex-col border-gray-400 border p-5 rounded w-full h-1/4 min-w-80 overflow-hidden">
            {/* Close filter */}
            <div className="flex w-full justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="text-md text-blue-500 hover:text-zinc-200"
              // onClick={handleClearClick}
              >
                Clear
              </motion.button>
            </div>
            {/* Title */}
            <h2 className="flex text-lg font-semibold text-zinc-900 mb-2">Data Filters</h2>

            {/* Filter Categories */}
            <div className="flex flex-col overflow-auto h-full space-y-2 pb-10">
              <div className="flex flex-col gap-2">
                <label htmlFor="start-date">Start Date:</label>
                <input
                  type="date"
                  className="border p-2 rounded-md z-100"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value)
                  }}
                // Native input value is always yyyy-mm-dd
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="start-date">End Date:</label>
                <input
                  type="date"
                  className="border p-2 rounded-md z-100"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value)
                  }}
                // Native input value is always yyyy-mm-dd
                />
              </div>
            </div>
          </div>

          {/* Daily view */}
          <motion.div
            className="flex flex-col w-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <DailyView
              onDateDrop={handleDateDrop}
              date={selectedDate}
              batches={batches.filter(batch => compareDates(selectedDate, new Date(batch.date ?? 0)))}
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Calendar;