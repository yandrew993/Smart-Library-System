import React, { useState, useEffect } from 'react';
import apiRequest from "../../lib/apiRequest";
import './teacherLessonCount.scss';

function Teachercount() {
  const [teacherCounts, setTeacherCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherCounts = async () => {
      try {
        const response = await apiRequest.get('/teachercount');
        console.log('Teacher Counts Response:', response);

        const data = response.data;
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format');
        }

        setTeacherCounts(data);
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherCounts();
  }, []);

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  const sortedTeachers = teacherCounts.sort((a, b) => b.lessonCount - a.lessonCount);
  const totalTeachers = teacherCounts.length;
  const averageLessons = totalTeachers > 0
    ? Math.round(teacherCounts.reduce((sum, t) => sum + t.lessonCount, 0) / totalTeachers)
    : 0;
  const maxLessons = totalTeachers > 0
    ? Math.max(...teacherCounts.map(t => t.lessonCount))
    : 0;

  return (
    <div className="teacher-lesson-container">
      <h2 className="section-title">Teacher Workload</h2>
      <p className="section-subtitle">Lesson Counts by Teacher</p>
      
      <div className="table-wrapper">
        <table className="lesson-count-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Teacher</th>
              <th>Lesson Count</th>
              <th>Workload Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedTeachers.map((teacher, index) => (
              <tr key={teacher.teacherName}>
                <td className="rank-cell">{index + 1}</td>
                <td className="teacher-cell">
                  <span className="teacher-name">{teacher.teacherName}</span>
                </td>
                <td className="count-cell">{teacher.lessonCount}</td>
                <td className="status-cell">
                  <span className={`status-badge ${
                    teacher.lessonCount > 20 ? 'high' :
                    teacher.lessonCount > 10 ? 'medium' : 'low'
                  }`}>
                    {teacher.lessonCount > 20 ? 'Heavy' :
                     teacher.lessonCount > 10 ? 'Moderate' : 'Light'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="stats-summary">
        <div className="stat-card total">
          <h3>Total Teachers</h3>
          <p>{totalTeachers}</p>
        </div>
        <div className="stat-card average">
          <h3>Average Lessons</h3>
          <p>{averageLessons}</p>
        </div>
        <div className="stat-card max">
          <h3>Most Lessons</h3>
          <p>{maxLessons}</p>
        </div>
      </div>
    </div>
  );
};

export default Teachercount;
