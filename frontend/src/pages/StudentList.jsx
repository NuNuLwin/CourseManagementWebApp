import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner"
import { getStudents,registerStudents, reset } from '../features/students/studentslice'
import { getCourseByCourseId } from "../features/courses/courseSlice";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid';


import {
    Box,
    Container,
    CssBaseline,
    Breadcrumbs,
    Typography,
    Link,
    Stack,
  } from "@mui/material";

function StudentList() {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { courseId } = useParams();

  const {user} = useSelector((state) => state.auth)
  const { students, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.students
  )
  const { courses, isLoadingCourse, isErrorCourse, isSuccessCourse, messageCourse } = useSelector(
    (state) => state.course
  );

  const course = courses[0];
  useEffect(()=> {
    if(isError){
      console.log(message);
    }

    dispatch(getCourseByCourseId(courseId));

    dispatch(getStudents(courseId))

    return () => {
      dispatch(reset())
    }
  },[isError, message, dispatch])

  if(isLoading){
    return <Spinner/>
  }


  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      href="/"
      onClick={() => navigate("/courseList")}
    >
      Courses
    </Link>,
    <Typography key="3" color="text.primary">
      Registration
    </Typography>,
  ];

  const columns = [
    { field: 'studentname', headerName: 'Name', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'classname', headerName: 'Class', width: 100 },
    { field: 'semester', headerName: 'Semester', width: 100 },
    { field: 'registrationstatus', headerName: 'Registration Status', width: 200 },
  ];

  return (
    <>
     <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ flexGrow: 1, mt: 4 }}>
          <Grid container>
            <Grid item md={12} xs={12}>
              <Stack spacing={2}>
                <Breadcrumbs separator="›" aria-label="breadcrumb">
                  {breadcrumbs}
                </Breadcrumbs>
              </Stack>
              <h2 > {course.courseName}</h2>
              <h3 >Student Registration</h3>
              <h5 style={{textAlign:'right'}}>Total: {students.length}</h5>
              <Grid container>
              {students.length > 0 ? (
                    <DataGrid
                    rows={students}
                    columns={columns}
                    initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                    }}
                    pageSizeOptions={[5, 10]}
                />

                ) :
                (
                    <h3>There is no student</h3>
                ) 
                }

                {students.length > 0 ?
                    (
                        students[0].registrationstatus === 'unregistered' ? 
                        (
                        <Grid container spacing={0.5}  justifyContent="flex-end">
                            <Grid item xs={2}  >
                            <Button  sx={{ mt: 3, mb: 2 }} variant="contained" style={ {backgroundColor: "#1E56A0"}} onClick={() => dispatch(registerStudents(courseId))}> 
                                Register
                            </Button>
                            </Grid>
                            <Grid item xs={2} >
                                <Button  sx={{ mt: 3, mb: 2 }} variant="contained" style={ {backgroundColor: "#1E56A0"}}> 
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                        ) :
                        (
                        console.log('hide buttons if students are already registered')
                        )

                    ):
                    (
                        console.log('hide buttons if there are no students')
                    )
                }

              </Grid>
            </Grid>
          </Grid>
        </Box>
    </Container>
     
    </>
  )
}

export default StudentList