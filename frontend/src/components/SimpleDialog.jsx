import * as React from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';
import studentNoteService from '../features/studentnote/studentnoteservice'

const emails = ['username@gmail.com', 'user02@gmail.com'];

export default function SimpleDialog({open,onClose,studentList}) {

  // const { goals, isLoading, isError, isSuccess, message } = useSelector(
  //   (state) => state.goals
  // )

  // useEffect(() => {
    
  // },[dispatch])


  // const getStudentListByCourse = async (course) => {
  //   try {
  //     const studentlist =  await studentNoteService.getStudentListByCourse(course)
  //     console.log(" getStudentListByCourse studentlist "+studentlist.length)
  //   } catch (error) {
  //     console.log("getStudentListByCourse error "+error)
  //   }

  // }

  const handleClose = () => {
    onClose("");
  };

  const handleListItemClick = (studentid) => {
    console.log("handleListItemClick "+studentid)
    onClose(studentid);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Choose the person to share with</DialogTitle>
      <List sx={{ pt: 0 }}>
        {studentList.map((student) => (
          <ListItem disableGutters key={student.email}>
            <ListItemButton onClick={() => handleListItemClick(student.id)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={student.email} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}