import React,{ useEffect }from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import moment from "moment";
import { TextField,Button,IconButton } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';

function NoteItem({noteid,note,updateLectureNote}) {
console.log("Note Item noteid "+ noteid + " note.text "+note.text)
const [text, setText] = React.useState('')
const [viewOnly, setViewOnly] = React.useState(false)

useEffect(() => {
    console.log("Note Item use effect text "+ text + " note.text "+note.text)
    setText(note.text)
  }, [note.text]);


const onNoteClick = () => {
    setText(note.text)
     console.log("box is clicked viewonly "+viewOnly)
    // setViewOnly(true)
}

const handleUpdateNote= (subnoteid,notetext) => {
    console.log("handleUpdateNote noteid "+noteid+" notetext " +notetext)
    updateLectureNote(noteid,subnoteid,notetext);
};


  return (
    <Box onClick={onNoteClick} >
        {console.log(" NoteItem note "+note.date + " text "+note.text+" viewonly "+viewOnly)}
        <Typography variant="subtitle2" gutterBottom>
            {moment(note.date).format("DD MMM YYYY HH:MM")}
        </Typography>
        {/* <Typography variant="body2" gutterBottom>
        {note.text}
        </Typography> */}

        <TextField
            fullWidth
            sx={{
                "& fieldset": { border: 'none' },
            
             }}
            id="outlined-multiline-static"
            multiline
            value={text}//value={!viewOnly ? (note.text) : (text)}
            onChange={(e) => setText(e.target.value)}
        />
        <Box display="flex" justifyContent="flex-end">
          <IconButton aria-label="SaveNote" onClick={() => {
              handleUpdateNote(note._id,text) 
             }
            }>
            <SaveIcon />
         </IconButton>
        </Box>
        {/* <Button size="small"  >Cancel</Button>
        <Button size="small" >Post</Button> */}

    </Box>
  )
}

export default NoteItem