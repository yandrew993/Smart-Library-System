import "./chart.scss";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useFetch from "../../hooks/useFetch";
import { useContext, useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { DarkModeContext } from "../../context/darkModeContext";

const Chart = ({ aspect, title }) => {
  const [chartData, setChartData] = useState([]);
  const { data, loading, error } = useFetch("/books/monthly/issued");
  const { darkMode } = useContext(DarkModeContext);

  console.log("Chart Data:", data); // Log the fetched data for debugging

  // Process the data once it's fetched
  useEffect(() => {
    if (data) {
      console.log("Raw API Data:", data); // Log raw API data
  
      // Process the data to chart-friendly format
      const formattedData = processChartData(data);
  
      console.log("Formatted Chart Data:", formattedData); // Log the formatted data for debugging
  
      setChartData(formattedData);
    }
  }, [data]);
  
  // Function to process the array of objects
  const processChartData = (data) => {
    return data.map(({ month, count }) => ({
      name: month, // Use the month directly as the name
      Total: count, // Use the count as Total
    }));
  };

  return (
    <div className={`chart ${darkMode ? "dark" : "light"}`}>
      <div className="title">{title}</div>
      {loading ? (
        <div className={`loading ${darkMode ? "dark" : "light"}`}>
          <CircularProgress />
        </div>
      ) : error ? (
        <div className={`error ${darkMode ? "dark" : "light"}`}>
          Error loading chart data
        </div>
      ) : (
        <ResponsiveContainer width="100%" aspect={aspect}>
          <AreaChart
            width={730}
            height={250}
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="gray" />
            <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="Total"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#total)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Chart;