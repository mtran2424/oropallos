import { useState } from "react";
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { HiDotsHorizontal } from "react-icons/hi";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";

/**
 * Takes title and data field and displays data in Donut chart.
 * data consists of list of a name, value, and fill color (hexadecimal)
 */
const DonutChart = ({
  title,
  data,
  height,
  width,
  nameKey,
  dataKey,
  format,
}: {
  title: string;
  data: any[];
  height?: number;
  width?: number;
  nameKey?: string;
  dataKey?: string;
  format?: boolean;
}) => {
  const [legend, setLegend] = useState<boolean>(false)

  const toggleLegend = () => {
    setLegend(prev => !prev)
  }
  return (
    <div className="flex flex-col w-full h-full">
      <h1 className="flex w-full text-xl sm:text-2xl font-serif font-semibold text-start text-zinc-900 mb-4 px-15">
        {title}
      </h1>

      <div className="flex z-100">
        {legend ? (
          <motion.div
            key={"close"}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => toggleLegend()}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="hover:text-[#FFBA04]"
          >
            <IoMdClose size={20} />
          </motion.div>
        ) : (
          <motion.div
            key={"fullscreen"}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            onClick={() => toggleLegend()}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="hover:text-[#FFBA04]"
          >
            <HiDotsHorizontal size={20} />
          </motion.div>
        )}
      </div>

      <ResponsiveContainer width={width ? `${width}%` : "100%"} height={height ? height : 300}>
        <PieChart
          accessibilityLayer={false}
        >
          <Pie
            data={data}
            dataKey={dataKey ? dataKey : "value"}
            nameKey={nameKey ? nameKey : "name"}
            outerRadius={120}
            innerRadius={90}
          />
          {format ?
            <Tooltip
              formatter={(value) => (Number(value) / 100).toFixed(2)}
            /> :
            <Tooltip
            />
          }
          {legend && <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"

          />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DonutChart;