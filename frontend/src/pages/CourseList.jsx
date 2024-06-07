import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

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
            {courses.map((course) => (
              <div className="course-box" key={course._id}>
                <h4 className="course-title">{course.courseName}</h4>
                <Grid container spacing={3}>
                  <Grid item xs={10}>
                    <div className="date-row">
                      <p>Day/s: {course.days}</p>
                      <p>
                        Time: {course.startTime} - {course.endTime}
                      </p>
                    </div>
                    <div className="date-row">
                      <p>
                        Start Date:
                        {new Date(course.startDate).toLocaleDateString()}
                      </p>
                      <p>
                        End Date:
                        {new Date(course.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p>
                        Classes:
                        {course.class.map((cls) => cls.className).join(", ")}
                      </p>
                    </div>
                  </Grid>
                  <Grid item xs={2}>
                    <div className="btn_container">
                      <Button type="submit" variant="contained" color="primary">
                        View Detail
                      </Button>
                    </div>

                    <div className="btn_container">
                      <Button type="submit" variant="contained" color="primary">
                        Registration
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </div>
            ))}
          </div>
        </Box>
      </Container>
    </>
  );
}

export default CourseList;
