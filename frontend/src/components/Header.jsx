import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import { Container, Grid, Divider, Box, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

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

  const onMyCourses = () => {
    navigate("/courseList");
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
                marginLeft: "0.5em",
                marginBottom: "0.5em",
                height: "100%",
                verticalAlign: "middle",
                color: "#0D3675",
                fontStyle: "normal",
                fontWeight: "300",
              }}
            >
              EDU LINK
            </Typography>
          </Grid>

          <Grid
            item
            xs={4}
            style={{
              paddingTop: "0.5em",
            }}
          >
            {user && (
              <>
                <Button onClick={onMyCourses} className="buttoncolor menu_font">
                  My Courses
                </Button>
                <Button
                  onClick={onCreateCourse}
                  className="buttoncolor menu_font"
                >
                  Create Course
                </Button>
              </>
            )}
          </Grid>

          <Grid
            item
            xs={6}
            style={{
              textAlign: "right",
              paddingTop: "0.5em",
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="flex-end">
              <h4 style={{ margin: 0, marginRight: "1em", fontWeight: "300" }}>
                Welcome, {user && user.firstname} {user && user.lastname}
              </h4>
              {user && (
                <Button
                  onClick={onLogout}
                  className="menu_font"
                  startIcon={<LogoutIcon />}
                >
                  Logout
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Divider orientation="horizontal" />
      {children}
    </>
  );
}

export default Header;
