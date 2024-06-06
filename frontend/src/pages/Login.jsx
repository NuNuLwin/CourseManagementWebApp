import {useState, useEffect} from 'react'
import {FaSignInAlt, FaUser} from 'react-icons/fa'
import {useSelector, useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import {login, register, reset} from '../features/auth/authSlice'
import Spinner from '../components/Spinner'
import * as React from 'react';
import Button from '@mui/material/Button'
import LoginIcon from '@mui/icons-material/Login';
import Card from '@mui/material/Card';
import { Avatar, Container, TextField } from '@mui/material'
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
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

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

const {email, password} = formData

const navigate = useNavigate()
const dispatch = useDispatch()

const {user, isloading, isError, isSuccess, message} = useSelector(
    (state) => state.auth
) 

useEffect(()=>{
    console.log('error '+message)
    if (isError){
        toast.error(message)
    }
    if(isSuccess && user){
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
    console.log(`login click ${process.env.PUBLIC_URL}`)
    const userData = {
        email,
        password,
    }
    dispatch(login(userData))//call authslice file
}

const onLinkSingup = () => {
    // e.preventDefault()
    console.log("signup click")
     navigate('/register')
}

if(isloading){
    return <Spinner/>
}

const paperStyle = {padding:20, height: "40vh", width: "40vh", borderRadius: 20, margin:"10vh auto"}
const color = {backgroundColor: "#D8E2EF"}
const darkcolor = {backgroundColor: "#1E56A0"}
  return (
    <ThemeProvider theme={ themeLight }>
    <CssBaseline />
     {/* <section>
        <h1>
        <FaSignInAlt/> Login
        </h1>
        <p>Login to Course Management Platform</p>
    </section>  */}

    {/* <Container maxWidth='lg'  style={darkcolor}>
    <Grid container spacing={4}>
            <Grid item lg={2} style={color}>
                <Avatar sx={{ bgcolor: '#D8E2EF' }}><LockOutlinedIcon/></Avatar>
            </Grid>
            <Grid item lg={2} style={darkcolor}>
            </Grid>
            <Grid item lg={4} style={color}>
            </Grid> 
            <Grid item lg={4} style={darkcolor}>
            </Grid>  
    </Grid>
    </Container> */}
    
    <Grid container  >
        <Paper elevation={10} style={paperStyle}>
            {/* <form onSubmit={onSubmit} > */}
            <Box component="form" onSubmit={onSubmit}>
                <Grid  >
                    {/* <Box sx={{ mt: 10 }} > */}
                    <h2 >Sign In</h2>
     
                    <TextField  autoFocus margin="normal" fullWidth variant="outlined" label="email*" type='email'  id="email" name='email' value={email} onChange={onChange}/>
                    <TextField margin="normal" fullWidth variant="outlined" label="password*" type='password' id="password" name='password' value={password} onChange={onChange}/>
                    <Button fullWidth sx={{ mt: 3, mb: 2 }} variant="contained" style={ {backgroundColor: "#1E56A0"}} type='submit' > 
                        login
                    </Button>

                    {/* </Box> */}
                </Grid>
              
                    
                <Grid item>
                    <Link href="#" variant="body2" onClick={onLinkSingup}>
                    {"Don't have an account? Sign Up"}
                    </Link>
                </Grid>

            {/* </form> */}
            </Box>
        </Paper>
    </Grid>

    </ThemeProvider>
  )
}

export default Login