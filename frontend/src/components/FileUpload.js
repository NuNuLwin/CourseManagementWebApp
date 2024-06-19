import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Box, Button, Grid } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { uploadContentFile } from "../features/courses/contentFileSlice";
import { getCourseByCourseId } from "../features/courses/courseSlice";

const FILE_SIZE_IN_MB = 16.0;

const FileUpload = (props) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  const fileUploadForm = useRef(null);

  function handleChange(event) {
    const file_size = event.target.files[0].size / (1000 * 1000);
    const file_type = event.target.files[0].type;
    //console.log(file_type);
    if (file_size > FILE_SIZE_IN_MB) {
      setErrorMessage("File size must be below 16 MB.");
    } else if (
      ![
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.ms-powerpoint",
        "image/jpeg",
        "image/png",
      ].includes(file_type)
    ) {
      setErrorMessage(
        "Only PDF, Word, PowerPoint, JPEG, and PNG files are accepted."
      );
    } else {
      setErrorMessage("");
      setSuccessMessage("");
      setFile(event.target.files[0]);
    }
  }

  function handleFileSubmit(event) {
    setSuccessMessage("");
    event.preventDefault();
    if (!file) {
      setErrorMessage("Please select a file to upload.");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("course_id", props.courseId);
    formData.append("activity_id", props.categoryId);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    dispatch(uploadContentFile({ formData, config })).then(() => {
      dispatch(getCourseByCourseId(props.courseId)).then(() => {
        setLoading(false);
        fileUploadForm.current.reset();
        setFile("");
        setErrorMessage("");
        setSuccessMessage("File uploaded successfully!");
      });
    });
  }

  return (
    <>
      {props.user.role !== "student" && (
        <Grid item md={12} sx={{ justifyContent: "center" }}>
          <Box
            component="section"
            sx={{
              p: 2,
              border: "1px dashed grey",
              marginTop: "4em",
              marginBottom: "1em",
            }}
          >
            <form onSubmit={handleFileSubmit} ref={fileUploadForm}>
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
              {successMessage && (
                <Alert severity="success" onClose={() => setSuccessMessage("")}>
                  {successMessage}
                </Alert>
              )}
              <input
                type="file"
                onChange={handleChange}
                className="choose_File"
              ></input>
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                type="submit"
                style={{ margin: "10px" }}
                disabled={errorMessage}
              >
                Upload
              </Button>
            </form>
            <p style={{ color: "red" }}>
              *Accepted files: PDF, Word, PowerPoint, JPEG, and PNG. Files must
              not exceed 16MB.
            </p>
          </Box>
        </Grid>
      )}
    </>
  );
};

export default FileUpload;
