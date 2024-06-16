import { useNavigate } from "react-router-dom";
// MUI
import { Box, Button, Grid } from "@mui/material";
// libraries
import moment from "moment";

const CourseListItem = (props) => {
  const navigate = useNavigate();

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

  // format dates
  const formattedStartDate = moment(props.startDate).format("DD MMM YYYY");
  const formattedEndDate = moment(props.endDate).format("DD MMM YYYY");
  const formattedCreatedDate = moment(props.createdAt).format("DD MMM YYYY");

  return (
    <Grid item md={4} xs={12}>
      <Box className="course-box">
        <h4 className="course-title">{props.courseName}</h4>
        <p>
          {props.days.length === 1 ? "Day:" : "Days:"}{" "}
          {props.days.map((day) => dayMap[day]).join(", ")}
        </p>
        <p>
          Time: {props.startTime} - {props.endTime}
        </p>
        <p>
          {props.class.length === 1 ? "Class:" : "Classes:"}{" "}
          {props.class.map((cls) => cls.className).join(", ")}
        </p>
        <p>
          Date: {formattedStartDate} to {formattedEndDate}{" "}
        </p>
        <p>
          Instructor: {props.instructor.firstname} {props.instructor.lastname}
        </p>

        <div className="btn_container">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/course/${props._id}`)}
          >
            View Detail
          </Button>
        </div>

        {props.user.role !== "student" && (
          <div className="btn_container">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => navigate(`/studentList/${props._id}`)}
            >
              Registration
            </Button>
          </div>
        )}
      </Box>
    </Grid>
  );
};

export default CourseListItem;
