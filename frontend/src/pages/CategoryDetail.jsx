import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

// redux
import {
  uploadContentFile,
  viewContentFile,
} from "../features/courses/contentFileSlice";

// redux actions
import { getCourseByCourseId } from "../features/courses/courseSlice";
import studentNoteService from "../features/studentnote/studentnoteservice";
import {
  addNote,
  getNotes,
  shareNote,
  reset,
  updateNote,
} from "../features/studentnote/studentnoteslice";

// components
import BreadCrumbs from "../components/BreadCrumbs";
import NoteItem from "../components/NoteItem";
import ShareNoteItem from "../components/ShareNoteItem";
import SimpleDialog from "../components/SimpleDialog";
import Spinner from "../components/Spinner";

// material icons
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PeopleIcon from "@mui/icons-material/People";
import ShareIcon from "@mui/icons-material/Share";

// material components
import {
  Alert,
  Box,
  Button,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  Link,
  Stack,
  Tooltip,
} from "@mui/material";

// libraries
import moment from "moment";
import { toast } from "react-toastify";

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

  // ** code for add note, share note start
  const {
    studentnotes,
    isLoadingNote,
    isErrorNote,
    isSuccessNote,
    messageNote,
  } = useSelector((state) => state.studentNotes);
  const [open, setOpen] = useState(false);
  const [openShareNote, setOpenShareNote] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [enterNote, setEnterNote] = useState("");
  const [shareNotes, setShareNotes] = useState([]);
  const [studentlistByCourse, setStudentlistByCourse] = useState([]);
  const [openStudentListDialog, setOpenStudentListDialog] = useState(false);

  // ** share Note Dialog
  const shareNoteOpen = () => {
    setOpenShareNote(true);
  };

  const shareNoteClose = () => {
    setOpenShareNote(false);
  };

  // ** add Note Dialog
  const noteOpen = () => {
    setOpen(true);
  };

  const noteClose = () => {
    setOpen(false);
    setEnterNote("");
  };

  // ** student list dialog
  const handleStudentListDialogClose = (studentid) => {
    setOpenStudentListDialog(false);
    shareLectureNote(studentnotes[0]._id, studentid);
  };

  const shareLectureNote = async (note, user) => {
    const noteDate = {
      note, //this is note _id
      user,
    };
    try {
      const studentnote = await studentNoteService.shareNote(noteDate);
      if (studentnote.members.length > 0) {
        toast.success("Note is successfully shared!");
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    }
  };

  const addLectureNote = (user, course, file, category, note) => {
    const noteData = {
      user,
      course,
      file,
      activity: category,
      notes: note,
    };
    dispatch(addNote(noteData));
    setEnterNote("");
  };

  const updateLectureNote = (noteid, subnoteid, notetext) => {
    console.log(
      "Category Details updateLectureNote noteid " +
        noteid +
        " subnoteid " +
        subnoteid +
        " notetext " +
        notetext
    );
    dispatch(
      updateNote({
        noteid,
        subnoteid,
        notetext,
      })
    );
  };

  const getLectureNotes = (user, course, file, category) => {
    dispatch(
      getNotes({
        user: user,
        course: course,
        file: file,
        activity: category,
      })
    );
  };

  const getShareLectureNotes = async (user, file) => {
    try {
      const sharenotes = await studentNoteService.getShareNotes(user, file);
      if (sharenotes.length > 0) {
        setShareNotes(sharenotes);
      }
    } catch (error) {
      console.log("getShareLectureNotes error " + error);
    }
  };

  const getStudentListByCourse = async (course) => {
    try {
      const studentlistByCourse =
        await studentNoteService.getStudentListByCourse(course);
      setStudentlistByCourse(studentlistByCourse);
    } catch (error) {
      console.log("getStudentListByCourse error " + error);
    }
  };

  const viewContent = async (fileId, fileName) => {
    setLoading(true);
    try {
      const res = await dispatch(viewContentFile(fileId));
      setLoading(false);

      const url = window.URL.createObjectURL(res.payload);
      const anchorElement = document.createElement("a");
      anchorElement.href = url;
      anchorElement.target = "_blank";
      document.body.appendChild(anchorElement);

      anchorElement.click();
      anchorElement?.parentNode?.removeChild(anchorElement);
    } catch (error) {
      //console.error("Error fetching file:", error);
      setLoading(false);
      // Handle the error appropriately, e.g., display an error message
    }
  };

  // ** get student list for selected course
  useEffect(() => {
    getStudentListByCourse(courseId);
  }, []);

  // ** code for add note, share note start

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

  // const breadcrumbs = [
  //   <Link
  //     underline="hover"
  //     key="1"
  //     color="inherit"
  //     onClick={() => navigate("/courseList")}
  //     sx={{
  //       cursor: "pointer",
  //     }}
  //   >
  //     Courses
  //   </Link>,
  //   <Link
  //     underline="hover"
  //     key="2"
  //     color="inherit"
  //     onClick={() => navigate(`/course/${course._id}`)}
  //     sx={{
  //       cursor: "pointer",
  //     }}
  //   >
  //     {courses && courses[0].class.map((cls) => cls.className).join(", ")}
  //   </Link>,
  //   <Typography key="3" color="text.primary">
  //     {/* {categoryFiles.length > 0 ? categoryFiles[0].activity.activityName : ""} */}
  //     {activityName}
  //   </Typography>,
  // ];

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
    //console.log(file_type);
    if (file_size > FILE_SIZE_IN_MB) {
      setErrorMessage("File size must be below 16 MB.");
    } else if (
      ![
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
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
                <BreadCrumbs
                  links={[
                    {
                      name: "Courses",
                      url: "/courseList",
                    },
                    {
                      name:
                        course && course.courseName
                          ? course.courseName.split(" - ")[0]
                          : "",
                      url: `/course/${course._id}`,
                    },
                    {
                      name: activityName,
                    },
                  ]}
                />
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
                      <p style={{ color: "red" }}>
                        *Accepted files: PDF, Word, PowerPoint, JPEG, and PNG.
                        Files must not exceed 16MB.
                      </p>
                    </Box>
                  </Grid>
                )}

                <Grid item md={6} xs={12}>
                  <h4>File Name</h4>
                </Grid>
                <Grid item md={3} xs={12}>
                  <h4>Uploaded Date</h4>
                </Grid>
                <Grid item md={3} xs={12}>
                  &nbsp;
                </Grid>
              </Grid>
              {categoryFiles?.length ? (
                categoryFiles.map((file, index) => (
                  <Grid
                    container
                    sx={{
                      bgcolor: "#D6E4F0",
                      p: 2,
                      mb: 1.5,
                      boxShadow:
                        "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
                      borderRadius: "4px",
                      transition:
                        "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                    }}
                  >
                    <Grid
                      item
                      md={6}
                      xs={12}
                      sx={{
                        alignSelf: "center",
                      }}
                    >
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          viewContent(file.file, file.filename);
                        }}
                        underline="hover"
                      >
                        {file.filename}
                      </Link>
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <p>
                        {moment(file.uploadDate).format("DD MMM YYYY HH:MM")}
                      </p>
                    </Grid>

                    <Grid item md={3} xs={12}>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Tooltip title={"Download File"} arrow>
                          <IconButton
                            aria-label="download-content-file"
                            onClick={() =>
                              contentDownload(file.file, file.filename)
                            }
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={"Add Note"} arrow>
                          <IconButton
                            aria-label="Note"
                            onClick={() => {
                              // ** open note dialog to add note
                              console.log(
                                "open note dialog student id " +
                                  user._id +
                                  " course id " +
                                  courseId +
                                  " file id " +
                                  file.file +
                                  " activity id " +
                                  categoryId
                              );
                              getLectureNotes(
                                user._id,
                                courseId,
                                file.file,
                                categoryId
                              );
                              noteOpen();
                              setSelectedFile(file.file);
                            }}
                          >
                            <EditNoteIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={"Shared Note"} arrow>
                          <IconButton
                            aria-label="ViewNote"
                            onClick={() => {
                              // ** open note dialog to view note
                              console.log("open note to view share note");
                              getShareLectureNotes(user._id, file.file);
                              shareNoteOpen();
                            }}
                          >
                            <PeopleIcon />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </Grid>
                    {/* </Grid> */}
                  </Grid>
                ))
              ) : (
                <p>No {activityName} file available.</p>
              )}
            </Grid>
          </Grid>

          {/* student list Dialog */}
          <SimpleDialog
            open={openStudentListDialog}
            onClose={handleStudentListDialogClose}
            studentList={studentlistByCourse}
          />
          {/* student list Dialog Code*/}

          {/* add Note Dialog*/}
          <React.Fragment>
            <Dialog
              hideBackdrop={true}
              onClose={noteClose}
              aria-labelledby="customized-dialog-title"
              open={open}
              PaperProps={{
                sx: { position: "fixed", right: 5, width: 300, height: 500 },
              }}
            >
              <DialogTitle
                sx={{ m: 0, p: 1, fontSize: 12 }}
                id="customized-dialog-title"
              >
                Notes
              </DialogTitle>

              <IconButton
                aria-label="share"
                onClick={() => setOpenStudentListDialog(true)}
                disabled={
                  studentnotes.length > 0 && studentnotes[0].notes.length > 0
                    ? false
                    : true
                }
                sx={{
                  position: "absolute",
                  right: 50,
                  top: 5,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <ShareIcon />
              </IconButton>

              <IconButton
                aria-label="close"
                onClick={noteClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 5,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>

              <DialogContent dividers>
                {studentnotes.length > 0 && studentnotes[0].notes.length > 0 ? (
                  <div>
                    {studentnotes[0].notes.map((note) => (
                      <NoteItem
                        key={note._id}
                        noteid={studentnotes[0]._id}
                        note={note}
                        updateLectureNote={updateLectureNote}
                      />
                    ))}
                  </div>
                ) : (
                  <Typography variant="body2" gutterBottom>
                    There is no note here
                  </Typography>
                )}
              </DialogContent>

              <DialogActions>
                <TextField
                  fullWidth
                  id="outlined-multiline-static"
                  multiline
                  placeholder="Please add your note here"
                  value={enterNote}
                  onChange={(e) => setEnterNote(e.target.value)}
                />
              </DialogActions>
              <DialogActions>
                <Button size="small" onClick={noteClose}>
                  Cancel
                </Button>
                <Button
                  size="small"
                  onClick={() =>
                    addLectureNote(
                      user._id,
                      courseId,
                      selectedFile,
                      categoryId,
                      enterNote
                    )
                  }
                >
                  Post
                </Button>
              </DialogActions>
            </Dialog>
          </React.Fragment>
          {/* add note Dialog Code */}

          {/* get share note Dialog  */}
          <React.Fragment>
            <Dialog
              hideBackdrop={true}
              onClose={shareNoteClose}
              aria-labelledby="customized-dialog-title"
              open={openShareNote}
              PaperProps={{
                sx: { position: "fixed", right: 5, width: 300, height: 500 },
              }}
            >
              <DialogTitle
                sx={{ m: 0, p: 1, fontSize: 12 }}
                id="customized-dialog-title"
              >
                Notes shared by others
              </DialogTitle>

              <IconButton
                aria-label="close"
                onClick={shareNoteClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 5,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>

              <DialogContent dividers>
                {shareNotes.length > 0 ? (
                  <div>
                    {shareNotes.map((sharenote) => (
                      <ShareNoteItem
                        key={sharenote._id}
                        sharenote={sharenote}
                      />
                    ))}
                  </div>
                ) : (
                  <Typography variant="body2" gutterBottom>
                    There is no share note here
                  </Typography>
                )}
              </DialogContent>
            </Dialog>
          </React.Fragment>
          {/* get share note Dialog */}
        </Box>
      </Container>
    </>
  );
}

export default CategoryDetail;
