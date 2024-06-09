import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { getCourseByCourseId } from "../features/courses/courseSlice";
import moment from "moment";

// material components
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Breadcrumbs,
  Typography,
  Link,
  Stack,
} from "@mui/material";

// activity api
import activityService from "../features/courses/activityService";

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

function CourseDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courseId } = useParams();

  const { user } = useSelector((state) => state.auth);
  const { courses, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.course
  );

  const [activities, setActivities] = useState([]);
  const course = courses[0];
  const formattedStartDate = course
    ? moment(course.startDate).format("DD MMM YYYY")
    : "";
  const formattedEndDate = course
    ? moment(course.endDate).format("DD MMM YYYY")
    : "";

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    dispatch(getCourseByCourseId(courseId));

    // fetch category
    const fetchActivity = async () => {
      try {
        const activityList = await activityService.getActivity();
        setActivities(activityList);
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      }
    };
    fetchActivity();
  }, [dispatch, courseId, isError, message]);

  if (isLoading) {
    return <Spinner />;
  }

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      href="/"
      onClick={() => navigate("/courseList")}
    >
      Courses
    </Link>,
    <Typography key="3" color="text.primary">
      Detail
    </Typography>,
  ];

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ flexGrow: 1, mt: 4 }}>
          <Grid container>
            <Grid item md={12} xs={12}>
              <Stack spacing={2}>
                <Breadcrumbs separator="›" aria-label="breadcrumb">
                  {breadcrumbs}
                </Breadcrumbs>
              </Stack>
              <h2> {course.courseName}</h2>
              <Grid container>
                <Grid item md={3} xs={12}>
                  <p>
                    Day(s): {course.days.map((day) => dayMap[day]).join(", ")}
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
                    {course.class.map((cls) => cls.className).join(", ")}
                  </p>
                </Grid>
                <Grid item md={3} xs={12}>
                  <p>Start Date: {formattedStartDate}</p>
                </Grid>

                <Grid item md={3} xs={12}>
                  <p>End Date: {formattedEndDate}</p>
                </Grid>

                <Grid item md={6} xs={12}>
                  <p>
                    Instructor: {course.instructor.firstname}{" "}
                    {course.instructor.lastname}
                  </p>
                </Grid>
                {activities.map((activity) => (
                  <Grid item md={3} xs={12} key={activity.id}>
                    <Link
                      // to={`/courseId/${courseId}/categoryId/${activity._id}`}
                      underline="hover"
                      onClick={() =>
                        navigate(
                          `/courseId/${courseId}/categoryId/${activity._id}`
                        )
                      }
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <Box className="category_box">
                        {activity.activityName}
                      </Box>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default CourseDetail;
