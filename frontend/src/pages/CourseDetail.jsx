import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  deleteCategoryByCourseId,
  getCourseByCourseId,
  updateCategoryByCourseId,
} from "../features/courses/courseSlice";

import { DayToShortFormMap } from "../config/config";

// libraries
import moment from "moment";

// components
import BreadCrumbs from "../components/BreadCrumbs";
import CategoryChoiceItem from "../components/CategoryChoiceItem";
import CategoryListItem from "../components/CategoryListItem";
import { getActivityIcon } from "../components/CategoryIcon";

// material components
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

// activity api
import activityService from "../features/courses/activityService";

function CourseDetail() {
  const dispatch = useDispatch();
  const { courseId } = useParams();

  const { user } = useSelector((state) => state.auth);
  const { isError, message } = useSelector((state) => state.course);

  const [allActivities, setAllActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [courseActivities, setCourseActivities] = useState([]);

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
                  },
                ]}
              />
              <h2> {course && course.courseName}</h2>
              <Grid container>
                <Grid item md={3} xs={12}>
                  <p>
                    {course && course.days.length === 1 ? "Day:" : "Days:"}{" "}
                    {course &&
                      course.days
                        .map((day) => DayToShortFormMap[day])
                        .join(", ")}
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
                    <CategoryListItem
                      courseId={courseId}
                      activity={activity}
                      user={user}
                      getActivityIcon={getActivityIcon}
                      handleDeleteActivity={handleDeleteActivity}
                    />
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
