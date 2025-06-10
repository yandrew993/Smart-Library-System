import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import apiRequest from "../../lib/apiRequest";
import { DarkModeContext } from "../../context/darkModeContext";
import "./newClass.scss";

function NewClass() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useContext(DarkModeContext); // Access dark mode state

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);
    setIsLoading(true);

    try {
      const res = await apiRequest.post("/addclass", {
        ClassName: inputs.ClassName,
        stream: inputs.stream,
        formLevel: parseInt(inputs.formLevel, 10)
        //bookId: inputs.bookId,
      });
      navigate("/classes"); // Redirect to subjects page after successful addition
    } catch (err) {
      console.log(err);
      setError(err.message || "An error occurred while adding the book.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`newBook ${darkMode ? "dark" : "light"}`}> {/* Apply dark mode class */}
      <Sidebar />
      <div className="newBookContainer">
        <Navbar />
        <div className="newBookPage">
          <div className="formContainer">
            <div className="wrapper">
              <button className="backButton" onClick={() => navigate(-1)}>
                ← Back
              </button>
              <form onSubmit={handleSubmit}>
                <div className="item">
                  <label htmlFor="title">Class Name</label>
                  <input id="title" name="ClassName" type="text" required />
                </div>
                <div className="item">
                  <label htmlFor="subject">Class Level</label>
                  <input id="subject" name="formLevel" type="text" required />
                </div>
                <div className="item">
                  <label htmlFor="bookId">Stream</label>
                  <input id="bookId" name="stream" type="text" required />
                </div>
                <button disabled={isLoading} className="sendButton" type="submit">
                  Add Class
                </button>
                {error && <span className="error">{error}</span>}
                {isLoading && <span className="loading">Adding ...</span>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewClass;