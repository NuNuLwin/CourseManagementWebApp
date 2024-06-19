import { useNavigate } from "react-router-dom";
import React from "react";

// material components
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Link,
  Grid,
  Typography,
  Tooltip,
} from "@mui/material";

import { blue } from "@mui/material/colors";
import ClassIcon from "@mui/icons-material/Class";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";

const CourseListItem = (props) => {
  const navigate = useNavigate();

  let displayImg;
  if (
    props.class.some(
      (cls) => cls.className === "CS700" || cls.className === "CS731"
    )
  ) {
    displayImg = "img1.jpg";
  } else if (
    props.class.some(
      (cls) => cls.className === "CS732" || cls.className === "CS733"
    )
  ) {
    displayImg = "img2.jpg";
  } else if (
    props.class.some(
      (cls) => cls.className === "CS734" || cls.className === "CS735"
    )
  ) {
    displayImg = "img3.jpg";
  } else {
    displayImg = "img4.jpg";
  }

  const getColorForDay = (day) => {
    const colors = {
      Monday: "#651fff",
      Tuesday: "#03A9F4",
      Wednesday: "#2e7d32",
      Thursday: "#616161",
      Friday: "#FF9800",
      Saturday: "#9C27B0",
      Sunday: "#F44336",
    };
    return colors[day] || blue[500];
  };

  return (
    <Grid item md={4} xs={12}>
      <Card sx={{ maxWidth: 345, margin: "10px" }}>
        <CardHeader
          sx={{
            height: "90px", // Fixed height for CardHeader
            overflow: "hidden",
            maxWidth: "100%",
          }}
          title={
            <Link href={`/course/${props._id}`} underline="hover">
              <Typography
                variant="h6"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  width: "300px",
                  textOverflow: "ellipsis",
                  color: "#1E56A0",
                }}
              >
                {props.courseName.split(" - ")[0]}
              </Typography>
            </Link>
          }
          subheader={props.courseName.split(" - ")[1]}
        />

        <CardMedia
          component="img"
          height="194"
          image={process.env.PUBLIC_URL + "/" + displayImg}
          alt="Course image"
        />

        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
            {props.days.map((day, index) => (
              <Tooltip title={day}>
                <Avatar
                  key={index}
                  sx={{ bgcolor: getColorForDay(day), width: 32, height: 32 }}
                  aria-label={day}
                >
                  {day === "Thursday" ? "TR" : day.substring(0, 1)}
                </Avatar>
              </Tooltip>
            ))}
          </Box>
        </CardContent>
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row", // Ensure items are in a row
            flexWrap: "wrap", // Allow items to wrap to the next line
          }}
        >
          <Typography variant="body2">
            <ClassIcon
              sx={{
                verticalAlign: "-7px",
              }}
            />{" "}
            &nbsp;
            {props.class.map((cls) => cls.className).join("/ ")}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AccessTimeFilledIcon /> &nbsp;
            <Typography variant="body2">
              {props.startTime} - {props.endTime}
            </Typography>
          </Box>
        </CardContent>
        {props.user.role !== "student" && (
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => navigate(`/studentList/${props._id}`)}
              >
                Registration
              </Button>
            </Box>
          </CardContent>
        )}
      </Card>
    </Grid>
  );
};

export default CourseListItem;
