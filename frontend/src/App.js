import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

// components
import Header from "./components/Header";

// pages
import CreateCourse from "./pages/CreateCourse";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CourseList from "./pages/CourseList";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Router>
        <div className="container">
          {user ? (
            <Header>
              <Routes>
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/register" element={<Register />} />
                <Route path="/createCourse" element={<CreateCourse />} />
                <Route path="/courseList" element={<CourseList />} />
                <Route path="/" element={<Login />} />
              </Routes>
            </Header>
          ) : (
            <Routes>
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
