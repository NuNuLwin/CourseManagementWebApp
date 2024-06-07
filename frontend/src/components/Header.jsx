import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import Avatar from "@mui/material/Avatar";
import School from "@mui/icons-material/School";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import { Container, Grid, Divider } from "@mui/material";
import Box from "@mui/material/Box";
import LogoutIcon from "@mui/icons-material/Logout";
import { Typography } from "@mui/material";

function Header({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    console.log("logout click");
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  const onCreateCourse = () => {
    navigate("/createCourse");
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        <Grid
          container
          justify="space-between"
          columnGap={0}
          sx={{ margin: "20px 0 0 0" }}
        >
          <Grid item xs={2}>
            <img
              src={process.env.PUBLIC_URL + "/higher-education.png"}
              alt="Logo"
              style={{
                width: "50px",
                height: "50px",
                // marginBottom: "16px",
              }}
            />
            <Typography
              variant="h6"
              style={{
                display: "inline-flex",
                marginLeft: "1em",
                marginBottom: "0.5em",
                height: "100%",
                verticalAlign: "middle",
              }}
            >
              EDU LINK
            </Typography>
          </Grid>

          <Grid
            item
            xs={8}
            style={{
              paddingTop: "0.5em",
            }}
          >
            {user && (
              <>
                <Button onClick={onCreateCourse} className="buttoncolor">
                  My Courses
                </Button>
                <Button onClick={onCreateCourse} className="buttoncolor">
                  Create Course
                </Button>
              </>
            )}
          </Grid>

          {/* <Grid item xs={2}>
            {user && (
              <Button onClick={onCreateCourse} className="buttoncolor">
                My Courses
              </Button>
            )}
          </Grid>

          <Grid item xs={2}>
            {user && (
              <Button onClick={onCreateCourse} className="buttoncolor">
                Create Courses
              </Button>
            )}
          </Grid> */}

          <Grid
            item
            xs={2}
            style={{
              textAlign: "right",
              paddingTop: "0.5em",
            }}
          >
            {user && (
              <Button
                onClick={onLogout}
                className="buttoncolor"
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            )}
          </Grid>
        </Grid>
      </Container>
      <Divider orientation="horizontal" />
      {children}
    </>
  );
}

export default Header;
