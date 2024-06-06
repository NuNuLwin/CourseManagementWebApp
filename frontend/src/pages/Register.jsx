import {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import {FaUser} from 'react-icons/fa'
import {register, reset} from '../features/auth/authSlice'
import Spinner from '../components/Spinner'
import { TextField } from '@mui/material'
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const themeLight = createTheme({
    palette: {
      background: {
        default: "#D8E2EF"
      }
    }
  });

function Register() { 
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        password2: '',
        role: ''
    })

const {firstname, lastname, email, password, password2, role} = formData
const navigate = useNavigate()
const dispatch = useDispatch()

const {user, isloading, isError, isSuccess, message} = useSelector(
    (state) => state.auth
)

useEffect(()=>{
    if (isError){
        toast.error(message)
    }
    if(isSuccess || user){
        navigate('/Dashboard')
    }

    dispatch(reset())
},[user, isError, isSuccess, message, navigate, dispatch])

const onChange = (e) =>{
  setFormData((prevState)=> ({
    ...prevState,
    [e.target.name]: e.target.value,
  }))


}
const onSubmit = (e) =>{
    e.preventDefault()

    // if (password != password2){
    //     toast.error('Passwords do not match')
    // }else{ 

        const userData = {
            firstname,
            lastname,
            email,
            password,
            role
        }
        dispatch(register(userData))
    // }
}

const onLinkSingin = () => {
     navigate('/')
}

if(isloading){
    return <Spinner/>
}
const paperStyle = {padding:30, height: "60vh", width: "60vh", borderRadius: 20, margin:"3vh auto"}

  return <>
    <ThemeProvider theme={ themeLight }>
    <CssBaseline />
    {/* <section>
        <h1>
            <FaUser/> Register
        </h1>
        <p>Please create an account</p>
    </section> */}

    <Grid container  >
        <Paper elevation={10} style={paperStyle}>
            {/* <form onSubmit={onSubmit} > */}
            <Box component="form" onSubmit={onSubmit}>
            {/* <div className="form-group">
                <input type='text' className='form-control' id='firstname' name='firstname' value={firstname}
                placeholder='Enter your first name' onChange={onChange}/>
            </div> */}

            {/* <div className="form-group">
                <input type='text' className='form-control' id='lastname' name='lastname' value={lastname}
                placeholder='Enter your last name' onChange={onChange}/>
            </div> */}
              <h2 >Sign up</h2>
              <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
              <TextField  autoFocus margin="normal" fullWidth variant="outlined" type='text' label="First Name*" id="firstname" name='firstname' value={firstname} onChange={onChange}/>
              </Grid>
              <Grid item xs={12} sm={6}>
              <TextField  margin="normal" fullWidth variant="outlined" type='text'  label="Last Name*"  id="lastname" name='lastname' value={lastname} onChange={onChange}/>
              </Grid>
              </Grid>

            {/* <div className="form-group">
                <input type='email' className='form-control' id='email' name='email' value={email}
                placeholder='Enter your email' onChange={onChange}/>
            </div> */}
             <Grid item xs={12}>
              <TextField  margin="normal" fullWidth variant="outlined"  type='email' label="Email Address*" id="email" name='email' value={email} onChange={onChange}/>
            </Grid>
            {/* <div className="form-group">
                <input type='password' className='form-control' id='password' name='password' value={password}
                placeholder='Enter password' onChange={onChange}/>
            </div> */}
             <Grid item xs={12}>
              <TextField  margin="normal" fullWidth variant="outlined" type='password'  label="Password*"  id="password" name='password' value={password} onChange={onChange}/>
            </Grid>
            {/* <div className="form-group">
                <input type='password' className='form-control' id='password2' name='password2' value={password2}
                placeholder='Confirm password' onChange={onChange}/>
            </div> */}
              {/* <TextField  margin="normal" fullWidth variant="outlined" type='password' label="password2"   id="password2" name='password2' value={password2} onChange={onChange}/> */}

            {/* <div className="form-group">
                <input type='text' className='form-control' id='role' name='role' value={role}
                placeholder='Enter role' onChange={onChange}/>
            </div> */}
             <Grid item xs={12}>
              <TextField  margin="normal" fullWidth variant="outlined" type='type'  label="Role*"  id="role" name='role' value={role} onChange={onChange}/>
              </Grid>
              
            {/* <div className="form-group">
                <button type='submit' className='btn btn-block'>
                    Submit
                </button>
            </div> */}
            <Button fullWidth sx={{ mt: 3, mb: 2 }} variant="contained" style={ {backgroundColor: "#1E56A0"}} type='submit' >
                Sign Up
            </Button>

            <Grid item>
                <Link href="#" variant="body2" onClick={onLinkSingin}>
                  {"Already have an account? Sign in"}
                </Link>
            </Grid>

        </Box>
    </Paper>
    </Grid>
    
</ThemeProvider>
  </>
}

export default Register