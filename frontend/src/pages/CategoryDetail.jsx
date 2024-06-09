import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";

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
import { getCourseContent } from "../features/courses/contentFileSlice";

function CategoryDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courseId, categoryId } = useParams();

  const { user } = useSelector((state) => state.auth);
  const { courses, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.course
  );

  const course = courses[0];

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    dispatch(getCourseContent(courseId, categoryId));
  }, [dispatch, courseId, categoryId, isError, message]);

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
    <Link
      underline="hover"
      key="1"
      color="inherit"
      href="/"
      onClick={() => navigate("/courseList")}
    >
      Detail
    </Link>,
    <Typography key="3" color="text.primary">
      Category name
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
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default CategoryDetail;
