import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { getCourseByCourseId } from "../features/courses/courseSlice";
import moment from "moment";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Tooltip from "@mui/material/Tooltip";

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
import { viewContentFile } from "../features/courses/contentFileSlice";

function CategoryDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courseId, categoryId } = useParams();

  const { courses, isLoading, isError, message } = useSelector(
    (state) => state.course
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    dispatch(getCourseByCourseId(courseId));
  }, [dispatch, courseId, isError, message]);

  if (isLoading) {
    return <Spinner />;
  }

  const course = courses[0];

  const categoryFiles = course?.files?.filter((file) => {
    if (file.activity && file.activity._id) {
      return file.activity._id === categoryId;
    }
    return false;
  });

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      onClick={() => navigate("/courseList")}
      sx={{
        cursor: "pointer",
      }}
    >
      Courses
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="inherit"
      onClick={() => navigate(`/course/${course._id}`)}
      sx={{
        cursor: "pointer",
      }}
    >
      Detail
    </Link>,
    <Typography key="3" color="text.primary">
      {categoryFiles[0]?.activity.activityName}
    </Typography>,
  ];

  const contentDownload = async (fileId, fileName) => {
    dispatch(viewContentFile(fileId)).then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.payload]));
      const anchorElement = document.createElement("a");
      anchorElement.href = url;
      anchorElement.setAttribute("download", fileName);
      anchorElement.target = "_blank";
      document.body.appendChild(anchorElement);

      anchorElement.click();
      anchorElement?.parentNode?.removeChild(anchorElement);
    });
  };

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
              {course && <h2>{course.courseName}</h2>}
              <Typography variant="h6">
                {categoryFiles[0]?.activity.activityName}
              </Typography>
              <Grid container>
                <Grid item md={5} xs={12}>
                  <h4>File Name</h4>
                </Grid>
                <Grid item md={3} xs={12}>
                  <h4>Uploaded Date</h4>
                </Grid>
              </Grid>
              {categoryFiles?.length ? (
                categoryFiles.map((file, index) => (
                  <Grid container>
                    <Grid item md={5} xs={12}>
                      <p>{file.file.filename}</p>
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <p>
                        {moment(file.file.uploadDate).format("DD MMM YYYY")}
                      </p>
                    </Grid>

                    <Tooltip title={file.file.filename} arrow>
                      <Button
                        variant="contained"
                        startIcon={<CloudDownloadIcon />}
                        onClick={() =>
                          contentDownload(file.file._id, file.file.filename)
                        }
                        style={{ margin: "10px" }}
                      >
                        Download
                      </Button>
                    </Tooltip>

                    {/* <Grid item md={6} xs={12}>
                      <Button
                        variant="contained"
                        startIcon={<CloudDownloadIcon />}
                        onClick={() =>
                          contentDownload(file.file._id, file.file.filename)
                        }
                      >
                        Download
                      </Button>
                    </Grid> */}
                  </Grid>
                ))
              ) : (
                <p>No files found for this category.</p>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default CategoryDetail;
