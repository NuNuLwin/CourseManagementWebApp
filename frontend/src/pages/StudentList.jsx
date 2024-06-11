import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import {
  getStudents,
  registerStudents,
  reset,
} from "../features/students/studentslice";
import { getCourseByCourseId } from "../features/courses/courseSlice";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courseId } = useParams();

  const { user } = useSelector((state) => state.auth);
  const { students, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.students
  );
  const {
    courses,
    isLoadingCourse,
    isErrorCourse,
    isSuccessCourse,
    messageCourse,
  } = useSelector((state) => state.course);

  const course = courses[0];
  const [isRegistered,setRegistrationStatus] = useState(true);

  useEffect(() => {
    console.log('use effects student list '+students.length)
    if (isError) {
      console.log(message);
    }


    dispatch(getCourseByCourseId(courseId));

    dispatch(getStudents(courseId));
    return () => {
      dispatch(reset());
    };
  }, [isError, message, dispatch]);

  useEffect(() => {
    console.log('use effects after dispatch student list '+students.length)
    if (students.length > 0 && isSuccess && !isLoading) {
        students?.filter((student) => {
          console.log('each student student.registrationstatus  '+ student.registrationstatus );
          if (student.registrationstatus === "unregistered") {
            setRegistrationStatus(false);
          }
      })
    }

  }, [students, isSuccess, isLoading]);

  const onRegisterStudent = () => {
    setRegistrationStatus(true)
    dispatch(registerStudents(courseId))
  }

  if (isLoading) {
    return <Spinner />;
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
    {
      field: "studentname",
      headerName: "Name",
      width: 250,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "classname",
      headerName: "Class",
      width: 250,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "registrationstatus",
      headerName: "Registration Status",
      width: 200,
      headerAlign: "left",
      align: "left",
    },
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
              <Grid container>
                <Grid item md={12} xs={12}>
                  <h2> {course.courseName}</h2>
                </Grid>
                <Grid item md={6} xs={12}>
                  <h3 style={{ fontWeight: "bold", color: "#000000" }}>
                    Student Registration
                  </h3>
                </Grid>
                <Grid item md={6} xs={12}>
                  <h3
                    style={{
                      textAlign: "right",
                      color: "#000000",
                      fontWeight: "bold",
                    }}
                  >
                    Total: {students.length}
                  </h3>
                </Grid>
              </Grid>
              <Grid container>
                {students.length > 0 ? (
                  <Paper elevation={2} sx={{ width: "100%" }}>
                    <div style={{ width: "100%" }}>
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
                    </div>
                  </Paper>
                ) : (
                  <Grid item md={12} xs={12}>
                  <h3 style={{textAlign: "center"}}>There is no students registered in this course.</h3>
                  </Grid>
                )}

                {students.length > 0 ? (
                    !isRegistered ? ( //students[0].registrationstatus === "unregistered" ? (
                    <Grid container spacing={2} justifyContent="flex-end">
                      <Grid item>
                        <Button
                          sx={{ mt: 3, mb: 2 }}
                          variant="contained"
                          style={{ backgroundColor: "#1876d2" }}
                          onClick={onRegisterStudent}
                        >
                          Register
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          sx={{ mt: 3, mb: 2 }}
                          variant="contained"
                          style={{ backgroundColor: "#1876d2" }}
                          onClick={() => navigate("/courseList")}
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  ) 
                  : (
                    console.log(
                      "hide buttons if all students are registered"
                    )
                  )
                  
                ) : (
                  console.log("hide buttons if there are no students")
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default StudentList;
