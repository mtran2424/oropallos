import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

/**
 * Takes title and data field and displays data in Donut chart.
 * data consists of a name, value, and fill color (hexadecimal)
 * Unit describes whats being counted
 */
const SidewaysBarChart = ({
  title,
  data,
  nameKey,
  dataKey,
  height,
  width,
}: {
  title: string;
  data: any[];
  nameKey?: string;
  dataKey?: string;
  height?: number
  width?: number
}) => {

  return (
    <div className="flex flex-col w-full h-full">
      <h1 className="flex w-full text-xl sm:text-2xl font-serif font-semibold text-start text-zinc-900 mb-4 px-15">
        {title}
      </h1>

      <ResponsiveContainer width={width ? `${width}%` : "100%"} height={height ? height : 300}>
        <BarChart
          layout="vertical"
          data={data}
          accessibilityLayer={false}
        >
          <XAxis type="number" />
          <YAxis
            dataKey={nameKey ? nameKey : "name"} 
            type="category"
            width={200}
            fontSize={12}
          />
          <Tooltip />
          <Bar dataKey={dataKey ? dataKey : "value"} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SidewaysBarChart;