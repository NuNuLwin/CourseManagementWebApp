import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// components
import CourseListItem from "../components/CourseListItem";
import Spinner from "../components/Spinner";

// material components
import {
  Alert,
  Box,
  Container,
  CssBaseline,
  Grid,
  MenuItem,
  Select,
} from "@mui/material";

// redux
import {
  getCoursesByInstructorId,
  getCoursesByStudentId,
} from "../features/courses/courseSlice";

function CourseList() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { courses, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.course
  );

  const [selectedCourseStatus, setSelectedCourseStatus] =
    useState("inprogress");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("");

  useEffect(() => {
    if (user.role !== "student") {
      dispatch(
        getCoursesByInstructorId({
          instructorId: user._id,
          courseStatus: selectedCourseStatus,
        })
      );
    } else {
      dispatch(
        getCoursesByStudentId({
          studentId: user._id,
          courseStatus: selectedCourseStatus,
        })
      );
    }
  }, [selectedCourseStatus]);

  useEffect(() => {
    if (user.role !== "student") {
      dispatch(
        getCoursesByInstructorId({
          instructorId: user._id,
          courseStatus: selectedCourseStatus,
        })
      );
    } else {
      dispatch(
        getCoursesByStudentId({
          studentId: user._id,
          courseStatus: selectedCourseStatus,
        })
      );
    }
  }, []);

  useEffect(() => {
    if (courses.length === 0 && !isLoading && isSuccess) {
      setAlertMsg("No course Available");
      setAlertType("info");
      setShowAlert(true);
    } else if (!isLoading && isError) {
      setAlertMsg(message || "Error retrieving the courses.");
      setAlertType("error");
      setShowAlert(true);
    } else {
      setAlertMsg("");
      setAlertType("");
      setShowAlert(false);
    }
  }, [courses, isSuccess, isLoading, isError]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ flexGrow: 1, mt: 4 }}>
          <h2 style={{ padding: "0 20px" }}>Courses</h2>
          <div>
            <div>
              <Select
                value={selectedCourseStatus}
                onChange={(e) => {
                  setSelectedCourseStatus(e.target.value);
                }}
                sx={{ mb: 2, bgcolor: "background.paper", marginLeft: "15px" }}
              >
                <MenuItem key="all" value="all">
                  All Courses
                </MenuItem>
                <MenuItem key="inprogress" value="inprogress">
                  In Progress
                </MenuItem>
                <MenuItem key="end" value="end">
                  Ended
                </MenuItem>
                <MenuItem key="future" value="future">
                  Future
                </MenuItem>
              </Select>

              <p style={{ display: "inline-flex", marginLeft: "10px" }}>
                Total: {courses.length}
              </p>

              {showAlert ? (
                <Alert
                  severity={alertType}
                  style={{
                    marginBottom: "10px",
                  }}
                >
                  {alertMsg}
                </Alert>
              ) : null}
            </div>

            <Grid container>
              {courses.map((course, i) => (
                <CourseListItem {...course} user={user} key={i} />
              ))}
            </Grid>
          </div>
        </Box>
      </Container>
    </>
  );
}

export default CourseList;
