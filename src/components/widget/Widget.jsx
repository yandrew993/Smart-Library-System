import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SubjectOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import useFetch from "../../hooks/useFetch";
import { Link } from "react-router-dom";

const Widget = ({ type }) => {
  let data;

  const apiUrl =
    type === "teacher"
      ? "/teacherscount"
      : type === "subject"
      ? "/subjectscount"
      : type === "class"
      ? "/classescount"
      : type === "lesson"
      ? "/lessoncount"
      : null;

  const statsUrl =
    type === "teacher"
      ? "/teacherscount"
      : type === "subject"
      ? "/subjectscount"
      : type === "class"
      ? "/classescount"
      : type === "lesson"
      ? "/lessoncount"
      : null;

  const { data: apiData, loading, error } = useFetch(apiUrl);
  const { data: statsData, loading: statsLoading, error: statsError } = useFetch(statsUrl);

  const percentChange = statsData?.percentChange || 0;
  const isPositive = percentChange >= 0;

  // Extract the specific value from the API response
  const totalValue = apiData?.totalTeachers || apiData?.totalSubjects || apiData?.totalClasses || apiData?.totalLessons || apiData?.totalStudentsWithBooks || 0;

  switch (type) {
    case "teacher":
      data = {
        title: "TEACHERS",
        isMoney: false,
        link: (
          <Link to="/teachers" style={{ textDecoration: "none", color: "blue" }}>
            See all teachers
          </Link>
        ),
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "subject":
      data = {
        title: "SUBJECTS",
        isMoney: false,
        link: (
          <Link to="/subjects" style={{ textDecoration: "none", color: "blue" }}>
            See all subjects
          </Link>
        ),
        icon: (
          <SubjectOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    case "class":
      data = {
        title: "CLASSES",
        isMoney: false,
        link: (
          <Link to="/classes" style={{ textDecoration: "none", color: "blue" }}>
            View all classes
          </Link>
        ),
        icon: (
          <ApartmentOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "lesson":
      data = {
        title: "TOTAL LESSONS",
        isMoney: false,
        link: (
          <Link to="/books" style={{ textDecoration: "none", color: "blue" }}>
            View all books
          </Link>
        ),
        icon: (
          <ClassOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;

    default:
      return null;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {loading ? "Loading..." : error ? "Error" : totalValue}
        </span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className={`percentage ${isPositive ? "positive" : "negative"}`}>
          {isPositive ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          {statsLoading ? "..." : statsError ? "N/A" : `${Math.abs(percentChange)}%`}
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;