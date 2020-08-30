import React, { useState } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { signOut } from "../../actions/authActions";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  IconButton,
  ListItem,
  SwipeableDrawer,
  Link,
  Hidden,
  List,
} from "@material-ui/core";
import { Menu as MenuIcon, Timeline as TimelineIcon } from "@material-ui/icons";
import { CookieNotification } from "../";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    [theme.breakpoints.down("xs")]: {
      flexDirection: "row-reverse",
    },
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    color: theme.palette.text.primary,
    marginRight: theme.spacing(2),
  },
  icon: {
    verticalAlign: "text-top",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
}));

const NavBar = ({ uid, signOut }) => {
  const classes = useStyles();

  // side drawer on landing page
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <CookieNotification />
      <AppBar
        position="sticky"
        elevation={0}
        variant="outlined"
        color="inherit"
      >
        {/* if authenticated use styling for toolbarAuthed else use normal styling */}
        <Toolbar className={classes.toolbar}>
          <Hidden smUp>
            {uid ? (
              <>
                <Typography component="span">
                  {/* <Link
                    component={NavLink}
                    to="/dashboard"
                    className={classes.link}
                  >
                    Dashboard
                  </Link> */}

                  <Button
                    component={NavLink}
                    to="/dashboard"
                    color="primary"
                    variant="contained"
                    size="small"
                  >
                    Dashboard
                  </Button>
                </Typography>
                <Typography component="span">
                  <Link
                    component={NavLink}
                    to="/signin"
                    onClick={signOut}
                    className={classes.link}
                  >
                    Sign out
                  </Link>
                </Typography>
              </>
            ) : (
                <>
                  <Button
                    component={NavLink}
                    to="/signin"
                    color="primary"
                    variant="contained"
                    size="small"
                  >
                    Get Started
                  </Button>

                  <Button
                    component={NavLink}
                    to="/signin"
                    color="primary"
                    variant="outlined"
                    className={classes.link}
                    size="small"
                  >
                    Sign In
                </Button>
                </>
              )}
          </Hidden>

          <Typography
            component="span"
            variant="h6"
            className={classes.toolbarTitle}
          >
            {/* logo link. when clicked scroll to top of the window && if authenticated navigate to /dashboard else / */}
            <Link
              component={NavLink}
              to="/"
              onClick={() => window.scrollTo(0, 0)}
              className={classes.link}
              underline="none"
            >
              <TimelineIcon className={classes.icon} /> Bowhead
            </Link>
          </Typography>

          <Hidden xsDown>
            <nav>
              {uid ? (
                <>
                  <Typography component="span">
                    <Link
                      component={NavLink}
                      to="/signin"
                      onClick={signOut}
                      className={classes.link}
                    >
                      Sign out
                    </Link>
                  </Typography>
                  <Typography component="span">
                    {/* <Link
                      component={NavLink}
                      to="/dashboard"
                      className={classes.link}
                    >
                      Dashboard
                    </Link> */}

                    <Button
                      component={NavLink}
                      to="/dashboard"
                      color="primary"
                      variant="contained"
                      size="small"
                    >
                      Dashboard
                  </Button>
                  </Typography>
                </>
              ) : (
                  <>
                    <Typography component="span">
                      <Link href="#features" className={classes.link}>
                        Features
                    </Link>
                    </Typography>
                    <Typography component="span">
                      <Link href="#pricing" className={classes.link}>
                        Pricing
                    </Link>
                    </Typography>
                    <Button
                      component={NavLink}
                      to="/signin"
                      color="primary"
                      variant="outlined"
                      className={classes.link}
                    >
                      Sign In
                  </Button>

                    <Button
                      component={NavLink}
                      to="/signin"
                      color="primary"
                      variant="contained"
                    >
                      Get Started
                  </Button>
                  </>
                )}
            </nav>
          </Hidden>

          <Hidden smUp>
            {/* burger menu is only visible when not authenticated */}
            <IconButton onClick={handleDrawerToggle} edge="start">
              <MenuIcon />
            </IconButton>
          </Hidden>

          <SwipeableDrawer
            open={drawerOpen}
            onClose={handleDrawerToggle}
            onOpen={handleDrawerToggle}
            anchor="left"
          >
            <List
              role="presentation"
              onClick={handleDrawerToggle}
              onKeyDown={handleDrawerToggle}
              disablePadding
            >
              {uid ? (
                <>
                  <ListItem>
                    <Typography component="span">
                      {/* <Link href="/dashboard" className={classes.link}>
                        Dashboard
                      </Link> */}

                      <Button
                        component={NavLink}
                        to="/dashboard"
                        color="primary"
                        variant="contained"
                        size="small"
                      >
                        Dashboard
                      </Button>
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography component="span">
                      <Link
                        component={NavLink}
                        to="/signin"
                        onClick={signOut}
                        className={classes.link}
                      >
                        Sign out
                      </Link>
                    </Typography>
                  </ListItem>
                </>
              ) : (
                  <>
                    <ListItem>
                      <Typography component="span">
                        <Link href="#features" className={classes.link}>
                          Features
                      </Link>{" "}
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Typography component="span">
                        <Link href="#pricing" className={classes.link}>
                          Pricing
                      </Link>{" "}
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Button
                        component={NavLink}
                        to="/signin"
                        color="primary"
                        variant="outlined"
                        className={classes.link}
                      >
                        Sign In
                    </Button>
                    </ListItem>
                    <ListItem>
                      <Button
                        component={NavLink}
                        to="/signin"
                        color="primary"
                        variant="contained"
                      >
                        Get Started
                    </Button>
                    </ListItem>
                  </>
                )}
            </List>
          </SwipeableDrawer>
        </Toolbar>
      </AppBar>
    </>
  );
};

const mapStateToProps = ({ firebase: { auth: { uid } } }) => {
  return {
    uid,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
