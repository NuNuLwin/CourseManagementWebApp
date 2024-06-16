import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteCategoryByCourseId,
  getCourseByCourseId,
  updateCategoryByCourseId,
} from "../features/courses/courseSlice";
// libraries
import moment from "moment";
// components
import CategoryChoiceItem from "../components/CategoryChoiceItem";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";

// mui icon
import InfoIcon from "@mui/icons-material/Info";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DeleteIcon from "@mui/icons-material/Delete";
import WorkIcon from "@mui/icons-material/Work";
import BookIcon from "@mui/icons-material/Book";
import FeedbackIcon from "@mui/icons-material/Feedback";
import QuizIcon from "@mui/icons-material/Quiz";
import ApprovalIcon from "@mui/icons-material/Approval";
import GradeIcon from "@mui/icons-material/Grade";

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

  const [allActivities, setAllActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [courseActivities, setCourseActivities] = useState([]);
  const [hoveredActivity, setHoveredActivity] = useState(null);

  const [course, setCourse] = useState(null);
  const formattedStartDate = course
    ? moment(course.startDate).format("DD MMM YYYY")
    : "";
  const formattedEndDate = course
    ? moment(course.endDate).format("DD MMM YYYY")
    : "";

  // MUI Open Dialog
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseCatClicked = () => {
    setSelectedActivities(course.activities.map((x) => x._id));
    setOpen(false);
  };

  const getActivityIcon = (activityName, fromDialog) => {
    let iconProps;
    if (fromDialog) {
      iconProps = { sx: { fontSize: 30, color: "#000" } };
    } else {
      iconProps = { sx: { fontSize: 30, color: "#fff" } };
    }

    if (activityName.toLowerCase() === "general") {
      return <InfoIcon {...iconProps} />;
    } else if (activityName.toLowerCase() === "lecture") {
      return <SchoolIcon {...iconProps} />;
    } else if (activityName.toLowerCase() === "assignment") {
      return <AssignmentIcon {...iconProps} />;
    } else if (activityName.toLowerCase() === "project") {
      return <WorkIcon {...iconProps} />;
    } else if (activityName.toLowerCase() === "reading") {
      return <BookIcon {...iconProps} />;
    } else if (activityName.toLowerCase() === "feedback") {
      return <FeedbackIcon {...iconProps} />;
    } else if (activityName.toLowerCase() === "quiz") {
      return <QuizIcon {...iconProps} />;
    } else if (activityName.toLowerCase() === "certificate") {
      return <ApprovalIcon {...iconProps} />;
    } else if (activityName.toLowerCase() === "exam") {
      return <GradeIcon {...iconProps} />;
    } else {
      return <InfoIcon {...iconProps} />;
    }
  };

  const handleCategorySelect = (activityId) => {
    setSelectedActivities((prevSelectedActivities) => {
      const isSelected = prevSelectedActivities.includes(activityId);
      if (isSelected) {
        //console.log("Removing activity:", activityId);
        return prevSelectedActivities.filter((id) => id !== activityId);
      } else {
        //console.log("Adding activity:", activityId);
        return [...prevSelectedActivities, activityId];
      }
    });
  };

  const handleAddCatClicked = async () => {
    dispatch(updateCategoryByCourseId({ courseId, selectedActivities })).then(
      () => {
        handleCloseCatClicked();

        // setCourseActivities(tmpArr);
        let copied = { ...course };
        const tmpArr = [...course.activities];
        const tmpArrIds = tmpArr.map((x) => x._id);
        selectedActivities.forEach((id) => {
          const c = allActivities.filter((x) => x._id === id)[0];
          if (!tmpArrIds.includes(id)) {
            tmpArr.push(c);
          }
        });
        copied.activities = tmpArr;
        let acts = [...copied.activities];
        acts.sort((a, b) => {
          const nameA = a.activityName.toUpperCase();
          const nameB = b.activityName.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        copied.activities = acts;
        setCourse(copied);
      }
    );
  };

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    dispatch(getCourseByCourseId(courseId)).then((res) => {
      setCourseActivities(res.payload.activities);
      let copied = { ...res.payload };
      let acts = [...copied.activities];
      acts.sort((a, b) => {
        const nameA = a.activityName.toUpperCase();
        const nameB = b.activityName.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      copied.activities = acts;
      setCourse(copied);
      setSelectedActivities(copied.activities.map((x) => x._id));
    });

    // fetch category
    const fetchActivity = async () => {
      try {
        const activityList = await activityService.getActivity();
        setAllActivities(activityList);
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      }
    };
    fetchActivity();
  }, []);

  const handleMouseEnter = (activityId) => {
    setHoveredActivity(activityId);
  };

  const handleMouseLeave = () => {
    setHoveredActivity(null);
  };

  const handleDeleteActivity = async (activityId) => {
    dispatch(deleteCategoryByCourseId({ courseId, activityId })).then(() => {
      const copied = { ...course };
      let tmpArr = [...course.activities];

      tmpArr = tmpArr.filter((activity) => activity._id !== activityId);
      setSelectedActivities(tmpArr.map((x) => x._id));

      copied.activities = tmpArr;
      setCourse(copied);
    });
  };

  // if (isLoading) {
  //   return <Spinner />;
  // }

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
      {course && course.class.map((cls) => cls.className).join(", ")}
    </Typography>,
  ];

  const isActivityChecked = (current_activities, activity_id) => {
    if (current_activities.length === 0) return false;

    const current_activities_ids = current_activities.map((x) => x._id);
    return current_activities_ids.includes(activity_id);
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ flexGrow: 1, mt: 4 }}>
          <Grid container>
            <Grid item md={10} xs={12}>
              <Stack spacing={2}>
                <Breadcrumbs separator="›" aria-label="breadcrumb">
                  {breadcrumbs}
                </Breadcrumbs>
              </Stack>
              <h2> {course && course.courseName}</h2>
              <Grid container>
                <Grid item md={3} xs={12}>
                  <p>
                    {course && course.days.length === 1 ? "Day:" : "Days:"}{" "}
                    {course && course.days.map((day) => dayMap[day]).join(", ")}
                  </p>
                </Grid>
                <Grid item md={3} xs={12}>
                  <p>
                    Time: {course && course.startTime} -{" "}
                    {course && course.endTime}
                  </p>
                </Grid>
                <Grid item md={6} xs={12}>
                  <p>
                    {course && course.class.length === 1
                      ? "Class:"
                      : "Classes:"}{" "}
                    {course &&
                      course.class.map((cls) => cls.className).join(", ")}
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
                    Instructor: {course && course.instructor.firstname}{" "}
                    {course && course.instructor.lastname}
                  </p>
                </Grid>
                {user.role !== "student" && (
                  <Grid
                    item
                    md={12}
                    xs={12}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleClickOpen}
                    >
                      Select Category to the course
                    </Button>
                  </Grid>
                )}

                {course?.activities?.map((activity) => (
                  <Grid item md={3} xs={12} key={activity._id}>
                    <Link
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
                      <Box
                        className="category_box"
                        onMouseEnter={() => handleMouseEnter(activity._id)}
                        onMouseLeave={handleMouseLeave}
                        style={{
                          position: "relative",
                          display: "flex",
                          flexDirection: "column", // Display icon and text in a column
                          alignItems: "center", // Center items horizontally
                        }}
                      >
                        <box>
                          {getActivityIcon(activity.activityName, false)}
                        </box>

                        <box>{activity.activityName}</box>

                        {hoveredActivity === activity._id &&
                          user.role !== "student" && (
                            <IconButton
                              style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                color: "#000",
                              }}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent the onClick event of the Link from firing
                                const confirmDelete = window.confirm(
                                  "Are you sure you want to delete this activity?"
                                );
                                if (confirmDelete) {
                                  // Call backend to delete activity
                                  handleDeleteActivity(activity._id);
                                }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                      </Box>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <Dialog open={open} onClose={handleCloseCatClicked}>
        <DialogTitle>Choose Category</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            {allActivities.map((activity) => (
              <CategoryChoiceItem
                {...activity}
                course={course}
                selectedActivities={selectedActivities}
                handleCategorySelect={handleCategorySelect}
                getActivityIcon={getActivityIcon}
              />
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddCatClicked} color="primary">
            Add
          </Button>
          <Button onClick={handleCloseCatClicked} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CourseDetail;
