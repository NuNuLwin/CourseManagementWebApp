import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

// components
import Header from "./components/Header";

// pages
import CreateCourse from "./pages/CreateCourse";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CourseList from "./pages/CourseList";
import CourseDetail from "./pages/CourseDetail";
import StudentList from "./pages/StudentList";

// css
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function App() {
  const { user, hasLoginIn } = useSelector((state) => state.auth);

  return (
    <>
      <Router>
        <div className="container">
          {user?._id && hasLoginIn ? (
            <Header>
              <Routes>
                <Route path="/createCourse" element={<CreateCourse />} />
                <Route path="/courseList" element={<CourseList />} />
                <Route path="/courseList" element={<CourseList />} />
                <Route path="/courses/:courseId" element={<CourseDetail />} />
                <Route path="/studentList/:courseId/:courseName" element={<StudentList />} />
                <Route path="/" element={<CourseList />} />
              </Routes>
            </Header>
          ) : (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Login />} />
            </Routes>
          )}
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
