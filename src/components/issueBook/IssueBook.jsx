import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import apiRequest from "../../lib/apiRequest";
import "./issueBook.scss";

function IssueBook() {
  const [subjectCode, setSubjectCode] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [className, setClassName] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchClassTerm, setSearchClassTerm] = useState("");
  const [searchSubjectTerm, setSearchSubjectTerm] = useState("");
  const [searchTeacherTerm, setSearchTeacherTerm] = useState("");
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [isBookDropdownOpen, setIsBookDropdownOpen] = useState(false);
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const bookDropdownRef = useRef(null);
  const studentDropdownRef = useRef(null);
  const classDropdownRef = useRef(null);

  // Fetch all subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await apiRequest.get("/subjects");
        setSubjects(res.data);
        setFilteredSubjects(res.data); // Initialize filtered subjects
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
        setError("Failed to load subjects.");
      }
    };
    fetchSubjects();
  }, []);

  // Fetch all teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await apiRequest.get("/teachers");
        setTeachers(res.data);
        setFilteredTeachers(res.data); // Initialize filtered teachers
      } catch (err) {
        console.error("Failed to fetch teachers:", err);
        setError("Failed to load teachers.");
      }
    };
    fetchTeachers();
  }, []);

  // Fetch all classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await apiRequest.get("/classes");
        setClasses(res.data);
        setFilteredClasses(res.data); // Initialize filtered classes
      } catch (err) {
        console.error("Failed to fetch classes:", err);
        setError("Failed to load classes.");
      }
    };
    fetchClasses();
  }, []);

  // Filter subjects based on search term
  useEffect(() => {
    const filtered = subjects.filter(
      (subject) =>
        subject.code.includes(searchSubjectTerm) ||
        subject.subjectName.toLowerCase().includes(searchSubjectTerm.toLowerCase())
    );
    setFilteredSubjects(filtered);
  }, [searchSubjectTerm, subjects]);

  // Filter teachers based on search term
  useEffect(() => {
    const filtered = teachers.filter((teacher) =>
      teacher.teacherName.toLowerCase().includes(searchTeacherTerm.toLowerCase())
    );
    setFilteredTeachers(filtered);
  }, [searchTeacherTerm, teachers]);

  // Filter classes based on search term
  useEffect(() => {
    const filtered = classes.filter((classObj) =>
      classObj.ClassName.toLowerCase().includes(searchClassTerm.toLowerCase())
    );
    setFilteredClasses(filtered);
  }, [searchClassTerm, classes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    if (!subjectCode || !teacherName || !className) {
      setError("Please select the required fields.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiRequest.post("/assignteacher", {
        code: subjectCode,
        teacherName,
        ClassName: className,
      });
      setSuccessMessage("Subject assigned successfully!");
      setSubjectCode("");
      setTeacherName("");
      setClassName("");
      setSelectedSubject(null);
      setSelectedTeacher(null);
      setSelectedClass(null);
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/subjects"); // Redirect to subjects page
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "An error occurred while assigning the subject.");
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
            <h2>Assign Subject</h2>
            <form onSubmit={handleSubmit}>
              {/* Subject Selection */}
              <div className="custom-select" ref={bookDropdownRef}>
                <div
                  className="select-header"
                  onClick={() => {
                    setIsBookDropdownOpen(!isBookDropdownOpen);
                    setIsStudentDropdownOpen(false); // Close teacher dropdown
                    setIsClassDropdownOpen(false); // Close class dropdown
                  }}
                >
                  {selectedSubject
                    ? `${selectedSubject.code}${selectedSubject.subjectName ? ` - ${selectedSubject.subjectName}` : ""}`
                    : "Select Subject"}
                </div>
                {isBookDropdownOpen && (
                  <div className="select-dropdown">
                    <input
                      type="text"
                      placeholder="Search subjects..."
                      value={searchSubjectTerm}
                      onChange={(e) => setSearchSubjectTerm(e.target.value)}
                      autoFocus
                      className="search-input"
                    />
                    <div className="options-list">
                      {filteredSubjects.length > 0 ? (
                        filteredSubjects.map((subject) => (
                          <div
                            key={subject.id}
                            className="option"
                            onClick={() => {
                              setSubjectCode(subject.code);
                              setSelectedSubject(subject);
                              setIsBookDropdownOpen(false);
                              setSearchSubjectTerm("");
                            }}
                          >
                            {subject.code}
                            {subject.subjectName ? ` - ${subject.subjectName}` : ""}
                          </div>
                        ))
                      ) : (
                        <div className="no-results">No subjects found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Teacher Selection */}
              <div className="custom-select" ref={studentDropdownRef}>
                <div
                  className="select-header"
                  onClick={() => {
                    setIsStudentDropdownOpen(!isStudentDropdownOpen);
                    setIsBookDropdownOpen(false); // Close subject dropdown
                    setIsClassDropdownOpen(false); // Close class dropdown
                  }}
                >
                  {selectedTeacher
                    ? `${selectedTeacher.teacherId}${selectedTeacher.teacherName ? ` - ${selectedTeacher.teacherName}` : ""}`
                    : "Select Teacher"}
                </div>
                {isStudentDropdownOpen && (
                  <div className="select-dropdown">
                    <input
                      type="text"
                      placeholder="Search teachers..."
                      value={searchTeacherTerm}
                      onChange={(e) => setSearchTeacherTerm(e.target.value)}
                      autoFocus
                      className="search-input"
                    />
                    <div className="options-list">
                      {filteredTeachers.length > 0 ? (
                        filteredTeachers.map((teacher) => (
                          <div
                            key={teacher.id}
                            className="option"
                            onClick={() => {
                              setTeacherId(teacher.teacherId);
                              setTeacherName(teacher.teacherName);
                              setSelectedTeacher(teacher);
                              setIsStudentDropdownOpen(false);
                              setSearchTeacherTerm("");
                            }}
                          >
                            {teacher.teacherId}
                            {teacher.teacherName ? ` - ${teacher.teacherName}` : ""}
                          </div>
                        ))
                      ) : (
                        <div className="no-results">No teachers found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Class Selection */}
              <div className="custom-select" ref={classDropdownRef}>
                <div
                  className="select-header"
                  onClick={() => {
                    setIsClassDropdownOpen(!isClassDropdownOpen);
                    setIsBookDropdownOpen(false); // Close subject dropdown
                    setIsStudentDropdownOpen(false); // Close teacher dropdown
                  }}
                >
                  {selectedClass
                    ? `${selectedClass.ClassName}`
                    : "Select Class"}
                </div>
                {isClassDropdownOpen && (
                  <div className="select-dropdown">
                    <input
                      type="text"
                      placeholder="Search classes..."
                      value={searchClassTerm}
                      onChange={(e) => setSearchClassTerm(e.target.value)}
                      autoFocus
                      className="search-input"
                    />
                    <div className="options-list">
                      {filteredClasses.length > 0 ? (
                        filteredClasses.map((classObj) => (
                          <div
                            key={classObj.id}
                            className="option"
                            onClick={() => {
                              setClassName(classObj.ClassName);
                              setSelectedClass(classObj);
                              setIsClassDropdownOpen(false);
                              setSearchClassTerm("");
                            }}
                          >
                            {classObj.ClassName}
                          </div>
                        ))
                      ) : (
                        <div className="no-results">No classes found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? "Assigning..." : "Assign Subject"}
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