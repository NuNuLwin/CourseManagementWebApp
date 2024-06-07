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
  InputAdornment,
  Paper,
  TextField,
  Link,
  MenuItem,
  OutlinedInput,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

// redux
import {
  createCourse,
  getCoursesByInstructorId,
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

  useEffect(() => {
    if (isError) {
      console.log("error in course list");
    }

    if (!user) {
      navigate("login");
    } else {
      dispatch(getCoursesByInstructorId(user._id));
    }

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ flexGrow: 1, mt: 4 }}>
          <h1> Courses</h1>
          <div>
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
                  <h4 className="course-title">{course.courseName}</h4>
                  <Grid container>
                    <Grid item md={10} xs={12}>
                      <Grid container>
                        <Grid item md={3} xs={12}>
                          <div className="date-row">
                            <p>
                              Day(s):
                              {course.days.map((day) => dayMap[day]).join(", ")}
                            </p>
                          </div>
                        </Grid>
                        <Grid item md={2} xs={12}>
                          <div className="date-row">
                            <p>
                              Time: {course.startTime} - {course.endTime}
                            </p>
                          </div>
                        </Grid>
                        <Grid item md={3} xs={12}>
                          <div className="date-row">
                            <p>Start Date: {formattedStartDate}</p>
                          </div>
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <div className="date-row">
                            <p>End Date: {formattedEndDate}</p>
                          </div>
                        </Grid>

                        <Grid item md={8} xs={12}>
                          <div className="date-row">
                            <p>
                              Class(es):
                              {course.class
                                .map((cls) => cls.className)
                                .join(", ")}
                            </p>
                          </div>
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <div className="date-row">
                            <p>Created Date: {formattedCreatedDate}</p>
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={2} xs={12}>
                      <div className="btn_container">
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                        >
                          View Detail
                        </Button>
                      </div>
                      <div className="btn_container">
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                        >
                          Registration
                        </Button>
                      </div>
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
