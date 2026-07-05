import { weekDays, to12HourTime, Batch, formatDate, formatTime } from "@/components/global.utils"

const BatchCard = ({
  batch
}: {
    batch: Batch
  }) => {

  return (
    <div className="flex flex-col relative bg-white rounded-md border border-zinc-300 p-6 w-full shadow-xs text-left hover:shadow-lg transition duration-300 ease-in-out mb-4">

      {/* Batch */}
      <h3 className="text-md lg:text-xl font-semibold text-zinc-700 whitespace-normal py-2">
        {batch.register} - {batch.date instanceof Date ? formatDate(batch.date, "mm/dd/yyyy") + " " + formatTime(batch.date) :
                  batch.date ? formatDate(new Date(batch.date), "mm/dd/yyyy") + " " + formatTime(new Date(batch.date)) : ""}
      </h3>

      {/* batch details */}
      <span className="text-md text-zinc-500">Gross: {`$${(batch.gross / 100).toFixed(2)}`}</span>
      <span className="text-md text-zinc-500">Wine: {`$${(batch.wineGross / 100).toFixed(2)}`}</span>
      <span className="text-md text-zinc-500">Liquor: {`$${(batch.liquorGross / 100).toFixed(2)}`}</span>
      <span className="text-md text-zinc-500">Sales Tax: {`$${(batch.tax / 100).toFixed(2)}`}</span>

    </div>
  );
};

export default BatchCard;