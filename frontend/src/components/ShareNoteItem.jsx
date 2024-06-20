import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { TextField, Button, Grid } from "@mui/material";

function ShareNoteItem({ sharenote }) {
  const [text, setText] = React.useState("");

  return (
    <Box p={1} sx={{ border: "1px solid grey", borderRadius: 2, mb: 1 }}>
      <Typography variant="subtitle2" gutterBottom>
        {moment(sharenote.date).format("DD MMM YYYY HH:MM")}
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        shared by {sharenote.shareby}
      </Typography>
      <Box>
        <Typography variant="body1" gutterBottom>
          {sharenote.text}
        </Typography>
      </Box>
    </Box>
  );
}

export default ShareNoteItem;
