import React, { useState, useEffect } from "react";
import "./schoolTable.scss";
import apiRequest from "../../lib/apiRequest";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../navbar/Navbar";

const weekdaysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const ITEMS_PER_PAGE = 3;

const TimetablePage = () => {
  const [groupedTimetables, setGroupedTimetables] = useState([]);
  const [filteredTimetables, setFilteredTimetables] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        setLoading(true);
        const response = await apiRequest.get("/getentries");
        const entries = Array.isArray(response.data) ? response.data : [];

        const grouped = {};
        for (const entry of entries) {
          const className = entry.ClassName || "Unnamed Class";
          if (!grouped[className]) grouped[className] = [];
          grouped[className].push(entry);
        }

        const result = Object.entries(grouped)
          .map(([className, entries]) => ({ className, entries }))
          .sort((a, b) => {
            const aNum = parseInt(a.className.match(/\d+/)?.[0] || "0");
            const bNum = parseInt(b.className.match(/\d+/)?.[0] || "0");
            return aNum - bNum;
          });

        setGroupedTimetables(result);
        setFilteredTimetables(result);
      } catch (err) {
        console.error("Failed to load timetable:", err);
        setGroupedTimetables([]);
        setFilteredTimetables([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetables();
  }, []);

  // Filtering by search term
  useEffect(() => {
    const filtered = groupedTimetables.filter((group) =>
      group.className.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTimetables(filtered);
    setCurrentPage(1); // Reset to first page on new search
  }, [searchTerm, groupedTimetables]);

  const totalPages = Math.ceil(filteredTimetables.length / ITEMS_PER_PAGE);
  const currentData = filteredTimetables.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrint = () => {
    window.print();
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

          <div className="controls">
            <input
              type="text"
              placeholder="Search by class name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button onClick={handlePrint} className="print-button">
              🖨️ Print Timetable
            </button>
          </div>

          {loading ? (
            <p>Loading timetable...</p>
          ) : filteredTimetables.length === 0 ? (
            <p className="no-data">No timetable data found.</p>
          ) : (
            <div className="timetable-list">
              {currentData.map(({ className, entries }) => (
                <div key={className} className="class-timetable">
                  <h2>{className}</h2>

                  {weekdaysOrder.map((day) => {
                    const dayEntries = entries
                      .filter((e) => e.weekday === day)
                      .sort(
                        (a, b) => new Date(a.startTime) - new Date(b.startTime)
                      );

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
                            {Object.entries(
                              dayEntries.reduce((acc, entry) => {
                                const key = `${entry.startTime}-${entry.endTime}`;
                                if (!acc[key]) acc[key] = [];
                                acc[key].push(entry);
                                return acc;
                              }, {})
                            ).map(([timeKey, entriesAtSameTime], i) => {
                              const subjects = entriesAtSameTime
                                .map((e) => e.subjectName || "-")
                                .join("/");
                              const teachers = entriesAtSameTime
                                .map((e) => e.teacherName || "N/A")
                                .join("/");
                              const { startTime, endTime, isDouble } =
                                entriesAtSameTime[0];

                              return (
                                <tr key={i}>
                                  <td>{subjects}</td>
                                  <td>{teachers}</td>
                                  <td>
                                    {startTime
                                      ? new Date(startTime).toLocaleTimeString(
                                          [],
                                          {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          }
                                        )
                                      : "-"}
                                  </td>
                                  <td>
                                    {endTime
                                      ? new Date(endTime).toLocaleTimeString(
                                          [],
                                          {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          }
                                        )
                                      : "-"}
                                  </td>
                                  <td>{isDouble ? "Yes" : "No"}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ⬅️ Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next ➡️
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimetablePage;
