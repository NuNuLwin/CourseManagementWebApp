import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// redux
import { register, reset } from "../features/auth/authSlice";

// components
import Spinner from "../components/Spinner";

// material components
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Link,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";

// material styles
import { ThemeProvider, createTheme } from "@mui/material/styles";

// material css
import CssBaseline from "@mui/material/CssBaseline";

// material icons
import CheckIcon from "@mui/icons-material/Check";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";

const themeLight = createTheme({
  palette: {
    background: {
      default: "#D8E2EF",
    },
  },
});

function Register() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    password2: "",
    role: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("");

  const { firstname, lastname, email, password, password2, role } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isloading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      setAlertMsg(message);
      setAlertType("error");
      setShowAlert(true);
    }
    if (isSuccess && user && !isloading) {
      setAlertMsg("Your account has been successfully created.");
      setAlertType("success");
      setShowAlert(true);

      setTimeout(() => navigate("/"), 3000);
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onRoleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      role: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // clean up alert
    setShowAlert(false);
    setAlertMsg("");
    setAlertType("");

    // if (password != password2){
    //     toast.error('Passwords do not match')
    // }else{

    const userData = {
      firstname,
      lastname,
      email,
      password,
      role,
    };
    dispatch(register(userData));
    // }
  };

  const onLinkSingin = () => {
    navigate("/");
  };

  if (isloading) {
    return <Spinner />;
  }
  const paperStyle = {
    padding: 30,
    //height: "60vh",
    //width: "60vh",
    borderRadius: 20,
    margin: "3vh auto",
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
        <Grid container sx={{ flexGrow: 1 }}>
          {/* Left side */}
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              backgroundColor: "#D6E4F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              //paddingRight: { md: "16px", xs: "0px" },
            }}
          >
            <Container maxWidth="xs" sx={{ textAlign: "center" }}>
              <img
                src={process.env.PUBLIC_URL + "/higher-education.png"}
                alt="Logo"
                style={{
                  width: "100px",
                  height: "100px",
                  marginBottom: "16px",
                }}
              />
              <h1>Welcome From EDU LINK</h1>
              Already have an account?&nbsp;
              <Link href="#" variant="body2" onClick={onLinkSingin}>
                {"Sign in"}
              </Link>
            </Container>
          </Grid>

          {/* Right side */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              backgroundColor: "#1E56A0",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: { md: "16px" },
            }}
          >
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
                <h2>Sign up</h2>
                {showAlert ? (
                  <Alert
                    severity={alertType}
                    style={{
                      marginBottom: "10px",
                    }}
                  >
                    {alertMsg}
                  </Alert>
                ) : null}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoFocus
                      margin="normal"
                      fullWidth
                      variant="outlined"
                      type="text"
                      label="First Name*"
                      id="firstname"
                      name="firstname"
                      value={firstname}
                      onChange={onChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="normal"
                      fullWidth
                      variant="outlined"
                      type="text"
                      label="Last Name*"
                      id="lastname"
                      name="lastname"
                      value={lastname}
                      onChange={onChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                {/* <div className="form-group">
                <input type='email' className='form-control' id='email' name='email' value={email}
                placeholder='Enter your email' onChange={onChange}/>
            </div> */}
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    fullWidth
                    variant="outlined"
                    type="email"
                    label="Email Address*"
                    id="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                {/* <div className="form-group">
                <input type='password' className='form-control' id='password' name='password' value={password}
                placeholder='Enter password' onChange={onChange}/>
            </div> */}
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    fullWidth
                    variant="outlined"
                    type="password"
                    label="Password*"
                    id="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
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
                {/* <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    fullWidth
                    variant="outlined"
                    type="type"
                    label="Role*"
                    id="role"
                    name="role"
                    value={role}
                    onChange={onChange}
                  />
                </Grid> */}

                <Grid item xs={12}>
                  <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Role:
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-label="role"
                      name="role"
                      value={role}
                      onChange={onRoleChange}
                    >
                      <FormControlLabel
                        value="instructor"
                        control={<Radio />}
                        label="Instructor"
                      />
                      <FormControlLabel
                        value="student"
                        control={<Radio />}
                        label="Student"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {/* <div className="form-group">
                <button type='submit' className='btn btn-block'>
                    Submit
                </button>
            </div> */}
                <Button
                  fullWidth
                  sx={{ mt: 3, mb: 2 }}
                  variant="contained"
                  style={{ backgroundColor: "#1E56A0" }}
                  type="submit"
                  disabled={isloading ? "disabled" : ""}
                >
                  Sign Up
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Register;
