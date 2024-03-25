import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Rectangle,
} from "recharts";

const ReactBarChart: React.FC<{ data: any; title: string }> = ({
  data,
  title,
}) => {
  return (
    <div className="w-full border-2 rounded-md">
      <h4 className="p-3">{title}</h4>
      <ResponsiveContainer height={300}>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="income"
            fill="#82ca9d"
            activeBar={<Rectangle fill="#D1C9ED" stroke="blue" />}
          />
          {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReactBarChart;
