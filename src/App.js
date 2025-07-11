import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { bookingColumns, postColumns, userColumns, postDetailColumns } from "./datatablesource";
import NewHotel from "./components/newHotel/NewHotel";
import SingleHouse from "./pages/singleHouse/SingleHouse";
//import Payment from "./pages/payments/Payment";
import Profile from "./pages/profile/Profile";
import Booking from "./pages/booking/Booking";
import IssueBook from "./components/issueBook/IssueBook";
import NewClass from "./components/newClass/NewClass";
import NewTeacher from "./components/newTeacher/NewTeacher";
import Teachercount from "./components/teacherCountLesson/TeacherCountLesson";
import TimetablePage from "./components/timeTable/Timetable";
import SchoolTablePage from "./components/schoolTable/SchoolTable";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Publicly Accessible Routes */}
          <Route path="/" element={<Home />} />
          <Route path="teachers">
            <Route index element={<List columns={userColumns} />} />
            <Route path="search/:Id" element={<Single />} />
            <Route path="new" element={<NewTeacher />} />
          </Route>
          <Route path="subjects">
            <Route index element={<List columns={postColumns} />} />
            <Route path="search/:Id" element={<SingleHouse />} />
            <Route path="new" element={<NewHotel />} />
            <Route path="new" element={<Teachercount />} />
          </Route>
          <Route path="bookings">
            <Route index element={<List columns={bookingColumns} />} />
            <Route path="search/:Id" element={<Booking />} />
          </Route>
          <Route path="assignteacher">
            <Route index element={<IssueBook />} />
          </Route>
          <Route path="timetable">
            <Route index element={<TimetablePage />} />
          </Route>
          <Route path="viewtimetable">
            <Route index element={<SchoolTablePage />} />
          </Route>
          <Route path="classes">
            <Route index element={<List columns={postDetailColumns} />} />
            <Route path="search/:Id" element={<SingleHouse />} />
            <Route path="new" element={<NewClass />} />
          </Route>
          <Route path="profile">
            <Route index element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;