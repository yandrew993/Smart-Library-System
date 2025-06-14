import React, { useContext, useEffect, useState } from "react";
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import apiRequest from "../../lib/apiRequest";
import Cookies from "js-cookie";
import { DarkModeContext } from "../../context/darkModeContext";

import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import { CircularProgress } from "@mui/material";

const Datatable = ({ columns, searchQueryProp }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1]; // Get "students", "books", or "bookings"
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const { darkMode } = useContext(DarkModeContext);
  const [popupData, setPopupData] = useState(null);

  const { data, loading, error } = useFetch(`/${path}`);
  const [list, setList] = useState([]);

  useEffect(() => {
    if (!data) {
      console.error(`Error: Data is null or undefined for path: ${path}`);
      return;
    }

    if (!Array.isArray(data)) {
      console.error(`Error: Data is not an array for path: ${path}`, data);
      return;
    }

    // Ensure `_id` is mapped to `id` for `DataGrid`
    const formattedData = data.map((item, index) => ({
      ...item,
      id: item.id || `temp-id-${index}`,
    }));

    setList(formattedData);
  }, [data, path]);

  useEffect(() => {
    if (searchQueryProp) {
      const filteredData = data?.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchQueryProp.toLowerCase())
        )
      );
      setList(filteredData || []);
    } else {
      setList(data || []);
    }
  }, [searchQueryProp, data]);

  const handleAssignedTo = async (teacherName) => {
    try {
      if (!teacherName) {
        console.error("Error: teacherName is undefined or invalid.");
        setPopupData([]);
        return;
      }

      let response;
      if (path === "teachers") {
        // Fetch subjects and classes assigned to the teacher
        response = await apiRequest.get(`/api/teachers/${teacherName}/subjects`);
        const responseData = Array.isArray(response.data)
          ? response.data
          : [response.data]; // Ensure data is an array
        setPopupData(responseData); // Set popup data
        console.log("Assigned subjects and classes data:", responseData);
      }
      setShowPopup(true); // Show the popup
    } catch (error) {
      console.error("Failed to fetch assigned data:", error);
      setPopupData([]); // Ensure popupData is cleared on error
    }
  };

  const assignedToColumn = {
    field: "assignedTo",
    headerName: "Assigned To",
    width: 150,
    renderCell: (params) => (
      <div className="cellAction">
        <button
          className={`viewButton ${darkMode ? "dark" : "light"}`}
          onClick={() => handleAssignedTo(params.row.teacherName)} // Pass teacherName
        >
          {path === "teachers" ? "Subjects" : "Assigned"}
        </button>
      </div>
    ),
  };

  const actionColumn = {
    field: "action",
    headerName: "Action",
    width: 150,
    renderCell: (params) => (
      <div className="cellAction">
        <button
          className={`viewButton ${darkMode ? "dark" : "light"}`}
          onClick={() => navigate(`/${path}/search/${params.row.id}`)}
        >
          View
        </button>
        <button
          className={`deleteButton ${darkMode ? "dark" : "light"}`}
          onClick={async () => {
            try {
              const token = Cookies.get("token");
              await apiRequest.delete(`/${path}/${params.row.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setList((prevList) =>
                prevList.filter((item) => item.id !== params.row.id)
              );
            } catch (err) {
              console.error("Failed to delete item:", err);
            }
          }}
        >
          Delete
        </button>
      </div>
    ),
  };

  const displayedColumns = columns.length > 5 ? columns.slice(0, 5) : columns;
  const gridColumns = [...displayedColumns, assignedToColumn, actionColumn];

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            backgroundColor: "#121212",
            color: "#ffffff",
          },
        },
      },
    },
  });

  const lightTheme = createTheme({
    palette: {
      mode: "light",
    },
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            backgroundColor: "#ffffff",
            color: "#000000",
          },
        },
      },
    },
  });

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <div className={`datatable ${darkMode ? "dark" : "light"}`}>
          <div className="datatableTitle">
            {path === "teachers"
              ? "Teachers"
              : path === "subjects"
              ? "Subjects"
              : "Classes"}
            <button className="link" onClick={() => navigate(`/${path}/new`)}>
              Add New
            </button>
          </div>

          <div className={`tableWrapper ${showPopup ? "blurred" : ""}`}>
            {loading ? (
              <div className="loadingContainer">
                <CircularProgress />
                <p>Loading data...</p>
              </div>
            ) : error ? (
              <div className="errorContainer">
                <p>Error fetching data: {error.message}</p>
              </div>
            ) : (
              <DataGrid
              className="datagrid"
              rows={list}
              columns={gridColumns}
              pageSize={9}
              rowsPerPageOptions={[9]}
              checkboxSelection
              autoHeight
              getRowId={(row) => row.id || row._id || row.teacherId || row.classId} // Specify the unique field
            />
            )}
          </div>

          {showPopup && (
            <div className="popup">
              <div className={`popupContent ${darkMode ? "dark" : "light"}`}>
                <h3>
                  {path === "teachers"
                    ? "Subjects Assigned to Teacher"
                    : "Student Assigned to Book"}
                </h3>
                <ul>
                  {popupData && popupData.length > 0 ? (
                    popupData.map((item, index) => (
                      <li key={index}>
                        {path === "teachers"
                          ? `${item.subjectName || "Unknown Subject"} - ${
                              item.className || "Unknown Class"
                            }`
                          : `${item.ClassName || "Unknown Name"} (${
                              item.studentId || "Unknown Class"
                            })`}
                      </li>
                    ))
                  ) : (
                    <p>No data available</p>
                  )}
                </ul>
                <button
                  className="closeButton"
                  onClick={() => setShowPopup(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default Datatable;
