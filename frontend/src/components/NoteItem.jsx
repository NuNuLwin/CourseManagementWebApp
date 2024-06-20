import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { TextField, Tooltip, IconButton } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EditNoteIcon from "@mui/icons-material/EditNote";

function NoteItem({ noteid, note, updateLectureNote }) {
  // console.log("Note Item noteid " + noteid + " note.text " + note.text);
  const [text, setText] = React.useState("");
  const [viewOnly, setViewOnly] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  useEffect(() => {
    setText(note.text);
  }, [note.text]);

  const inputProps = {
    step: 300,
    margin: "none",
    style: { fontSize: 10 },
  };

  const handleUpdateNote = (subnoteid, notetext) => {
    // console.log("handleUpdateNote noteid " + noteid + " notetext " + notetext);
    updateLectureNote(noteid, subnoteid, notetext);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <Box>
      {/* {console.log(
        " NoteItem note " +
          note.date +
          " text " +
          note.text +
          " viewonly " +
          viewOnly
      )} */}
      <Typography variant="subtitle2" gutterBottom>
        {moment(note.date).format("DD MMM YYYY HH:MM")}
      </Typography>
      <TextField
        fullWidth
        inputProps={inputProps}
        id="outlined-multiline-static"
        multiline
        value={text} //value={!viewOnly ? (note.text) : (text)}
        onChange={(e) => setText(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <Box display="flex" justifyContent="flex-end">
        <Tooltip title={"Save Note"} arrow>
          <IconButton
            aria-label="SaveNote"
            onClick={() => {
              handleUpdateNote(note._id, text);
            }}
            sx={{
              color: isFocused ? "primary.main" : "grey.500",
            }}
          >
            <EditNoteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default NoteItem;
