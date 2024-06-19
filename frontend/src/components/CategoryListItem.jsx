import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Link, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const CategoryListItem = (props) => {
  const navigate = useNavigate();

  const [hoveredActivity, setHoveredActivity] = useState(null);

  // events
  const handleMouseEnter = (activityId) => {
    setHoveredActivity(activityId);
  };

  const handleMouseLeave = () => {
    setHoveredActivity(null);
  };

  const categoryFilesCount = {};

  props.course.files.forEach((file) => {
    if (file.activity && file.activity._id) {
      if (!categoryFilesCount[file.activity._id]) {
        categoryFilesCount[file.activity._id] = 0;
      }
      categoryFilesCount[file.activity._id]++;
    }
  });

  console.log("Category Files Count:", categoryFilesCount);
  const fileCount = categoryFilesCount[props.activity._id] || 0;

  return (
    <Link
      underline="hover"
      onClick={() =>
        navigate(`/courseId/${props.courseId}/categoryId/${props.activity._id}`)
      }
      style={{
        cursor: "pointer",
      }}
      key={props.activity._id}
    >
      <Box
        className="category_box"
        onMouseEnter={() => handleMouseEnter(props.activity._id)}
        onMouseLeave={handleMouseLeave}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column", // Display icon and text in a column
          alignItems: "center", // Center items horizontally
        }}
      >
        <box>{props.getActivityIcon(props.activity.activityName, false)}</box>

        <Box>{props.activity.activityName}</Box>
        <Box>({fileCount})</Box>

        {hoveredActivity === props.activity._id &&
          props.user.role !== "student" && (
            <IconButton
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                color: "#000",
              }}
              onClick={(e) => {
                e.stopPropagation();
                const confirmDelete = window.confirm(
                  "Are you sure you want to delete this category? Deleting this category will also delete all associated files!"
                );
                if (confirmDelete) {
                  // Call backend to delete activity
                  props.handleDeleteActivity(props.activity._id);
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
      </Box>
    </Link>
  );
};

export default CategoryListItem;
