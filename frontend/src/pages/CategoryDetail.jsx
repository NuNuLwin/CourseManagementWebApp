import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";

// redux
import { viewContentFile } from "../features/courses/contentFileSlice";
import { getCourseByCourseId } from "../features/courses/courseSlice";
import {
  addNote,
  getNotes,
  updateNote,
} from "../features/studentnote/studentnoteslice";
import studentNoteService from "../features/studentnote/studentnoteservice";

// components
import Spinner from "../components/Spinner";
import NoteItem from "../components/NoteItem";
import ShareNoteItem from "../components/ShareNoteItem";
import SimpleDialog from "../components/SimpleDialog";
import BreadCrumbs from "../components/BreadCrumbs";
import FileUpload from "../components/FileUpload";
import ContentFileItem from "../components/ContentFileItem";

// material icons
import CloseIcon from "@mui/icons-material/Close";
import ShareIcon from "@mui/icons-material/Share";

// material components
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

function CategoryDetail() {
  // constants
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courseId, categoryId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [file, setFile] = useState("");
  const [course, setCourse] = useState({});
  const [categoryFiles, setCategoryFiles] = useState([]);
  const [activityName, setActivityName] = useState("");
  const [loading, setLoading] = useState(false);
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
  const [geAllNotesByCourse, setAllNotesByCourse] = useState([]);
  const [getAllSharedNotesByCourse, setAllSharedNotesByCourse] = useState([]);
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
    // console.log(
    //   "Category Details updateLectureNote noteid " +
    //     noteid +
    //     " subnoteid " +
    //     subnoteid +
    //     " notetext " +
    //     notetext
    // );
    dispatch(
      updateNote({
        noteid,
        subnoteid,
        notetext,
      })
    );
  };
  // *** retrive all Notes by course first and filter it by file id(course material id) when course materials are launch
  // and display note count **//
  const getNotesByCourse = async (courseid) => {
    try {
      const allNotes = await studentNoteService.getNotesByCourse(courseid);
      setAllNotesByCourse(allNotes);
      // console.log("getNotesByCourse total note count " + allNotes.length);
    } catch (error) {
      const message = error?.response?.data?.message || "";
      // console.log("getNotesByCourse error " + message);
    }
  };

  // *** retrive all shared Notes by course and filter it by user id and file id(course material id) when course materials are displayed **//
  // ** and display share note count //
  const getSharedNotesByCourse = async (course, user) => {
    try {
      const allNotes = await studentNoteService.getSharedNotesByCourse(
        course,
        user
      );
      setAllSharedNotesByCourse(allNotes);
      // console.log("getSharedNotesByCourse total note count " + allNotes.length);
    } catch (error) {
      const message = error?.response?.data?.message || "";
      // console.log("getSharedNotesByCourse error " + message);
    }
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
      const notes = await studentNoteService.getShareNotes(user, file);
      //if (notes.length > 0) {
      setShareNotes(notes);
      // }
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

  // ** get student list for selected course
  useEffect(() => {
    getStudentListByCourse(courseId);
    // getNotesByCourse for total notes count
    getNotesByCourse(courseId);
    // getSharedNotesByCourse for total shared notes count
    getSharedNotesByCourse(courseId, user._id);
  }, []);

  useEffect(() => {
    getNotesByCourse(courseId);
  }, [studentnotes]);
  // ** code for add note, share note end

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
      setCourse(courses[0]);
      setCategoryFiles(files);

      const activities = courses[0]?.activities?.filter((activity) => {
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

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        {(isLoading || loading) && <Spinner />}
        <Box sx={{ flexGrow: 1, mt: 4 }}>
          <Grid container>
            <Grid item md={12} xs={12}>
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
              {course && <h2>{course.courseName}</h2>}
              <Grid container>
                <Grid item md={12} xs={12} sx={{ fontWeight: "700" }}>
                  <Typography variant="h5">{activityName} Files</Typography>
                </Grid>

                <FileUpload
                  courseId={courseId}
                  user={user}
                  categoryId={categoryId}
                />

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
                  <ContentFileItem
                    key={file.file}
                    file={file}
                    viewContent={viewContent}
                    contentDownload={contentDownload}
                    getLectureNotes={getLectureNotes}
                    noteOpen={noteOpen}
                    setSelectedFile={setSelectedFile}
                    getShareLectureNotes={getShareLectureNotes}
                    shareNoteOpen={shareNoteOpen}
                    user={user}
                    courseId={courseId}
                    categoryId={categoryId}
                    geAllNotesByCourse={geAllNotesByCourse}
                    getAllSharedNotesByCourse={getAllSharedNotesByCourse}
                  />
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
