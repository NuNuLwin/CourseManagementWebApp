import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import moment from "moment";

// material components
import {
  Alert,
  Box,
  Button,
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
  reset,
} from "../features/courses/courseSlice";

// change day name to short form
const dayMap = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

function CourseList() {
  const navigate = useNavigate();
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

            {courses.map((course) => {
              const formattedStartDate = moment(course.startDate).format(
                "DD MMM YYYY"
              );
              const formattedEndDate = moment(course.endDate).format(
                "DD MMM YYYY"
              );

              const formattedCreatedDate = moment(course.createdAt).format(
                "DD MMM YYYY"
              );

              return (
                <div className="course-box" key={course._id}>
                  <Grid container>
                    <Grid item md={10} xs={12}>
                      <Grid container>
                        <Grid item md={12} xs={12}>
                          <h4 className="course-title">{course.courseName}</h4>
                        </Grid>
                        <Grid item md={3} xs={12}>
                          <p>
                            Day(s):
                            {course.days.map((day) => dayMap[day]).join(", ")}
                          </p>
                        </Grid>
                        <Grid item md={3} xs={12}>
                          <p>
                            Time: {course.startTime} - {course.endTime}
                          </p>
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <p>
                            Class(es):
                            {course.class
                              .map((cls) => cls.className)
                              .join(", ")}
                          </p>
                        </Grid>
                        <Grid item md={3} xs={12}>
                          <p>Start Date: {formattedStartDate}</p>
                        </Grid>
                        <Grid item md={3} xs={12}>
                          <p>End Date: {formattedEndDate}</p>
                        </Grid>
                        <Grid item md={3} xs={12}>
                          <p>
                            Instructor: {course.instructor.firstname}{" "}
                            {course.instructor.lastname}
                          </p>
                        </Grid>
                        <Grid item md={3} xs={12}>
                          <p>Created Date:{formattedCreatedDate}</p>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={2} xs={12}>
                      <div className="btn_container">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => navigate(`/course/${course._id}`)}
                        >
                          View Detail
                        </Button>
                      </div>
                      {user.role !== "student" && (
                        <div className="btn_container">
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={() =>
                              navigate(`/studentList/${course._id}`)
                            }
                          >
                            Registration
                          </Button>
                        </div>
                      )}
                    </Grid>
                  </Grid>
                </div>
              );
            })}
          </div>
        </Box>
      </Container>
    </>
  );
}

export default CourseList;
