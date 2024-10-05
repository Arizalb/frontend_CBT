import { useEffect, useState } from "react";
import { getResultsByExam } from "../services/resultServices";

const GradeExam = () => {
  const [examResults, setExamResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const examId = "66f7f3008c27356d1a846905"; // Pastikan ini bukan undefined

  const fetchResults = async () => {
    try {
      const results = await getResultsByExam(examId); // Pastikan examId benar
      setExamResults(results);
    } catch (error) {
      console.error("Failed to fetch results:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Grade Exam</h1>
      {/* Tampilkan hasil ujian di sini */}
      {examResults.length === 0 ? (
        <p>No results found</p>
      ) : (
        <ul>
          {examResults.map((result) => (
            <li key={result._id}>
              {result.student.name} - {result.exam.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GradeExam;
