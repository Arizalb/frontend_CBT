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
import NotFound from "./pages/NotFound";
import ResultDetail from "./pages/ResultDetail";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/403" element={<Forbidden />} />{" "}
        {/* Route khusus Forbidden */}
        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["student", "examiner", "admin"]} />
          }
        >
          {" "}
          <Route path="/exams" element={<Exams />} />
          <Route path="/exams/:id" element={<ExamDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/result/student/:examId" element={<Result />} />
          <Route path="/my-results" element={<MyResults />} />
        </Route>
        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/manage" element={<Manage />} />
        </Route>
        {/* Examiner Routes */}
        <Route element={<ProtectedRoute allowedRoles={["examiner"]} />}>
          <Route path="/create-exam" element={<CreateExam />} />
          <Route path="/examiner-managing" element={<ManageForExaminer />} />
          <Route path="/exams/edit/:id" element={<EditExam />} />
          <Route path="/grade-exam/:examId" element={<GradeExam />} />
          <Route path="/results/:resultId" element={<ResultDetail />} />
        </Route>
        <Route path="*" element={<NotFound />} /> {/* Route 404 */}
      </Route>
    </Routes>
  );
}

export default App;
