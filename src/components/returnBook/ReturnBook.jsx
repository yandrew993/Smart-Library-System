import React, { useState, useEffect, useRef } from "react";
import "./returnBook.scss";
import apiRequest from "../../lib/apiRequest";
import Sidebar from "../sidebar/Sidebar"; // Import Sidebar component
import Navbar from "../navbar/Navbar"; // Import Navbar component

const ReturnBook = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]); // State for filtered books
  const [searchBookTerm, setSearchBookTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isBookDropdownOpen, setIsBookDropdownOpen] = useState(false);
  const bookDropdownRef = useRef(null);

  // Fetch issued books
  useEffect(() => {
    const fetchIssuedBooks = async () => {
      try {
        setLoading(true);
        const response = await apiRequest.get("/books/issued");
        setIssuedBooks(response.data);
        console.log("Fetched issued books:", response.data);
        setFilteredBooks(response.data); // Initialize filteredBooks with all issued books
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch issued books.");
        setLoading(false);
      }
    };

    fetchIssuedBooks();
  }, []);

  // Filter books based on search term
  useEffect(() => {
    const filtered = issuedBooks.filter((book) =>
      book.book.bookId.toLowerCase().includes(searchBookTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchBookTerm, issuedBooks]);

  // Handle book return
  const handleReturnBook = async () => {
    if (!selectedBook) return;
  
    try {
      // Send a POST request to return the book
      const response = await apiRequest.post("/books/return", {
        issueId: selectedBook.id, // Pass the issueId from the selected book
      });
  
      // Notify the user of success
      alert("Book returned successfully!");
  
      // Update the issuedBooks and filteredBooks states
      setIssuedBooks((prev) =>
        prev.filter((item) => item.id !== selectedBook.id)
      );
      setFilteredBooks((prev) =>
        prev.filter((item) => item.id !== selectedBook.id)
      );
  
      // Clear the selected book
      setSelectedBook(null);
    } catch (err) {
      // Notify the user of failure
      alert(`Failed to return the book: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="returnBook">
      {/* Sidebar */}
      <Sidebar />

      <div className="returnBookContainer">
        {/* Navbar */}
        <Navbar />

        <div className="content">
          <h2>Return Book</h2>

          <form>
            {/* Book Selection */}
            <div className="custom-select" ref={bookDropdownRef}>
              <div
                className="select-header"
                onClick={() => {
                  setIsBookDropdownOpen(!isBookDropdownOpen);
                }}
              >
                {selectedBook
                  ? `${selectedBook.book.bookId}${
                      selectedBook.book.title ? ` - ${selectedBook.book.title}` : ""
                    }`
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
                          key={book.book.bookId}
                          className="option"
                          onClick={() => {
                            setSelectedBook(book);
                            setIsBookDropdownOpen(false);
                            setSearchBookTerm("");
                          }}
                        >
                          {book.book.bookId}
                          {book.book.title ? ` - ${book.book.title}` : ""}
                        </div>
                      ))
                    ) : (
                      <div className="no-results">No books found</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </form>

            {loading && <p className="loading">Loading issued books...</p>}

          {selectedBook && (
            <div className="bookDetails">
              <h3>Book Details</h3>
              <p>
                <strong>Book ID:</strong> {selectedBook.book.bookId}
              </p>
              <p>
                <strong>Title:</strong> {selectedBook.book.title}
              </p>
              <p>
                <strong>Subject:</strong> {selectedBook.book.subject}
              </p>
              
              <p>
                <strong>Assigned to:</strong> {selectedBook.student.name} (
                {selectedBook.student.studentId})
              </p>
              <p>
  <strong>Issued On:</strong> {new Date(selectedBook.issueDate).toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}
</p>
              <button className="returnButton" onClick={handleReturnBook}>
                Return Book
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnBook;