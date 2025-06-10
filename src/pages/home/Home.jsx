import React from 'react';
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Teachercount from "../../components/teacherCountLesson/TeacherCountLesson";
// import Table from "../../components/table/Table";

const Home = () => {
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="featured">
        <div className="widgets">
          <Widget type="teacher" />
          <Widget type="subject" />
          <Widget type="class" />
          <Widget type="lesson" />
        </div>
        <div className="charts">
          <Featured />
          <Teachercount aspect={2 / 1} disableResizeObserver/>
          
          {/* <Chart title="Last 6 Months (Book Issueing)" aspect={2 / 1} disableResizeObserver/> */}
        </div>
        {/* <div className="listContainer">
          <div className="listTitle">Latest Transactions</div>
          <Table />
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
