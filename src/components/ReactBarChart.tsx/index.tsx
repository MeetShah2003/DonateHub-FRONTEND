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

const ReactBarChart: React.FC<{ data: any }> = ({ data }) => {
  return (
    <ResponsiveContainer
      className={`border-2 rounded-lg p-2`}
      width="100%"
      height={300}
    >
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
        <XAxis dataKey="name" />
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
  );
};

export default ReactBarChart;
