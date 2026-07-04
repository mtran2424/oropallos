/**
 * UI Card to display statistic
 * @param title string - Statcard title
 * @param value string - Statistic value
 * @param gradient string - Defines colors
 * @param columns string - Numerical string to adjust card width
 * @returns 
 */
const StatCard = ({
  title,
  value,
  gradient,
  columns,
}: {
  title: string;
  value: string;
  gradient: string;
  columns: string;
}) => {
  return (
    <div className={`flex flex-col col-span-${columns} border border-blue-400 rounded-xl h-full p-5
          ${gradient} shadow-lg text-white`}>
      <h2 className="text-left text-lg lg:text-xl">{title}</h2>
      <h2 className="text-left font-semibold text-xl lg:text-3xl">{value}</h2>
    </div>
  );
}

export default StatCard;