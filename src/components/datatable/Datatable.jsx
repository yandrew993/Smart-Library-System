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
  const path = location.pathname.split("/")[1];
  const navigate = useNavigate();
  const { darkMode } = useContext(DarkModeContext);

  const [list, setList] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState(null);

  const { data, loading, error } = useFetch(`/api/${path}`);

  // Format and validate fetched data
  useEffect(() => {
    if (!data || !Array.isArray(data)) {
      console.error(`Invalid data for path "${path}":`, data);
      return;
    }

    const formatted = data.map((item, index) => ({
      ...item,
      id: item.id || item._id || item.teacherId || item.classId || `temp-${index}`,
    }));

    setList(formatted);
  }, [data, path]);

  // Filter list based on search input
  useEffect(() => {
    if (searchQueryProp && Array.isArray(data)) {
      const filtered = data.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchQueryProp.toLowerCase())
        )
      );
      setList(filtered);
    } else if (Array.isArray(data)) {
      setList(data);
    }
  }, [searchQueryProp, data]);

  // Fetch assigned data (e.g., teacher's subjects)
  const handleAssignedTo = async (teacherName) => {
    try {
      if (!teacherName) {
        console.error("teacherName is missing.");
        setPopupData([]);
        return;
      }

      const response = await apiRequest.get(`/api/teachers/${teacherName}/subjects`);
      const responseData = Array.isArray(response.data) ? response.data : [response.data];
      setPopupData(responseData);
      setShowPopup(true);
    } catch (err) {
      console.error("Error fetching assigned data:", err);
      setPopupData([]);
    }
  };

  // Custom column for AssignedTo button
  const assignedToColumn = {
    field: "assignedTo",
    headerName: "Assigned To",
    width: 150,
    renderCell: (params) => (
      <div className="cellAction">
        <button
          className={`viewButton ${darkMode ? "dark" : "light"}`}
          onClick={() => handleAssignedTo(params.row.teacherName)}
        >
          {path === "teachers" ? "Subjects" : "Assigned"}
        </button>
      </div>
    ),
  };

  // Custom column for Actions (View/Delete)
  const actionColumn = {
    field: "action",
    headerName: "Action",
    width: 150,
    renderCell: (params) => (
      <div className="cellAction">
        <button
          className={`viewButton ${darkMode ? "dark" : "light"}`}
          onClick={() => navigate(`/api/${path}/search/${params.row.id}`)}
        >
          View
        </button>
        <button
          className={`deleteButton ${darkMode ? "dark" : "light"}`}
          onClick={async () => {
            try {
              const token = Cookies.get("token");
              await apiRequest.delete(`/api/${path}/${params.row.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setList((prev) => prev.filter((item) => item.id !== params.row.id));
            } catch (err) {
              console.error("Delete failed:", err);
            }
          }}
        >
          Delete
        </button>
      </div>
    ),
  };

  const theme = createTheme({
    palette: { mode: darkMode ? "dark" : "light" },
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? "#121212" : "#fff",
            color: darkMode ? "#fff" : "#000",
          },
        },
      },
    },
  });

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <div className={`datatable ${darkMode ? "dark" : "light"}`}>
          <div className="datatableTitle">
            {path === "teachers"
              ? "Teachers"
              : path === "subjects"
              ? "Subjects"
              : "Classes"}
            <button className="link" onClick={() => navigate(`/api/${path}/new`)}>
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
                <p>Error: {error.message}</p>
              </div>
            ) : (
              <DataGrid
                className="datagrid"
                rows={list}
                columns={[
                  ...columns.slice(0, 5),
                  assignedToColumn,
                  actionColumn,
                ]}
                pageSize={9}
                rowsPerPageOptions={[9]}
                checkboxSelection
                autoHeight
                getRowId={(row) =>
                  row.id || row._id || row.teacherId || row.classId
                }
              />
            )}
          </div>

          {showPopup && (
            <div className="popup">
              <div className={`popupContent ${darkMode ? "dark" : "light"}`}>
                <h3>
                  {path === "teachers"
                    ? "Subjects Assigned to Teacher"
                    : "Assigned Details"}
                </h3>
                <ul>
                  {popupData?.length > 0 ? (
                    popupData.map((item, idx) => (
                      <li key={idx}>
                        {path === "teachers"
                          ? `${item.subjectName || "Unknown"} - ${
                              item.className || "Unknown"
                            }`
                          : `${item.ClassName || "Unknown"} (${item.studentId || "N/A"})`}
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
