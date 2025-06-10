import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import useFetch from "../../hooks/useFetch";
import { useState } from "react";

const Featured = () => {
  // Fetch total payments
  const { data: totalData, loading: totalLoading, error: totalError } = useFetch('/books/total/issued');
  
  // Fetch payment stats
  const { data: statsData, loading: statsLoading, error: statsError } = useFetch('/books/total/issued');
  console.log("Stats Data:", statsData);
  // State for the target amount (could be stored in backend or set here)
  const [target] = useState(50); // Set your target amount (e.g., 50,000)
  const totalDataValue = totalData?.totalIssued || 0; // Adjust based on your API response structure
  const getBooksLabel = (totalDataValue) => {
    if (totalDataValue < 1) return "None";
    if (totalDataValue === 1) return "book";
    return "books";
  };
  const statsAmount = statsData?.totalIssued || 0; // Adjust based on your API response structure
  // Calculate percentage of target achieved
  const percentageOfTarget = totalDataValue ? Math.round((totalDataValue / target) * 100) : 0;
  
  // Format currency values
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "Loading...";
    
    // Format to show "k" for thousands
    if (amount >= 1000) {
      return `Ksh. ${(amount / 1000).toFixed(1)}k`;
    }
    return `Ksh. ${amount}`;
  };

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Books Issued</h1>
        <MoreVertIcon fontSize="small" />
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CircularProgressbar 
            value={percentageOfTarget > 100 ? 100 : percentageOfTarget} 
            text={`${percentageOfTarget}%`} 
            strokeWidth={5} 
          />
        </div>
        <p className="title">Total books Issued</p>
        <p className="amount">
  {totalLoading
    ? "Loading..."
    : totalError
    ? "Error loading data"
    : `${totalDataValue} ${getBooksLabel(totalDataValue)}`}
</p>
        <p className="desc">
          Previous transactions processing. Last payments may not be included.
        </p>
        <div className="summary">
          <div className="item">
            <div className="itemTitle">Target</div>
            <div className="itemResult negative">
              <KeyboardArrowDownIcon fontSize="small" />
              <div className="resultAmount">
                {formatCurrency(target)}
              </div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Last Week</div>
            <div className="itemResult positive">
              {statsLoading ? (
                "Loading..."
              ) : statsError ? (
                "Error"
              ) : (
                <>
                  {statsAmount?.weeklyChange >= 0 ? (
                    <KeyboardArrowUpOutlinedIcon fontSize="small" />
                  ) : (
                    <KeyboardArrowDownIcon fontSize="small" />
                  )}
                  <div className="resultAmount">
                    {formatCurrency(statsAmount?.weeklyAmount)}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Last Month</div>
              <div className={`itemResult ${statsAmount?.percentChange >= 0 ? "positive" : "negative"}`}>
                {statsLoading ? (
                  "Loading..."
                ) : statsError ? (
                  "Error"
                ) : (
                  <>
                    {statsAmount?.percentChange >= 0 ? (
                      <KeyboardArrowUpOutlinedIcon fontSize="small" />
                    ) : (
                      <KeyboardArrowDownIcon fontSize="small" />
                    )}
                    <div className="resultAmount">
                      {formatCurrency(statsAmount?.newAmount)}
                    </div>
                  </>
                )}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;