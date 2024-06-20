// mui icon imports

import InfoIcon from "@mui/icons-material/Info";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import WorkIcon from "@mui/icons-material/Work";
import BookIcon from "@mui/icons-material/Book";
import FeedbackIcon from "@mui/icons-material/Feedback";
import QuizIcon from "@mui/icons-material/Quiz";
import ApprovalIcon from "@mui/icons-material/Approval";
import GradeIcon from "@mui/icons-material/Grade";

export const getActivityIcon = (activityName, fromDialog) => {
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
