import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface input {
  name: string;
  value: number | string;
  fill: string
}


/**
 * Takes title and data field and displays data in Donut chart.
 * data consists of list of a name, value, and fill color (hexadecimal)
 */
const DonutChart = ({
  title,
  data,
  height,
  width,
}: {
  title: string;
  data: input[];
  height?: number;
  width?: number
}) => {

  return (
    <div className="flex flex-col w-full h-full">
      <h1 className="flex w-full text-xl sm:text-2xl font-serif font-semibold text-start text-zinc-900 mb-4 px-15">
        {title}
      </h1>

      <ResponsiveContainer width={width ? `${width}%`: "100%"} height={height ? height : 300}>
        <PieChart
          accessibilityLayer={false}
        >
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            innerRadius={90}
          />
          <Tooltip />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DonutChart;