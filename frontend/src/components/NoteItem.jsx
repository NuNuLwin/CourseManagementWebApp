import React from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import moment from "moment";
import { TextField,Button } from "@mui/material";


function NoteItem({note}) {
const [text, setText] = React.useState('')
const [viewOnly, setViewOnly] = React.useState(false)

const onNoteClick = () => {
    setText(note.text)
     console.log("box is clicked viewonly "+viewOnly)
     setViewOnly(true)
}

//   React.useEffect(() => {
    

//   },[viewOnly])

  return (
    <Box onClick={onNoteClick}>
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

                "& .MuiInputBase-root": {
                color: "black",
                "& > fieldset": {
                    borderColor: "rgb(171, 171, 171)",
                },
              
                },
             }}
            id="outlined-multiline-static"
            multiline
            value={!viewOnly ? (note.text) : (text)}
            onChange={(e) => setText(e.target.value)}
        />
        {/* <Button size="small"  >Cancel</Button>
        <Button size="small" >Post</Button> */}

    </Box>
  )
}

export default NoteItem