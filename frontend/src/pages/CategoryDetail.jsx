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
  // constants
  const FILE_SIZE_IN_MB = 16.0;

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

  const { courses, isLoading } = useSelector((state) => state.course);

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
    const file_size = event.target.files[0].size / (1000 * 1000);
    const file_type = event.target.files[0].type;
    //console.log("FILE SIZE:", file_size);
    //console.log("FILE TYPE:", file_type);
    if (file_size > FILE_SIZE_IN_MB) {
      setErrorMessage("File size must be below 16 MB.");
    } else if (
      ![
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "image/jpeg",
        "image/png",
      ].includes(file_type)
    ) {
      setErrorMessage(
        "Only PDF, Word, PowerPoint, JPEG, and PNG files are accepted."
      );
    } else {
      setErrorMessage("");
      setSuccessMessage("");
      setFile(event.target.files[0]);
    }
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
                <Grid item md={12} xs={12} sx={{ fontWeight: "700" }}>
                  <Typography variant="h5">{activityName} Files</Typography>
                </Grid>

                {user.role !== "student" && (
                  <Grid item md={12} sx={{ justifyContent: "center" }}>
                    <Box
                      component="section"
                      sx={{
                        p: 2,
                        border: "1px dashed grey",
                        marginTop: "4em",
                        marginBottom: "1em",
                      }}
                    >
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
                        <input
                          type="file"
                          onChange={handleChange}
                          className="choose_File"
                        ></input>
                        <Button
                          variant="contained"
                          startIcon={<CloudUploadIcon />}
                          type="submit"
                          style={{ margin: "10px" }}
                          disabled={errorMessage}
                        >
                          Upload
                        </Button>
                      </form>
                    </Box>
                  </Grid>
                )}

                <Grid item md={7} xs={12}>
                  <h4>File Name</h4>
                </Grid>
                <Grid item md={3} xs={12}>
                  <h4>Uploaded Date</h4>
                </Grid>
                <Grid item md={2} xs={12}>
                  &nbsp;
                </Grid>
              </Grid>
              {categoryFiles?.length ? (
                categoryFiles.map((file, index) => (
                  <Grid container>
                    <Grid item md={7} xs={12}>
                      <p>{file.filename}</p>
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <p>
                        {moment(file.uploadDate).format("DD MMM YYYY HH:MM")}
                      </p>
                    </Grid>

                    <Grid item md={2} xs={12}>
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
                    </Grid>
                  </Grid>
                ))
              ) : (
                <p>No {activityName} file available.</p>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default CategoryDetail;
