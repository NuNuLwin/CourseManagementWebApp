import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login, register, reset } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";
import * as React from "react";
import Button from "@mui/material/Button";
import {
  Avatar,
  Container,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const themeLight = createTheme({
  palette: {
    background: {
      default: "#D8E2EF",
    },
  },
});

function Login() {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isloading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    //console.log("error " + message);
    if (isError) {
      toast.error(message);
    }
    if (isSuccess && user) {
      navigate("/courseList");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    //console.log(`login click ${process.env.PUBLIC_URL}`);
    const userData = {
      email,
      password,
    };
    dispatch(login(userData));
  };

  const onLinkSingup = () => {
    // e.preventDefault()
    navigate("/register");
  };

  if (isloading) {
    return <Spinner />;
  }

  const paperStyle = {
    padding: 20,
    height: "40vh",
    width: "40vh",
    borderRadius: 20,
    margin: "10vh auto",
  };
  const color = { backgroundColor: "#D8E2EF" };
  const darkcolor = { backgroundColor: "#1E56A0" };
  const EndAdorment = ({ visible, setVisible }) => {
    return (
      <InputAdornment position="end">
        <IconButton onClick={() => setVisible(!visible)}>
          {visible ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
        </IconButton>
      </InputAdornment>
    );
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
              Don't have an account?&nbsp;
              <Link href="#" variant="body2" onClick={onLinkSingup}>
                {"Sign Up"}
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
            <Paper
              elevation={1}
              sx={{
                padding: "2em",
                //   minWidth: "300px",
                //   margin: { md: "auto", xs: "16px auto" },
                //position: "absolute",
                top: { md: "30vh", xs: "30vh", sm: "30vh" },
                right: { md: "15vw", xs: "10vw", sm: "15vw" },
                borderRadius: "16px",
              }}
            >
              <Box component="form" onSubmit={onSubmit}>
                <h2>Sign In</h2>

                <TextField
                  autoFocus
                  margin="normal"
                  fullWidth
                  variant="outlined"
                  label="Email*"
                  type="email"
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
                <TextField
                  margin="normal"
                  fullWidth
                  variant="outlined"
                  label="Password*"
                  type={!visible ? "password" : "text"}
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
                    endAdornment: (
                      <EndAdorment visible={visible} setVisible={setVisible} />
                    ),
                  }}
                />
                <Button
                  fullWidth
                  sx={{ mt: 3, mb: 2 }}
                  variant="contained"
                  style={{ backgroundColor: "#1E56A0" }}
                  type="submit"
                >
                  login
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Login;
