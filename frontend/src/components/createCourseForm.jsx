import React, { useState, useEffect } from 'react' 
import { useDispatch } from 'react-redux'
import { createCourse } from '../features/courses/courseSlice' 
import classService from '../features/courses/classService'
import Grid from '@mui/material/Grid';

// material ui
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

import Button from '@mui/material/Button';

function CreateCourseForm() {
  const [courseName, setCourseName] = useState('')
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState([])

  // material ui multi select
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const dispatch = useDispatch();

  const theme = useTheme();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classList = await classService.getClasses()
        console.log(classList)
        setClasses(classList);
      } catch (error) {
        console.error('Failed to fetch classes:', error)
      }
    };
    fetchClasses()
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(createCourse({ courseName, classId: selectedClass }));
      setCourseName('');
      setSelectedClass([]);
    } catch (error) {
      console.error('Failed to create course:', error);
      // Handle error
    }
  };

  return (
    <React.Fragment>
    <CssBaseline />
    <Container maxWidth="lg">
      <Box sx={{ flexGrow: 1, mt: 4 }}>
        <form onSubmit={onSubmit}>
          <h1> Create Course</h1>
          <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  id="courseName"
                  label="Course Name"
                  variant="outlined"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined">
                    <InputLabel id="class-multiple-select-label">Select Class</InputLabel>
                    <Select
                      labelId="class-multiple-select-label"
                      name='class'
                      id='class'
                      multiple
                      value={selectedClass}
                      input={<OutlinedInput label="Name" />}
                      MenuProps={MenuProps}
                      onChange={(e) => {
                        console.log('select class value:', e.target.value);
                        setSelectedClass(e.target.value)
                      }}
                    >
                      {classes && classes.map((cls) => (
                        <MenuItem
                          key={cls._id}
                          value={cls._id}
                        >
                          {cls.className}
                        </MenuItem>
                      ))}
                    </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <Button type="submit" fullWidth variant="contained" color="primary">
                  Create Course
                </Button>
              </Grid>

          </Grid>
        </form>
      </Box>
     
    </Container>
  </React.Fragment>

  
   
  )
}

export default CreateCourseForm
