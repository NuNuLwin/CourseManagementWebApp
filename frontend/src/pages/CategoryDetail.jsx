import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { getCourseByCourseId } from "../features/courses/courseSlice";
import moment from "moment";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Tooltip from "@mui/material/Tooltip";

// material components
import {
  Alert,
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
import {
  uploadContentFile,
  viewContentFile,
} from "../features/courses/contentFileSlice";

function CategoryDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courseId, categoryId } = useParams();

  const { user } = useSelector((state) => state.auth);
  const [file, setFile] = useState("");
  const [course, setCourse] = useState({});
  const [categoryFiles, setCategoryFiles] = useState([]);
  const [activityName, setActivityName] = useState("");
  const fileUploadForm = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { courses, isLoading, isError, message } = useSelector(
    (state) => state.course
  );

  useEffect(() => {
    if (courses.length > 0 && !isLoading) {
      const files =
        courses[0]?.files?.filter((file) => {
          if (file.activity && file.activity._id) {
            return file.activity._id === categoryId;
          }
          return false;
        }) || [];
      files.sort((a, b) => moment(b.uploadDate) - moment(a.uploadDate));
      //console.log("FILES:", files);
      setCourse(courses[0]);
      setCategoryFiles(files);

      const activities = courses[0]?.activities?.filter((activity) => {
        //console.log("activity", activity);
        if (activity && activity._id) {
          if (activity._id === categoryId) {
            setActivityName(activity.activityName);
          }
        }
      });
    }
  }, [courses, isLoading]);

  useEffect(() => {
    dispatch(getCourseByCourseId(courseId));
  }, []);

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
      {/* {categoryFiles.length > 0 ? categoryFiles[0].activity.activityName : ""} */}
      {activityName}
    </Typography>,
  ];

  const contentDownload = async (fileId, fileName) => {
    setLoading(true);
    dispatch(viewContentFile(fileId)).then((res) => {
      setLoading(false);

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

  function handleChange(event) {
    setErrorMessage("");
    setSuccessMessage("");
    setFile(event.target.files[0]);
  }

  function handleFileSubmit(event) {
    setSuccessMessage("");
    event.preventDefault();
    if (!file) {
      setErrorMessage("Please select a file to upload.");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("course_id", courseId);
    formData.append("activity_id", categoryId);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    dispatch(uploadContentFile({ formData, config })).then(() => {
      dispatch(getCourseByCourseId(courseId)).then(() => {
        setLoading(false);
        fileUploadForm.current.reset();
        setFile("");
        setErrorMessage("");
        setSuccessMessage("File uploaded successfully!");
      });
    });
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        {(isLoading || loading) && <Spinner />}
        <Box sx={{ flexGrow: 1, mt: 4 }}>
          <Grid container>
            <Grid item md={12} xs={12}>
              <Stack spacing={2}>
                <Breadcrumbs separator="›" aria-label="breadcrumb">
                  {breadcrumbs}
                </Breadcrumbs>
              </Stack>
              {course && <h2>{course.courseName}</h2>}
              <Grid container>
                <Grid item md={8} xs={6}>
                  <Typography variant="h6">
                    {categoryFiles[0]?.activity.activityName}
                  </Typography>
                </Grid>
                <Grid item md={4} xs={6}></Grid>

                {user.role !== "student" && (
                  <Grid item md={12}>
                    <form onSubmit={handleFileSubmit} ref={fileUploadForm}>
                      {errorMessage && (
                        <Alert severity="error">{errorMessage}</Alert>
                      )}
                      {successMessage && (
                        <Alert
                          severity="success"
                          onClose={() => setSuccessMessage("")}
                        >
                          {successMessage}
                        </Alert>
                      )}
                      <input type="file" onChange={handleChange} />
                      <Button
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        type="submit"
                        style={{ margin: "10px" }}
                      >
                        Upload
                      </Button>
                    </form>
                  </Grid>
                )}

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
                      <p>{file.filename}</p>
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <p>
                        {moment(file.uploadDate).format("DD MMM YYYY HH:MM")}
                      </p>
                    </Grid>

                    <Tooltip title={file.filename} arrow>
                      <Button
                        variant="contained"
                        startIcon={<CloudDownloadIcon />}
                        onClick={() =>
                          contentDownload(file.file, file.filename)
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
