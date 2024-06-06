import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createCourse } from "../features/courses/courseSlice";
import classService from "../features/courses/classService";
import Spinner from "../components/Spinner";

// material ui
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

function CreateCourseForm() {
  const [courseName, setCourseName] = useState("");
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().add(1, "week"));
  const [endDate, setEndDate] = useState(dayjs().add(2, "month"));
  const [startTime, setStartTime] = useState(dayjs().hour(10).minute(0));
  const [endTime, setEndTime] = useState(dayjs().hour(11).minute(30));
  const [selectedDay, setSelectedDay] = useState([]);
  const [userId, setUserId] = useState(null);

  // material ui multi select
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  //Day picker
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { courses, isLoading, isError, message } = useSelector(
    (state) => state.course
  );

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classList = await classService.getClasses();
        setClasses(classList);
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      }
    };
    fetchClasses();

    if (!user) {
      navigate("/login");
    } else {
      setUserId(user._id);
    }
  }, [user, navigate, isError, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert start date and end date to Date objects
      const startDateObj = dayjs(startDate).toDate();
      const endDateObj = dayjs(endDate).toDate();
      const startTimeStr = startTime.format("HH:mm"); // Format time as string
      const endTimeStr = endTime.format("HH:mm"); // Format time as string

      await dispatch(
        createCourse({
          courseName,
          classId: selectedClass,
          startDate: startDateObj,
          endDate: endDateObj,
          startTime: startTimeStr,
          endTime: endTimeStr,
          days: selectedDay,
          instructorId: userId,
        })
      );
      setCourseName("");
      setSelectedClass([]);
      setStartDate(dayjs().add(1, "week"));
      setEndDate(dayjs().add(2, "month"));
      setStartTime(dayjs().hour(10).minute(0));
      setEndTime(dayjs().hour(11).minute(30));
      setSelectedDay([]);
    } catch (error) {
      console.error("Failed to create course:", error);
      // Handle error
    }
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ flexGrow: 1, mt: 4 }}>
          <form onSubmit={onSubmit}>
            <h1> Create Course</h1>
            {user && user._id}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="courseName"
                  label="Course Name"
                  variant="outlined"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="class-multiple-select-label">
                    Select Class
                  </InputLabel>
                  <Select
                    labelId="class-multiple-select-label"
                    name="class"
                    id="demo-simple-select-required"
                    multiple
                    required
                    value={selectedClass}
                    input={<OutlinedInput label="Name" />}
                    MenuProps={MenuProps}
                    onChange={(e) => {
                      console.log("select class value:", e.target.value);
                      setSelectedClass(e.target.value);
                    }}
                  >
                    {classes &&
                      classes.map((cls) => (
                        <MenuItem key={cls._id} value={cls._id}>
                          {cls.className}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box sx={{ display: "flex" }}>
                    <DemoContainer components={["DatePicker", "DatePicker"]}>
                      <DatePicker
                        label="Start Date"
                        name="startDate"
                        value={startDate}
                        onChange={(date) => setStartDate(date)}
                        disablePast
                      />
                      <DatePicker
                        label="End Date"
                        name="endDate"
                        value={endDate}
                        onChange={(date) => setEndDate(date)}
                        disablePast
                      />
                    </DemoContainer>
                  </Box>
                </LocalizationProvider>
              </Grid>

              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["TimePicker", "TimePicker"]}>
                    <TimePicker
                      label="Class Start Time"
                      value={startTime}
                      onChange={(date) => setStartTime(date)}
                    />

                    <TimePicker
                      label="Class End Time"
                      value={endTime}
                      onChange={(date) => setEndTime(date)}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="day-multiple-select-label">
                    Select Day/s
                  </InputLabel>
                  <Select
                    labelId="day-multiple-select-label"
                    name="days"
                    id="demo-simple-select-required"
                    multiple
                    required
                    value={selectedDay}
                    input={<OutlinedInput label="Day/s" />}
                    MenuProps={MenuProps}
                    onChange={(e) => {
                      setSelectedDay(e.target.value);
                    }}
                  >
                    {days.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={3}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Create Course
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </>
  );
}

export default CreateCourseForm;
