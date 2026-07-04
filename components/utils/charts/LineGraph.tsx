import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const LineGraph = ({
  title,
  data,
  category,
  metric,
  height,
  width,
}: {
  title: string;
  data: any[];
  category: string;
  metric: string;
  height?: number;
  width?: number
}) => {
  return (
    <div className="flex flex-col w-full h-full">
      <h1 className="flex w-full text-xl sm:text-2xl font-serif font-semibold text-start text-zinc-900 mb-4 px-15">
        {title}
      </h1>

      <ResponsiveContainer width={width ? `${width}%` : "100%"} height={height ? height : 300}>
        <LineChart data={data} accessibilityLayer={false}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={category} />
          <YAxis />
          <Tooltip />
          <Legend
          />

          <Line
            dataKey={metric}
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LineGraph;