import React from "react";
import { Grid, IconButton, Link, Tooltip, Typography } from "@mui/material";
import {
  StickyNote2 as StickyNote2Icon,
  People as PeopleIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import moment from "moment";

const ContentFileItem = ({
  file,
  viewContent,
  contentDownload,
  getLectureNotes,
  noteOpen,
  setSelectedFile,
  getShareLectureNotes,
  shareNoteOpen,
  user,
  courseId,
  categoryId,
  geAllNotesByCourse,
  getAllSharedNotesByCourse,
}) => {
  return (
    <Grid container sx={{ bgcolor: "#D6E4F0", p: 2, mb: 2, borderRadius: 0 }}>
      <div></div>
      <Grid item md={6} xs={12}>
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            viewContent(file.file, file.filename);
          }}
          underline="hover"
        >
          {file.filename}
        </Link>
      </Grid>
      <Grid item md={3} xs={12}>
        <Typography variant="body1" gutterBottom>
          {moment(file.uploadDate).format("DD MMM YYYY HH:MM")}
        </Typography>
      </Grid>

      <Grid item md={3} xs={12}>
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
          }}
        >
          <Tooltip title={"Download File"} arrow>
            <IconButton
              aria-label="download-content-file"
              onClick={() => contentDownload(file.file, file.filename)}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={"Add Note"} arrow>
            <IconButton
              aria-label="Note"
              onClick={() => {
                // ** open note dialog to add note
                console.log(
                  "open note dialog student id " +
                    user._id +
                    " course id " +
                    courseId +
                    " file id " +
                    file.file +
                    " activity id " +
                    categoryId
                );
                getLectureNotes(user._id, courseId, file.file, categoryId);
                noteOpen();
                setSelectedFile(file.file);
              }}
            >
              <StickyNote2Icon />
              <div>
                {
                  geAllNotesByCourse
                    .filter(
                      (note) =>
                        note.user === user._id &&
                        note.file === file.file &&
                        note.activity == categoryId
                    )
                    .map((specificnote) => {
                      {
                        console.log(
                          "specific note " +
                            specificnote.notes.length +
                            " file id " +
                            file.file
                        );
                      }
                      return (
                        <p
                          style={{
                            color: "#0d3675",
                            fontWeight: "bold",
                            fontSize: 15,
                          }}
                        >
                          {specificnote.notes.length}
                        </p>
                      );
                    })
                  // .length > 0 ? (
                  //       console.log("nth")

                  // ) : (
                  //   <p>0</p>
                  // )
                }
              </div>
            </IconButton>
          </Tooltip>
          <Tooltip title={"View Shared Notes"} arrow>
            <IconButton
              aria-label="ViewNote"
              onClick={() => {
                // ** open note dialog to view note
                console.log("open note to view share note");
                getShareLectureNotes(user._id, file.file);
                shareNoteOpen();
              }}
            >
              <PeopleIcon />
              <div>
                {getAllSharedNotesByCourse
                  .filter(
                    (note) => note.user === user._id && note.file === file.file
                  )
                  .map((membernotes) => {
                    return (
                      <p
                        style={{
                          color: "#0d3675",
                          fontWeight: "bold",
                          fontSize: 15,
                        }}
                      >
                        {membernotes.notes.length}
                      </p>
                    );
                  })}
              </div>
            </IconButton>
          </Tooltip>
        </div>
      </Grid>
    </Grid>
  );
};

export default ContentFileItem;
