import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Exams from "./pages/Exams";
import ExamDetails from "./pages/ExamDetails";
import Profile from "./pages/Profile";
import Result from "./pages/Result";
import MyResults from "./pages/MyResult";
import Manage from "./pages/Manage";
import CreateExam from "./pages/CreateExam";
import ManageForExaminer from "./pages/ManageForExaminer";
import EditExam from "./pages/EditExam";
import GradeExam from "./components/GradeExam";
import ProtectedRoute from "./components/ProtectedRoute";
import Forbidden from "./pages/Forbidden";

function App() {
  return (
    <Routes>
      {/* Menggunakan Layout sebagai wrapper */}
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/exams/:id" element={<ExamDetails />} />
        <Route path="/*" element={<Forbidden />} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["student", "examiner", "admin"]} />
          }
        >
          <Route path="/profile" element={<Profile />} />
          <Route path="/results/:examId" element={<Result />} />
          <Route path="/my-results" element={<MyResults />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/manage" element={<Manage />} />
          <Route path="/create-exam" element={<CreateExam />} />
        </Route>

        {/* Examiner Routes */}
        <Route element={<ProtectedRoute allowedRoles={["examiner"]} />}>
          <Route path="/examiner-managing" element={<ManageForExaminer />} />
          <Route path="/exams/edit/:id" element={<EditExam />} />
          <Route path="/grade-exam/:examId" element={<GradeExam />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
