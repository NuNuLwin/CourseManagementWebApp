import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import Spinner from "../components/Spinner"
import { getStudents,registerStudents, reset } from '../features/students/studentslice'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid';

function Dashboard() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {user} = useSelector((state) => state.auth)
  const { students, isLoading, isError, isSuccess, message } = useSelector(//2. put students data in students state
    (state) => state.students
  )

  useEffect(()=> {
    console.log("use effect start")
    if(isError){
      console.log(message);
    }

    if(!user){
      console.log('navigate to login from dashboard')
      navigate('/login')
    }

    console.log("use effect student list "+students)

    dispatch(getStudents("66612c67e68eaae1d01648ab"))//1. retrieve students here and 

    return () => {
      dispatch(reset()) // 3. clear students data if leave this page
    }
  },[user,navigate, isError, message, dispatch])// these are dependenies use inside useEffect(). we use user, navigate, isError, message and dispatch

  if(isLoading){
    return <Spinner/>
  }

  const columns = [
    { field: 'studentname', headerName: 'Name', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'classname', headerName: 'Class', width: 100 },
    { field: 'semester', headerName: 'Semester', width: 100 },
    { field: 'registrationstatus', headerName: 'Registration Status', width: 200 },
  ];

  return (
    <>
    
      {/* <h1>Welcome {user && user.name}</h1> */}
    


    {/* <section className='content'>
      {students.length > 0 ? (
        <div className='goals'>
        {
          students.map((student) => (
            <GoalItem key={student.id} student={student} />
          ))}
        </div>
      ) :
      (
        <h3>There is no student</h3>
      )}
    </section> */}

    <div style={{ height: 400, width: '100%' }}>

      <h3 style={{textAlign:'left', margin:"0 0 4vh 0"}}>CS700: Human-computer Interfaction fundamental</h3>
      <h5 style={{textAlign:'right', margin:"2vh 0 0 0"}}>Total: 40</h5>
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
                  <Button  sx={{ mt: 3, mb: 2 }} variant="contained" style={ {backgroundColor: "#1E56A0"}} onClick={() => dispatch(registerStudents("66612c67e68eaae1d01648ab"))}> 
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



    </div>

    {/* <button  onClick={() => dispatch(registerStudents("66612267e68eaae1d01648a7"))} className='btn btn-block'>Register Student</button> */}

     
    </>
  )
}

export default Dashboard