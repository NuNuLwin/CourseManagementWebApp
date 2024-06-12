import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import { Container, Grid, Divider, Box, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useEffect, useState } from "react";

function Header({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const pathname = window.location.pathname;
  const [currentURL, setCurrentURL] = useState(pathname);

  useEffect(() => {
    setCurrentURL(pathname.split("/")[1]);
  }, [pathname]);

  useEffect(() => {
    // console.log("CURRENT URL:", currentURL);
  }, [currentURL]);

  const onLogout = () => {
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
          <Grid
            item
            md={3}
            xs={12}
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              src={process.env.PUBLIC_URL + "/higher-education.png"}
              alt="Logo"
              style={{
                width: "50px",
                height: "50px",
                marginRight: "0.5em",
              }}
            />
            <div>
              <Typography
                variant="h6"
                style={{
                  //marginBottom: "0.5em",
                  color: "#0D3675",
                  fontSize: "18px",
                }}
              >
                EDU LINK
              </Typography>
              <h4 className="uni_title">University of Regina</h4>
            </div>
          </Grid>

          <Grid
            item
            md={3}
            xs={12}
            style={{
              paddingTop: "0.5em",
            }}
          >
            {user && (
              <>
                <Button
                  onClick={onMyCourses}
                  className={`buttoncolor menu_font ${
                    currentURL !== "createCourse" && "active"
                  }`}
                >
                  My Courses
                </Button>
                {user.role !== "student" && (
                  <Button
                    onClick={onCreateCourse}
                    className={`buttoncolor menu_font ${
                      currentURL === "createCourse" && "active"
                    }`}
                  >
                    Create Course
                  </Button>
                )}
              </>
            )}
          </Grid>

          <Grid
            item
            md={6}
            xs={12}
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
