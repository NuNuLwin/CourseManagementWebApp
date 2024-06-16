import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteCategoryByCourseId,
  getCourseByCourseId,
  updateCategoryByCourseId,
} from "../features/courses/courseSlice";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  TextField,
  Info,
  FormControlLabel,
  Checkbox,
  IconButton,
} from "@mui/material";

// mui icon
import InfoIcon from "@mui/icons-material/Info";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DeleteIcon from "@mui/icons-material/Delete";

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

  const getActivityIcon = (activityName) => {
    const iconProps = { sx: { fontSize: 30, color: "#000" } };
    if (activityName.toLowerCase() === "general") {
      return <InfoIcon {...iconProps} />;
    } else if (activityName.toLowerCase() === "lecture") {
      return <SchoolIcon {...iconProps} />;
    } else if (activityName.toLowerCase() === "assignment") {
      return <AssignmentIcon {...iconProps} />;
    } else {
      return <InfoIcon {...iconProps} />;
    }
  };

  const handleCategorySelect = (activityId) => {
    setSelectedActivities((prevSelectedActivities) => {
      const isSelected = prevSelectedActivities.includes(activityId);
      if (isSelected) {
        console.log("Removing activity:", activityId);
        return prevSelectedActivities.filter((id) => id !== activityId);
      } else {
        console.log("Adding activity:", activityId);
        return [...prevSelectedActivities, activityId];
      }
    });
  };

  const handleAddCatClicked = async () => {
    dispatch(updateCategoryByCourseId({ courseId, selectedActivities })).then(
      () => {
        console.log(
          "handleAddCatClicked selectedActivities..",
          selectedActivities
        );
        handleCloseCatClicked();

        // setCourseActivities(tmpArr);
        const copied = { ...course };
        const tmpArr = [...course.activities];
        const tmpArrIds = tmpArr.map((x) => x._id);
        selectedActivities.forEach((id) => {
          const c = allActivities.filter((x) => x._id === id)[0];
          if (!tmpArrIds.includes(id)) {
            tmpArr.push(c);
          }
        });
        copied.activities = tmpArr;
        setCourse(copied);
        // dispatch(getCourseByCourseId(courseId));
        // dispatch(getCourseByCourseId(courseId)).then((res) => {
        //   setCourseActivities(res.payload.activities);
        // });
      }
    );
    // console.log("check course id..", courseId);
    // console.log("check selectedActivities...", selectedActivities);
    // dispatch(updateCategoryByCourseId({ courseId, selectedActivities }));
  };

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    dispatch(getCourseByCourseId(courseId)).then((res) => {
      setCourseActivities(res.payload.activities);
      setCourse(res.payload);
      setSelectedActivities(res.payload.activities.map((x) => x._id));
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

      console.log("selectedActivities", selectedActivities);

      tmpArr = tmpArr.filter((activity) => activity._id !== activityId);
      setSelectedActivities(tmpArr.map((x) => x._id));
      console.log("tmpArr", tmpArr);

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
                <Grid
                  item
                  md={12}
                  xs={12}
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                  >
                    Select Category to the course
                  </Button>
                </Grid>

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
                        }}
                      >
                        {activity.activityName}
                        {hoveredActivity === activity._id && (
                          <IconButton
                            style={{
                              position: "absolute",
                              top: 0,
                              right: 0,
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
              <Grid item md={4} xs={12} key={activity._id}>
                <Box
                  className="category_card"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 3,
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    boxShadow: 1,
                    margin: 1,
                    position: "relative",
                    position: "relative",
                    cursor:
                      course &&
                      course.activities
                        .map((act) => act._id)
                        .includes(activity._id)
                        ? "not-allowed"
                        : "pointer", // Make cursor not-allowed for already selected activities
                    backgroundColor:
                      selectedActivities.includes(activity._id) ||
                      (course &&
                        course.activities
                          .map((act) => act._id)
                          .includes(activity._id))
                        ? "#DCDCDC" // Background color if selected or already part of the course
                        : selectedActivities.length > 0
                        ? "#fff" // Background color if not selected but other activities are selected
                        : "#fff", // Default background color
                  }}
                  onClick={() => handleCategorySelect(activity._id)}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "primary.main",
                      marginRight: 1,
                      marginBottom: 2,
                      fontSize: "2rem", // Adjust the icon size
                    }}
                  >
                    {getActivityIcon(activity.activityName)}
                  </Box>
                  <Typography
                    variant="body1"
                    style={{ fontSize: "13px", color: "#000" }}
                  >
                    {activity.activityName}
                  </Typography>
                </Box>
              </Grid>
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
