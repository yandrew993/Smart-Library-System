import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import apiRequest from "../../lib/apiRequest";
import "./issueBook.scss";

function IssueBook() {
  const [bookId, setBookId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchBookTerm, setSearchBookTerm] = useState("");
  const [searchStudentTerm, setSearchStudentTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isBookDropdownOpen, setIsBookDropdownOpen] = useState(false);
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const bookDropdownRef = useRef(null);
  const studentDropdownRef = useRef(null);

  // Fetch books where available is true
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await apiRequest.get("/books/available");
        setBooks(res.data);
        setFilteredBooks(res.data); // Initialize filtered books
      } catch (err) {
        console.error("Failed to fetch books:", err);
        setError("Failed to load books.");
      }
    };
    fetchBooks();
  }, []);

  // Fetch all students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await apiRequest.get("/students");
        setStudents(res.data);
        setFilteredStudents(res.data); // Initialize filtered students
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setError("Failed to load students.");
      }
    };
    fetchStudents();
  }, []);

  // Filter books based on search term
  useEffect(() => {
    const filtered = books.filter((book) =>
      book.bookId.toUpperCase().includes(searchBookTerm.toUpperCase())
    );
    setFilteredBooks(filtered);
  }, [searchBookTerm, books]);

  // Filter students based on search term
  useEffect(() => {
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(searchStudentTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchStudentTerm, students]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    if (!bookId || !studentId) {
      setError("Please select both a book and a student.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiRequest.post("/books/issue", {
        bookId,
        studentId,
      });
      setSuccessMessage("Book issued successfully!");
      setBookId("");
      setStudentId("");
      setSelectedBook(null);
      setSelectedStudent(null);
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/books"); // Redirect to books page
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "An error occurred while issuing the book.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="issueBook">
      <Sidebar />
      <div className="issueBookContainer">
        <Navbar />
        <div className="issueBookPage">
          <div className="formContainer">
            <h2>Issue Book</h2>
            <form onSubmit={handleSubmit}>
              {/* Book Selection */}
              <div className="custom-select" ref={bookDropdownRef}>
                <div
                  className="select-header"
                  onClick={() => {
                    setIsBookDropdownOpen(!isBookDropdownOpen);
                    setIsStudentDropdownOpen(false); // Close student dropdown
                  }}
                >
                  {selectedBook
                    ? `${selectedBook.bookId}${selectedBook.title ? ` - ${selectedBook.title}` : ""}`
                    : "Select Book"}
                </div>
                {isBookDropdownOpen && (
                  <div className="select-dropdown">
                    <input
                      type="text"
                      placeholder="Search books..."
                      value={searchBookTerm}
                      onChange={(e) => setSearchBookTerm(e.target.value)}
                      autoFocus
                      className="search-input"
                    />
                    <div className="options-list">
                      {filteredBooks.length > 0 ? (
                        filteredBooks.map((book) => (
                          <div
                            key={book.id}
                            className="option"
                            onClick={() => {
                              setBookId(book.id);
                              setSelectedBook(book);
                              setIsBookDropdownOpen(false);
                              setSearchBookTerm("");
                            }}
                          >
                            {book.bookId}
                            {book.title ? ` - ${book.title}` : ""}
                          </div>
                        ))
                      ) : (
                        <div className="no-results">No books found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Student Selection */}
              <div className="custom-select" ref={studentDropdownRef}>
                <div
                  className="select-header"
                  onClick={() => {
                    setIsStudentDropdownOpen(!isStudentDropdownOpen);
                    setIsBookDropdownOpen(false); // Close book dropdown
                  }}
                >
                  {selectedStudent
                    ? `${selectedStudent.id}${selectedStudent.name ? ` - ${selectedStudent.name}` : ""}`
                    : "Select Student"}
                </div>
                {isStudentDropdownOpen && (
                  <div className="select-dropdown">
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchStudentTerm}
                      onChange={(e) => setSearchStudentTerm(e.target.value)}
                      autoFocus
                      className="search-input"
                    />
                    <div className="options-list">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <div
                            key={student.id}
                            className="option"
                            onClick={() => {
                              setStudentId(student.id);
                              setSelectedStudent(student);
                              setIsStudentDropdownOpen(false);
                              setSearchStudentTerm("");
                            }}
                          >
                            {student.studentId}
                            {student.name ? ` - ${student.name}` : ""}
                          </div>
                        ))
                      ) : (
                        <div className="no-results">No students found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? "Issuing..." : "Issue Book"}
                </button>
              </div>

              {/* Error and Success Messages */}
              {error && <p className="errorMessage">{error}</p>}
              {successMessage && <p className="successMessage">{successMessage}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IssueBook;