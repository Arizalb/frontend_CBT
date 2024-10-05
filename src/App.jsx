import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Exams from "./pages/Exams.jsx";
import ExamDetails from "./pages/ExamDetails.jsx";
import Profile from "./pages/Profile.jsx";
import Result from "./pages/Result.jsx";
import MyResults from "./pages/MyResult.jsx";
import Manage from "./pages/Manage.jsx"; // Import Manage page
import CreateExam from "./pages/CreateExam.jsx"; // Import Create Exam page
import ManageForExaminer from "./pages/ManageForExaminer.jsx";
import EditExam from "./pages/EditExam.jsx";
import Footer from "./components/Footer.jsx";
import GradeExam from "./components/GradeExam.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/exams/:id" element={<ExamDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/results/:examId" element={<Result />} />
        <Route path="/my-results" element={<MyResults />} />
        <Route path="/manage" element={<Manage />} />{" "}
        {/* Manage page for Admin */}
        <Route path="/create-exam" element={<CreateExam />} />{" "}
        <Route path="/examiner-managing" element={<ManageForExaminer />} />{" "}
        <Route path="/exams/edit/:id" element={<EditExam />} />
        <Route path="/grade-exam/:examId" element={<GradeExam />} />
        {/* <Route path="/exams/access/:id" element={<ExamAccess />} /> */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
