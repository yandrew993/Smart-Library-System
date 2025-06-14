import React, { useState } from "react";
import "./timeTable.scss";
import apiRequest from "../../lib/apiRequest";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../navbar/Navbar";

const weekdaysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const TimetablePage = () => {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAndDisplayTimetable = async () => {
    try {
      setLoading(true);
      await apiRequest.delete("/deleteall");
      const response = await apiRequest.post("/generate");
      setTimetables(response.data.data || []);
    } catch (err) {
      console.error("Error fetching timetable:", err);
    } finally {
      setLoading(false);
    }
  };

  const sortByClassName = (a, b) => {
    const formA = parseInt(a.entries?.[0]?.ClassName.match(/\d+/)?.[0] || "0");
    const formB = parseInt(b.entries?.[0]?.ClassName.match(/\d+/)?.[0] || "0");
    return formA - formB;
  };

  return (
    <div className="timetable-page">
      <div className="sidebar">
        <Sidebar />
      </div>

      <div className="main-container">
        <div className="navbar">
          <Navbar />
        </div>

        <div className="content">
          <h1>📅 School Timetable</h1>

          <button onClick={fetchAndDisplayTimetable} disabled={loading}>
            {loading ? "Generating..." : "Generate Timetable"}
          </button>

          {timetables.length === 0 ? (
            <p className="no-data">
              No timetable available. Click the button to generate.
            </p>
          ) : (
            <div className="timetable-list">
              {timetables.sort(sortByClassName).map((t) => (
                <div key={t.id || JSON.stringify(t)} className="class-timetable">
                  <h2>{t.entries?.[0]?.ClassName || "Unnamed Class"}</h2>

                  {weekdaysOrder.map((day) => {
                    const dayEntries = t.entries
                      ?.filter((e) => e.weekday === day)
                      .sort(
                        (a, b) =>
                          new Date(a.startTime).getTime() -
                          new Date(b.startTime).getTime()
                      ) || [];

                    if (dayEntries.length === 0) return null;

                    return (
                      <div key={day} className="weekday-section">
                        <h3>{day}</h3>
                        <table>
                          <thead>
                            <tr>
                              <th>Subject</th>
                              <th>Teacher</th>
                              <th>Start Time</th>
                              <th>End Time</th>
                              <th>Double</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dayEntries.map((entry, i) => (
                              <tr key={`${entry.id || i}`}>
                                <td>{entry.subjectName}</td>
                                <td>{entry.teacherName}</td>
                                <td>
                                  {new Date(entry.startTime).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" }
                                  )}
                                </td>
                                <td>
                                  {new Date(entry.endTime).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" }
                                  )}
                                </td>
                                <td>{entry.isDouble ? "Yes" : "No"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimetablePage;
