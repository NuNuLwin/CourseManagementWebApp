import { Box, Grid, Typography } from "@mui/material";

const CategoryChoiceItem = (props) => {
  return (
    <Grid item md={4} xs={12} key={props._id}>
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
            props.course &&
            props.course.activities.map((act) => act._id).includes(props._id)
              ? "not-allowed"
              : "pointer", // Make cursor not-allowed for already selected activities
          backgroundColor:
            props.selectedActivities.includes(props._id) ||
            (props.course &&
              props.course.activities.map((act) => act._id).includes(props._id))
              ? "#DCDCDC" // Background color if selected or already part of the course
              : props.selectedActivities.length > 0
              ? "#fff" // Background color if not selected but other activities are selected
              : "#fff", // Default background color
        }}
        onClick={() => props.handleCategorySelect(props._id)}
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
          {props.getActivityIcon(props.activityName, true)}
        </Box>
        <Typography variant="body1" style={{ fontSize: "13px", color: "#000" }}>
          {props.activityName}
        </Typography>
      </Box>
    </Grid>
  );
};

export default CategoryChoiceItem;
